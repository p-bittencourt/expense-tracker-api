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
  auth0Id!: string;

  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message:
      'Username can only contain letters, numbers, underscores and dashes',
  })
  username!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  username?: string;
  @IsOptional()
  @IsString()
  email?: string;
}

export class UserResponseDTO {
  id?: ObjectId;
  auth0id?: string;
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
    this.auth0id = user.auth0id;
    this.username = user.username;
    this.email = user.email;
    this.expenses = user.expenses;
    this.createdAt = user.createdAt;
  }
}
