/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/razorpay/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  const { amount } = await request.json();

  if (!amount) {
    return NextResponse.json({ error: "Amount required" }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: amount * 100, 
    currency: "INR",
    receipt: `receipt_order_${Math.random() * 1000}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
