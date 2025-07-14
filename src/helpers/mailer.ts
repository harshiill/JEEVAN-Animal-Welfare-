/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import React from "react";
import VerificationEmail from "../../Emails/VerificationEmail";

interface SendEmailParams {
  email: string;
  emailType: "verify" | "reset";
  name: string;
  otp: string;
}

export const sendEmail = async ({ email, emailType, name, otp }: SendEmailParams) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM || "",
        pass: process.env.PASS || "",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const htmlContent = await render(
      React.createElement(VerificationEmail, { name, otp })
    );

    const subject = emailType === "verify" ? "Verify your account" : "Reset your password";

    const mailOptions = {
      from: process.env.EMAIL_FROM || "",
      to: email,
      subject,
      html: htmlContent,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
