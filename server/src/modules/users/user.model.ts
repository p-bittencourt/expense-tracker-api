import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expenses' }],
  },
  { timestamps: true }
);

//
export interface IUser extends Document {
  id: ObjectId;
  auth0id: string;
  username: string;
  email: string;
  expenses: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create and export the model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
