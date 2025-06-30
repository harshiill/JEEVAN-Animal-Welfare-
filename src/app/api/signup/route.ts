import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/user.models";

export async function POST(req: NextRequest) {
  await dbConnect();
  
  const { name, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: "",
      verificationTokenExpires: null,
      resetPasswordToken: "",
      resetPasswordExpires: null,
      availabilityRadius: 0,
      profilePicture: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
      }
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
