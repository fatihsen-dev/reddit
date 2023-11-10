import { NextResponse } from "next/server";
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
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};
