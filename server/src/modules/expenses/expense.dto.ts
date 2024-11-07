import {
  IsString,
  IsNumber,
  IsEnum,
  Min,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ExpenseType } from './expense-type.enum';
import { ObjectId } from 'mongoose';
import { IExpense } from './expense.model';

export class CreateExpenseDTO {
  @IsString()
  @MaxLength(100, { message: 'Title cannot be longer than 100 characters' })
  title!: string;

  @IsNumber()
  @Min(0, { message: 'Cost cannot be negative' })
  cost!: number;

  @IsEnum(ExpenseType, { message: 'Invalid expense type' })
  @IsOptional()
  type?: ExpenseType;
}

export class UpdateExpenseDTO {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;

  @IsEnum(ExpenseType)
  @IsOptional()
  type?: ExpenseType;
}

export class ExpenseResponseDTO {
  id?: ObjectId;
  userId?: ObjectId;
  title!: string;
  cost!: number;
  type!: ExpenseType;
  createdAt?: Date;

  constructor(expense: IExpense) {
    this.id = expense.id;
    this.userId = expense.userId;
    this.title = expense.title;
    this.cost = expense.cost;
    this.type = expense.type;
    this.createdAt = expense.createdAt;
  }
}
