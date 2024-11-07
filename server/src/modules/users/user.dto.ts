import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';
import { IUser } from './user.model';
import { ObjectId } from 'mongoose';

export class CreateUserDTO {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message:
      'Username can only contain letters, numbers, underscores and dashes',
  })
  username!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 9 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password!: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  username?: string;
  @IsOptional()
  @IsString()
  email?: string;
  @IsString()
  @MinLength(8, { message: 'Password must be at least 9 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  @IsOptional()
  password?: string;
}

export class UserResponseDTO {
  id?: ObjectId;
  @IsString()
  @IsOptional()
  username?: string;
  @IsString()
  @IsOptional()
  email?: string;
  @IsNumber()
  @IsOptional()
  expenses?: ObjectId[];
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor(user: IUser) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.expenses = user.expenses;
    this.createdAt = user.createdAt;
  }
}
