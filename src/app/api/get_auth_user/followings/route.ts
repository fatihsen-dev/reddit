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
        { message: "username not specified" },
        { status: 404 },
      );
    }

    const data = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        following: {
          select: {
            followedId: true,
          },
        },
      },
    });

    if (data) {
      return NextResponse.json(data.following);
    }
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
