import mongoose, { Document, Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface Query extends Document {
  title?: string;
  content: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  parent?: mongoose.Schema.Types.ObjectId | null; 
  children?: Query[];
}

const QuerySchema = new Schema<Query>(
  {
    title: { type: String, trim: true }, 
    content: { type: String, required: true, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      autopopulate: { select: 'name profilePicture' },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'queries',
      default: null,
      autopopulate: true,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'queries',
        autopopulate: true,
      },
    ],
  },
  { timestamps: true }
);

QuerySchema.plugin(autopopulate);
QuerySchema.plugin(mongooseAggregatePaginate);

export const QueryModel =
  mongoose.models.queries || mongoose.model<Query>('queries', QuerySchema);
