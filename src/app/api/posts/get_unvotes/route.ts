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

    const unvotes = await db.unVote.findMany({
      where: {
        userId,
      },
      select: {
        postId: true,
      },
    });

    return NextResponse.json(unvotes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};
