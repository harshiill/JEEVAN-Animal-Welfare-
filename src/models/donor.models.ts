import mongoose, { Document, Schema } from 'mongoose';

export interface Donor extends Document {
  name: string;
  email: string;
  amount: number;
  purpose: string;
  paymentId: string;
  donationDate: Date;
}

const DonorSchema = new Schema<Donor>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    amount: { type: Number, required: true },
    paymentId: { type: String, required: true }, // Razorpay payment ID or order ID
    donationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DonorModel =
  mongoose.models.donors || mongoose.model<Donor>('donors', DonorSchema);
