// utils/mongoDB.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectToDatabase;
