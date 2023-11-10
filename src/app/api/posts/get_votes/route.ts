import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.nextUrl.searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "userid not found" },
        { status: 404 },
      );
    }

    const votes = await db.vote.findMany({
      where: {
        userId,
      },
      select: {
        postId: true,
      },
    });

    return NextResponse.json(votes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};
