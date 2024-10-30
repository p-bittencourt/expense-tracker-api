import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  username!: string;
  @IsString()
  email!: string;
  @IsString()
  password!: string;
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
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  username?: string;
  @IsString()
  @IsOptional()
  email?: string;
  @IsNumber()
  @IsOptional()
  expenseCount?: number;
  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
