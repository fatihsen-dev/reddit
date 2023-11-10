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
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "USERNAME",
        },
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
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            password: true,
          },
        });

        if (!user || !(await compare(credentials.password, user.password!))) {
          return null;
        }

        return {
          ...user,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      const { password, picture, sub, jti, updatedAt, iat, exp, ...other } =
        token;

      if (!other.username) {
        const user = await db.user.update({
          data: {
            username: await getGithubUser(other.email ?? ""),
          },
          select: {
            name: true,
            email: true,
            username: true,
            image: true,
            id: true,
          },
          where: {
            email: other.email ?? "",
          },
        });

        return {
          ...session,
          user: {
            ...user,
          },
        };
      } else {
        return {
          ...session,
          user: {
            ...other,
          },
        };
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
