import { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export const GET = async (request: NextRequest) => {
  try {
    const userId = request.nextUrl.searchParams.get("id");

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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};
