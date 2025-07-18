import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { ReportModel } from "@/models/report.models";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// ✅ PUT: Update report status and assign rescuer
export async function PUT(req: NextRequest) {
  await dbConnect();

  const userData = getDataFromToken(req);
  if (!userData?.id || !userData?.name) {
    return NextResponse.json({ success: false, error: "Unauthorized or invalid user data" }, { status: 401 });
  }

  const rescuerId = userData.id;

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // get report ID from URL
    const { status } = await req.json();

    const updatedReport = await ReportModel.findByIdAndUpdate(
      id,
      {
        status,
        assignedVolunteer: rescuerId,
      },
      { new: true }
    );

    if (!updatedReport) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedReport });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// ✅ DELETE: Remove report (only by original reporter)
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const reporterId = getDataFromToken(req)?.id;
    if (!reporterId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const report = await ReportModel.findById(id);
    if (!report) {
      return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 });
    }

    if (report.reporter.toString() !== reporterId) {
      return NextResponse.json({ success: false, error: "Forbidden: Not your report" }, { status: 403 });
    }

    await ReportModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
