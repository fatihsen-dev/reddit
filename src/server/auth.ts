import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
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
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      const userId = user.id;
      const existingUser = await db.user.findUnique({
        where: { id: userId },
        select: {
          username: true,
          email: true,
          id: true,
          image: true,
          name: true,
          createdAt: true,
        },
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
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
