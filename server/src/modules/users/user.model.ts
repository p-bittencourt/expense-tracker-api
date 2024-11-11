import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DEPENDENT = 'DEPENDENT',
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    auth0Id: { type: String, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Roles, default: Roles.USER },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expenses' }],
  },
  { timestamps: true }
);

//
export interface IUser extends Document {
  id: ObjectId;
  auth0Id: string;
  username: string;
  email: string;
  role: Roles;
  expenses: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create and export the model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
