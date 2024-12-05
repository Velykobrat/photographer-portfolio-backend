import mongoose, { Schema, Document } from 'mongoose';

interface IImage extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  filePath: string;
  description?: string;
  createdAt: Date;
}

const imageSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  filePath: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IImage>('Image', imageSchema);
