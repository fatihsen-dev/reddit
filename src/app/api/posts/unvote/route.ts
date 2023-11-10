import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

type BodyT = {
  postId: number;
  userId: string;
};

const bodySchema = z.object({
  postId: z.number({ required_error: "postId required" }),
  userId: z.string({ required_error: "userId required" }),
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

    await db.vote.deleteMany({
      where: {
        postId: body.postId,
        userId: body.userId,
      },
    });

    const isVoted = await db.unVote.findFirst({
      where: {
        postId: body.postId,
        userId: body.userId,
      },
    });

    const getPost = async () => {
      return await db.post.findUnique({
        where: {
          id: body.postId,
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
    };

    if (isVoted) {
      await db.unVote.deleteMany({
        where: {
          postId: body.postId,
          userId: body.userId,
        },
      });

      const post = await getPost();

      if (!post) {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(post);
    }
    await db.unVote.create({
      data: {
        postId: body.postId,
        userId: body.userId,
      },
    });

    const post = await getPost();

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};
