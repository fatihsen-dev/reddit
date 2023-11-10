import type { User } from "@prisma/client";

type IUser = Omit<
  User & {
    _count: {
      followers: number;
      following: number;
    };
  },
  "password"
>;
