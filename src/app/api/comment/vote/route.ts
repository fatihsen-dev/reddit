import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { errorHandler } from "~/libs/error";
import { sessionCheck } from "~/libs/sessionCheck";
import { db } from "~/server/db";

type BodyT = {
  commentId: number;
};

const bodySchema = z.object({
  commentId: z.number({ required_error: "commentId required" }),
});

export const POST = async (req: NextRequest) => {
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

    await db.commentUnVote.deleteMany({
      where: {
        commentId: body.commentId,
        userId: session.user.id,
      },
    });

    const isVoted = await db.commentVote.findFirst({
      where: {
        commentId: body.commentId,
        userId: session.user.id,
      },
    });

    if (isVoted) {
      await db.commentVote.deleteMany({
        where: {
          commentId: body.commentId,
          userId: session.user.id,
        },
      });

      return NextResponse.json({ message: "remove-vote" });
    }

    await db.commentVote.create({
      data: {
        commentId: body.commentId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "vote" });
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
