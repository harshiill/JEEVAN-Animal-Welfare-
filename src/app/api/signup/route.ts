import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/user.models";
import { sendEmail } from "@/helpers/mailer";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { name, email: rawEmail, password, profilePicture } = await req.json();

    if (!name || !rawEmail || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase().trim();

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
        availabilityRadius: 0,
        profilePicture,
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
      });
    }

    try {
      await sendEmail({
        email,
        emailType: "verify",
        name,
        otp: verifyCode,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        { message: "User created, but failed to send verification email." },
        { status: 500 }
      );
    }

     const response = NextResponse.json({
  message: "User created successfully. Verification email sent.",
});

response.cookies.set("signupEmail", email, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60, // 1 hour
  path: "/",
});

return response;

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
