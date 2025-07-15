/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { QueryModel } from "@/models/queries.model";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  const { id } = context.params;

  try {
    const query = await QueryModel.findById(id).populate("owner", "name profilePicture");
    if (!query) {
      return NextResponse.json({ success: false, error: "Query not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: query });
  } catch (error: any) {
    console.error("Error fetching single query:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
