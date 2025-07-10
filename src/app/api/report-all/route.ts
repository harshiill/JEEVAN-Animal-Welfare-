import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { ReportModel } from "@/models/report.models";

export async function GET() {
    await dbConnect();

    try {
        const reports = await ReportModel.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
