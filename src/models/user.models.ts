import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken: string;
  verificationTokenExpires: Date | null;
  resetPasswordToken: string;
  resetPasswordExpires: Date | null;
  availabilityRadius: number;
  profilePicture: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' },
    verificationTokenExpires: { type: Date, default: null },
    resetPasswordToken: { type: String, default: '' },
    resetPasswordExpires: { type: Date, default: null },
    availabilityRadius: { type: Number, default: 0 },
    profilePicture: { type: String, default: '' },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    }
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.users || mongoose.model<User>('users', UserSchema);
