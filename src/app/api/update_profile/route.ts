import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { editProfileSchema } from "~/validation/editProfile";

type BodyT = {
  id: string;
  name: string;
  surname: string;
  image: string;
  desc: string;
};

const extendEditProfileSchema = editProfileSchema.extend({
  id: z
    .string({ required_error: "Id required" })
    .min(2, { message: "Id can be a minimum of 3 characters" })
    .max(100, { message: "Id can be maximum 12 characters" }),
});

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as BodyT;

    const response = extendEditProfileSchema.safeParse(body);
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
        image: body.image,
        desc: body.desc,
      },
      where: {
        id: body.id,
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
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};
