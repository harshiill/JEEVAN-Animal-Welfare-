import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/user.models";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { name, email, password, profilePicture } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry

    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }

      
      await UserModel.updateOne(
        { email },
        {
          password: hashedPassword,
          verificationToken: verifyCode,
          verificationTokenExpires: expiryDate,
        }
      );
    } else {
     
      await UserModel.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: verifyCode,
        verificationTokenExpires: expiryDate,
        resetPasswordToken: "",
        resetPasswordExpires: null,
        availabilityRadius: 0,
        profilePicture,
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
      });
    }

    const emailResponse = await sendVerificationEmail(email, name, verifyCode);

    
    if (emailResponse.status !== 200) {
      return NextResponse.json(
        { message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully. Verification email sent." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
