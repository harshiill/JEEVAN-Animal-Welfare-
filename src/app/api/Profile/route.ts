import { getDataFromToken } from "@/helpers/getDataFromToken";
import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/user.models";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

  // Handle pagination parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const skip = (page - 1) * limit;

  const profile = await UserModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
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
      $lookup: {
        from: "queries",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$owner", "$$userId"] },
                  { $eq: ["$parent", null] } // Only parent queries
                ]
              }
            }
          },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              createdAt: 1
            }
          }
        ],
        as: "queries",
      },
    },
    {
      $lookup: {
        from: "queries",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$owner", "$$userId"] },
                  { $eq: ["$parent", null] }
                ]
              }
            }
          },
          { $count: "total" }
        ],
        as: "queryCount",
      },
    },
    {
      $addFields: {
        totalReportsIssued: { $size: "$reports" },
        totalDonations: { $size: "$donations" },
        totalAmountDonated: { $sum: "$donations.amount" },
        totalRescuedAnimals: { $size: "$assignedVolunteerDetails" },
        totalQueriesPosted: {
          $ifNull: [{ $arrayElemAt: ["$queryCount.total", 0] }, 0],
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        createdAt: 1,
        profilePicture: 1,
        availabilityRadius: 1,
        totalReportsIssued: 1,
        totalDonations: 1,
        totalAmountDonated: 1,
        totalRescuedAnimals: 1,
        totalQueriesPosted: 1,
        queries: 1,
      },
    },
  ]);

  return NextResponse.json({
    success: true,
    data: profile[0] || {},
    currentPage: page,
  });
}
