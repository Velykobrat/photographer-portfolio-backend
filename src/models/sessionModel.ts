// src/models/sessionModel.ts

import mongoose, { Schema, Document } from 'mongoose';

// Інтерфейс для сесії
interface ISession extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  accessTokenValidUntil: Date;
  refreshTokenValidUntil: Date;
}

// Схема для сесій
const sessionsSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Маємо зв'язок з користувачем
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Модель сесії
export const SessionsCollection = mongoose.model<ISession>('Session', sessionsSchema);
