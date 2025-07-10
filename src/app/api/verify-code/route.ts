import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/user.models";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, code } = await request.json();

    const decodedemail = decodeURIComponent(email);

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "email and code are required." },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email: decodedemail });

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

    const isCodeValid = user.verificationToken === code;
const isCodeNotExpired = new Date(user.verificationTokenExpires) > new Date();


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
