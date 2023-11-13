import { NextResponse } from "next/server";
import { errorHandler } from "~/libs/error";
import { db } from "~/server/db";

export const GET = async () => {
  try {
    const posts = await db.post.findMany({
      where: {
        public: true,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            votes: true,
            unVotes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
