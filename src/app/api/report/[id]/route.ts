/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest } from "next";
import type { NextRequest as MiddlewareRequest } from "next/server"; // optional clarity
import type { NextFetchEvent } from "next/server"; // optional

import dbConnect from "@/lib/dbConfig";
import { ReportModel } from "@/models/report.models";

type Context = {
  params: { id: string };
};

export async function PUT(
  req: NextRequest,
  context: Context
) {
  await dbConnect();

  try {
    const { status } = await req.json();

    const updated = await ReportModel.findByIdAndUpdate(
      context.params.id,
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
