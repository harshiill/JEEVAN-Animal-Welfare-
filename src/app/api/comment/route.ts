/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/comment/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { QueryModel } from "@/models/queries.model";

const COMMENTS_PER_PAGE = 5;

export async function POST(req: NextRequest) {
  await dbConnect();

  const user = getDataFromToken(req);
  if (!user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { queryId, content } = await req.json();

    if (!queryId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing queryId or content" },
        { status: 400 }
      );
    }

    const newComment = await QueryModel.create({
      content: content.trim(),
      owner: user.id,
      parent: queryId,
    });

    // Push this comment into the parent's children array
    await QueryModel.findByIdAndUpdate(queryId, {
      $push: { children: newComment._id },
    });

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding comment:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const queryId = searchParams.get("queryId");
  const page = parseInt(searchParams.get("page") || "1");

  if (!queryId) {
    return NextResponse.json({ success: false, error: "Missing queryId" }, { status: 400 });
  }

  try {
    const totalComments = await QueryModel.countDocuments({ parent: queryId });

    const comments = await QueryModel.find({ parent: queryId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * COMMENTS_PER_PAGE)
      .limit(COMMENTS_PER_PAGE)
      .populate("owner", "name profilePicture");

    const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);

    return NextResponse.json({
      success: true,
      data: { comments, totalPages },
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
