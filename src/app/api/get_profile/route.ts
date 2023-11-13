import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorHandler } from "~/libs/error";
import { db } from "~/server/db";

export const GET = async (request: NextRequest) => {
  try {
    const username = request.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "username not specified" },
        { status: 404 },
      );
    }

    const user = await db.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        desc: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
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
