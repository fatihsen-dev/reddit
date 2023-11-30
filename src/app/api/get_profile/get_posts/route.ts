import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorHandler } from "~/libs/error";
import { db } from "~/server/db";

export const GET = async (request: NextRequest) => {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      {
        message: "username required",
      },
      { status: 400 },
    );
  }
  try {
    const posts = await db.post.findMany({
      where: {
        public: true,
        user: {
          username,
        },
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
