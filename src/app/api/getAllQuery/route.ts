/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { QueryModel } from "@/models/queries.model";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const user = getDataFromToken(req);
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const page = Number(req.nextUrl.searchParams.get('page')) || 1;
const limit = 10;
const skip = (page - 1) * limit;

const queries = await QueryModel.find()
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate("owner", "name email profilePicture");


    return NextResponse.json({ success: true, data: queries }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching queries:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
