import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { DonorModel } from "@/models/donor.models";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    const donation = await DonorModel.create(body);
    return NextResponse.json({ success: true, donation });
  } catch (error) {
    console.error("Error recording donation:", error);
    return NextResponse.json({ success: false, error: "Failed to record donation" }, { status: 500 });
  }
}
