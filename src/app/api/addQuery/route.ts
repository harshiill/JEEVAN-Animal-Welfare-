/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { QueryModel } from "@/models/queries.model";

export async function POST(req: NextRequest) {
  await dbConnect();

  const user = getDataFromToken(req);
  const id = user?.id;

  if (!id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newQuery = await QueryModel.create({
      owner: id,
      title: title.trim(),
      content: content.trim(),
    });

    return NextResponse.json(
      { success: true, data: newQuery },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating query:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
