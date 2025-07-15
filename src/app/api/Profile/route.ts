/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDataFromToken } from "@/helpers/getDataFromToken";
import dbConnect from "@/lib/dbConfig";
import { DonorModel } from "@/models/donor.models";
import { ReportModel } from "@/models/report.models";
import { UserModel } from "@/models/user.models";
import mongoose from "mongoose";
import { NextRequest,NextResponse } from "next/server";


export async function GET(request : NextRequest)
{
    await dbConnect();
    const userData = getDataFromToken(request);
    if (!userData) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = userData;
    const user = await UserModel.findById(id);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await UserModel.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(id),
        },
    },
    {
        $lookup: {
            from: "reports",
            localField: "_id",
            foreignField: "reporter",
            as: "reports",
        },
    },
    {
        $lookup: {
            from: "reports",
            localField: "_id",
            foreignField: "assignedVolunteer",
            as: "assignedVolunteerDetails",
        },
    },
    {
        $lookup: {
            from: "donors",
            localField: "email",
            foreignField: "email",
            as: "donations",
        },
    },
    {
        $addFields: {
            totalReportsIssued: { $size: "$reports" },
            totalDonations: { $size: "$donations" },
            totalAmountDonated: {
                $sum: "$donations.amount",
            },
            totalRescuedAnimals: { $size: "$assignedVolunteerDetails" },
        },
    },
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            createdAt: 1,
            profilePicture: 1,
            totalReportsIssued: 1,
            totalDonations: 1,
            totalAmountDonated: 1,
            totalRescuedAnimals: 1,
            availabilityRadius: 1,
        },
    },
]);


 const response = {
        success: true,
        data: profile[0] || {},
    };

    return NextResponse.json(response);
    



}