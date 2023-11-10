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
