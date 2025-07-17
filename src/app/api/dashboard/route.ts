/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/user.models";
import { DonorModel } from "@/models/donor.models";
import { ReportModel } from "@/models/report.models";

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const totalVolunteers = await UserModel.countDocuments();

        const donorAggregation = await DonorModel.aggregate([
            {
                $group: {
                    _id: "$email",
                    totalAmountPerDonor: { $sum: "$amount" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalDonors: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmountPerDonor" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalDonors: 1,
                    totalAmount: 1
                }
            }
        ]);
        const donorsStats = donorAggregation[0] || { totalDonors: 0, totalAmount: 0 };

        const totalReports = await ReportModel.countDocuments();

        const rescuedAggregation = await ReportModel.aggregate([
            { $match: { status: "resolved" } },
            {
                $group: {
                    _id: null,
                    totalRescued: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalRescued: 1
                }
            }
        ]);
        const rescuedStats = rescuedAggregation[0] || { totalRescued: 0 };

        const Reports = await ReportModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "assignedVolunteer",
                    foreignField: "_id",
                    as: "assignedVolunteerDetails",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                profilePicture: 1
                            }
                        }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalVolunteers,
                totalDonors: donorsStats.totalDonors,
                totalAmount: donorsStats.totalAmount,
                totalReports,
                totalRescued: rescuedStats.totalRescued,
                reports: Reports
            }
        });

    } catch (error: any) {
        console.error("❌ Error fetching dashboard data:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
