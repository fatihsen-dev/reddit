import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorHandler } from "~/libs/error";
import { sessionCheck } from "~/libs/sessionCheck";
import { db } from "~/server/db";

export const GET = async (req: NextRequest) => {
  try {
    const session = await sessionCheck();
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { message: "userId not found" },
        { status: 404 },
      );
    }

    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ message: "Invalid slug" }, { status: 404 });
    }

    const votes = await db.commentVote.findMany({
      where: {
        userId,
        comment: {
          post: {
            slug,
          },
        },
      },
      select: {
        commentId: true,
      },
    });

    return NextResponse.json(votes);
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
