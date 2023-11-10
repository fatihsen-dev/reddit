import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

type BodyT = {
  followedId: string;
  followerId: string;
};

const bodySchema = z.object({
  followedId: z.string({ required_error: "followedId required" }),
  followerId: z.string({ required_error: "followerId required" }),
});

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as BodyT;

    const response = bodySchema.safeParse(body);
    if (!response.success) {
      return NextResponse.json(
        {
          message: response.error.issues[0]?.message,
        },
        { status: 400 },
      );
    }

    const isFollowed = await db.userFollower.findFirst({
      where: {
        followedId: body.followedId,
        followerId: body.followerId,
      },
    });

    if (isFollowed) {
      return NextResponse.json(
        {
          message: "the user is already being tracked",
        },
        { status: 400 },
      );
    }

    await db.userFollower.create({
      data: {
        followedId: body.followedId,
        followerId: body.followerId,
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
    return NextResponse.json({ message: "User not followed" }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};
