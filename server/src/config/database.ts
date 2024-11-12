import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGO_URI is not defined in the environment.');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export async function updateUserSchema() {
  const db = mongoose.connection;
  await db.collection('users').updateMany(
    { expenses: { $type: 'array' } }, // ensure it’s an array of ObjectIds
    { $set: { 'expenses.$[].ref': 'Expense' } }
  );
}

export default connectDB;
