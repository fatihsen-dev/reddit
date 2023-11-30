import { NextResponse } from "next/server";
import type { z } from "zod";
import { errorHandler } from "~/libs/error";
import { sessionCheck } from "~/libs/sessionCheck";
import { slugGenerate } from "~/libs/utils/slugGenerate";
import { db } from "~/server/db";
import { createPostSchema } from "~/validation/createPost";

export type BodyT = z.infer<typeof createPostSchema>;

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as BodyT;
    const session = await sessionCheck();

    const response = createPostSchema.safeParse(body);
    if (!response.success) {
      return NextResponse.json(
        {
          message: response.error.issues[0]?.message,
        },
        { status: 400 },
      );
    }

    const post = await db.post.create({
      data: {
        ...body,
        userId: session.user.id,
        slug: slugGenerate(body.title),
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            votes: true,
            unVotes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post could not be created" },
        { status: 400 },
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
