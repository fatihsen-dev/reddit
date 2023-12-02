import { NextResponse } from "next/server";
import { z } from "zod";
import { errorHandler } from "~/libs/error";
import { sessionCheck } from "~/libs/sessionCheck";
import { db } from "~/server/db";
import { createCommentSchema } from "~/validation/createComment";

const customSchema = createCommentSchema.and(
  z.object({
    postId: z.number(),
  }),
);

export type BodyT = z.infer<typeof customSchema>;

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as BodyT;
    const session = await sessionCheck();

    const response = customSchema.safeParse(body);
    if (!response.success) {
      return NextResponse.json(
        {
          message: response.error.issues[0]?.message,
        },
        { status: 400 },
      );
    }

    const comment = await db.comment.create({
      data: {
        userId: session.user.id,
        postId: body.postId,
        content: body.content,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment could not be created" },
        { status: 400 },
      );
    }

    const post = await db.post.findUnique({
      where: {
        id: body.postId,
      },
      select: {
        comments: {
          where: {
            parent: null,
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            _count: {
              select: {
                votes: true,
                unVotes: true,
              },
            },
            user: {
              select: {
                name: true,
                username: true,
                avatar: true,
              },
            },
            replies: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                _count: {
                  select: {
                    votes: true,
                    unVotes: true,
                  },
                },
                user: {
                  select: {
                    name: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
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

    return NextResponse.json(post);
  } catch (error) {
    const err = errorHandler(error as Error);
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }
};
