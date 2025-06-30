import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import VerificationEmail from "../../Emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  name: string,
  verifyCode: string
): Promise<NextResponse> {
  try {
    await resend.emails.send({
      from: "harshilkhandelwal28@gmail.com",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({
        name,
        otp: verifyCode,
      }),
    });

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
