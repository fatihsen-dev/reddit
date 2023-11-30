import { NextResponse } from "next/server";
import { errorHandler } from "~/libs/error";
import { sessionCheck } from "~/libs/sessionCheck";
import { db } from "~/server/db";

export const GET = async () => {
  try {
    const session = await sessionCheck();
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { message: "userid not found" },
        { status: 404 },
      );
    }

    const unvotes = await db.unVote.findMany({
      where: {
        userId,
      },
      select: {
        postId: true,
      },
    });

    return NextResponse.json(unvotes);
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
