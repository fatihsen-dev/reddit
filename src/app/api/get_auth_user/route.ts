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

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        desc: true,
        username: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        following: {
          select: {
            followedId: true,
          },
        },
      },
    });

    if (user) {
      return NextResponse.json(user);
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
