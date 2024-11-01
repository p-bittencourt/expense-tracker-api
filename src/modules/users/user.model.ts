import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expenses' }],
  },
  { timestamps: true }
);

//
export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  expenses: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create and export the model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
