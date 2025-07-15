/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/query/route.ts
import dbConnect from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { QueryModel } from "@/models/queries.model";

const PAGE_SIZE = 10; // You can change this if needed

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const skip = (page - 1) * PAGE_SIZE;

    const totalCount = await QueryModel.countDocuments({ parent: null });

    const queries = await QueryModel.find({ parent: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .populate("owner", "name profilePicture");

    return NextResponse.json({
      success: true,
      data: {
        queries, // <-- wrapped inside `data` as expected
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching queries:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = getDataFromToken(req);
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const newQuery = await QueryModel.create({
      title,
      content,
      owner: user.id,
      likes: [],
      parent: null,
    });

    return NextResponse.json({ success: true, data: newQuery }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating query:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to create query" },
      { status: 500 }
    );
  }
}
