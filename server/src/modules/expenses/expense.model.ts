import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { ExpenseType } from './expense-type.enum';

const ExpenseSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    cost: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(ExpenseType),
      required: true,
      default: ExpenseType.OTHER,
    },
  },
  { timestamps: true }
);

export interface IExpense extends Document {
  id: ObjectId;
  userId: ObjectId;
  title: string;
  cost: number;
  type: ExpenseType;
  createdAt: Date;
  updatedAt: Date;
}

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
export default Expense;
