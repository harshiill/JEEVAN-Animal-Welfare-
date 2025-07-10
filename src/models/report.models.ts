import mongoose, { Document, Schema } from 'mongoose';

export interface Report extends Document {
  reporter: mongoose.Schema.Types.ObjectId;
  imageUrl: string;
  typeOfAnimal: string;
  description: string;
  diseasePrediction: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  assignedVolunteer: mongoose.Schema.Types.ObjectId | null;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<Report>(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false },
    imageUrl: { type: String, required: true },
    typeOfAnimal: { type: String, required: true },
    description: { type: String, required: true },
    diseasePrediction: { type: String, default: '' },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    },
    assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export const ReportModel = mongoose.models.reports || mongoose.model<Report>('reports', ReportSchema);
