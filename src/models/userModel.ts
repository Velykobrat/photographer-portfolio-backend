import mongoose, { Schema, Document } from 'mongoose';

// Інтерфейс для користувача
export interface IUser extends Document {
  email: string;
  password: string;
}

// Схема для користувача
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Модель User
export default mongoose.model<IUser>('User', userSchema);
