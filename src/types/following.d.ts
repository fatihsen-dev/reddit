import type { UserFollower } from "@prisma/client";

type IFollowedId = Omit<UserFollower, "id" | "followerId" | "createdAt">;
