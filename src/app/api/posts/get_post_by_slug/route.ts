import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorHandler } from "~/libs/error";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  try {
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ message: "Invalid slug" }, { status: 404 });
    }

    const post = await db.post.findFirst({
      where: {
        slug: slug,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            comments: true,
          },
        },
        votes: {
          where: {
            userId: session?.user.id,
          },
          select: {
            postId: true,
          },
        },
        unVotes: {
          where: {
            userId: session?.user.id,
          },
          select: {
            postId: true,
          },
        },
        comments: true,
        _count: {
          select: {
            votes: true,
            unVotes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
