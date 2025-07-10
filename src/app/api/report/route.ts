import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { ReportModel } from "@/models/report.models";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        console.log("🟡 Incoming request body:", body);

        if (!body.imageUrl || !body.coordinates) {
            console.log("🔴 Missing required fields");
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }

        const newReport = await ReportModel.create({
            reporter: null,
            imageUrl: body.imageUrl,
            typeOfAnimal: body.typeOfAnimal,
            description: body.description,
            diseasePrediction: "",
            location: {
                type: "Point",
                coordinates: body.coordinates,
            },
        });

        console.log("🟢 Report created:", newReport);
        return NextResponse.json({ success: true, data: newReport });
    } catch (error: any) {
        console.error("❌ Error creating report:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
