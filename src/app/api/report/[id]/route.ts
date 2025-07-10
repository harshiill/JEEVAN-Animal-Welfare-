import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { ReportModel } from "@/models/report.models";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  try {
    const { id } = context.params;
    const { status } = await req.json();

    const updated = await ReportModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
