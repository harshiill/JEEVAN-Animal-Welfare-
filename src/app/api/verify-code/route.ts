import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/user.models";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    if (!username || !code) {
      return NextResponse.json(
        { success: false, message: "Username and code are required." },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User is already verified." },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });

      return NextResponse.json(
        { success: true, message: "User verified successfully." },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired. Please sign up again.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verify code route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while verifying the code.",
      },
      { status: 500 }
    );
  }
}
