import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { registerSchema } from "~/validation/register";

type BodyT = {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
};

export const POST = async (req: Request) => {
  try {
    const data = (await req.json()) as BodyT;

    const response = registerSchema.safeParse(data);
    if (!response.success) {
      return NextResponse.json(
        {
          message: response.error.issues[0]?.message,
        },
        { status: 400 },
      );
    }

    const existingUserUsername = await db.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (existingUserUsername) {
      return NextResponse.json(
        {
          message: "Username already in use",
        },
        { status: 409 },
      );
    }

    const existingUserEmail = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUserEmail) {
      return NextResponse.json(
        {
          message: "Email address already in use",
        },
        { status: 409 },
      );
    }

    await db.user.create({
      data: {
        username: data.username,
        email: data.email,
        name: `${data.name} ${data.surname}`,
        password: await hashPassword(data.password, 12),
      },
    });
    return NextResponse.json({
      message: "Welcome aboard, you can log in now 😊",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};

const hashPassword = async (
  password: string,
  salt: number,
): Promise<string> => {
  // @ts-ignore
  return await hash(password, salt);
};
