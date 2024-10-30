export class CreateUserDTO {
  username!: string;
  email!: string;
  password!: string;
}

export class UpdateUserDTO {
  username?: string;
  email?: string;
}

export class UserResponseDTO {
  id!: string;
  username!: string;
  email!: string;
  expenseCount!: number;
  createdAt!: Date;
}
