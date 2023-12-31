import { NextResponse } from "next/server";
import { z } from "zod";
import { errorHandler } from "~/libs/error";
import { sessionCheck } from "~/libs/sessionCheck";
import { db } from "~/server/db";

type BodyT = {
  followedId: string;
};

const bodySchema = z.object({
  followedId: z.string({ required_error: "followedId required" }),
});

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as BodyT;
    const session = await sessionCheck();

    const response = bodySchema.safeParse(body);
    if (!response.success) {
      return NextResponse.json(
        {
          message: response.error.issues[0]?.message,
        },
        { status: 400 },
      );
    }

    const isUnFollowed = await db.userFollower.findFirst({
      where: {
        followedId: body.followedId,
        followerId: session.user.id,
      },
    });

    if (!isUnFollowed) {
      return NextResponse.json(
        {
          message: "user is not tracked",
        },
        { status: 400 },
      );
    }

    await db.userFollower.deleteMany({
      where: {
        followedId: body.followedId,
        followerId: session.user.id,
      },
    });

    const user = await db.user.findUnique({
      where: {
        id: body.followedId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        desc: true,
        email: true,
        emailVerified: true,
        avatar: true,
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
    return NextResponse.json({ message: "User not followed" }, { status: 404 });
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
