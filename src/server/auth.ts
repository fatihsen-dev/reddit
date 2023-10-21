import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

import { env } from "~/env.mjs";
import { getGithubUser } from "~/libs/utils/get-github-user";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string | null;
      username: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: env.NEXTAUTH_SECRET!,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (!user) {
          return null;
        }

        const { password, ...otherUserData } = user;

        const isPasswordValid = await compare(
          credentials.password,
          password ?? "",
        );

        if (!isPasswordValid) {
          return null;
        }

        return otherUserData;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      const userId = user.id;
      const existingUser = await db.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser?.username) {
        await db.user.update({
          where: { id: userId },
          data: { username: await getGithubUser(user.email) },
        });
      }

      return {
        ...session,
        user: {
          ...session.user,
          ...existingUser,
          id: userId,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
        };
      }
      return token;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
