import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { ReportModel } from "@/models/report.models";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function PUT(req: NextRequest) {
  await dbConnect();

  const userData = getDataFromToken(req);
  if (!userData) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status:
401 });
  }

  if (!userData.id) {
    return NextResponse.json({ success: false, error: "Invalid user data" }, { status: 400 });
  }

  if (!userData.name) {
    return NextResponse.json({ success: false, error: "Invalid user data" }, { status: 400 });
  }

  const RescuerId = userData.id; // Extract rescuer ID from token

      

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // ✅ extract ID from URL
    const { status } = await req.json();

    const updated = await ReportModel.findByIdAndUpdate(id,
      { status, assignedVolunteer: RescuerId } 
      , { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
