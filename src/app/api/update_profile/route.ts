import { NextResponse } from "next/server";
import { errorHandler } from "~/libs/error";
import { sessionCheck } from "~/libs/sessionCheck";
import { db } from "~/server/db";
import { editProfileSchema } from "~/validation/editProfile";

type BodyT = {
  name: string;
  surname: string;
  avatar: string;
  desc: string;
};

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as BodyT;
    const response = editProfileSchema.safeParse(body);

    const session = await sessionCheck();

    if (!response.success) {
      console.log(response.error);
      return NextResponse.json(
        {
          message: response.error.issues[0]?.message,
        },
        { status: 400 },
      );
    }

    const user = await db.user.update({
      data: {
        name: `${body.name} ${body.surname}`,
        avatar: body.avatar,
        desc: body.desc,
      },
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        desc: true,
        username: true,
        email: true,
        emailVerified: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        following: {
          select: {
            followedId: true,
          },
        },
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
    return NextResponse.json({ message: "User not updated" }, { status: 404 });
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
