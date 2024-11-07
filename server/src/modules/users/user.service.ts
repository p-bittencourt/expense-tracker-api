import { UserRepository } from './user.repository';
import type { IUser } from './user.model';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from './user.dto';
import { IUserService } from './interfaces/IUserServices';
import { NotImplementedError } from '@/types/errors';

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<IUser> {
    return await this.userRepository.getUserById(id);
  }

  async createUser(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const createdUser = await this.userRepository.createUser(userData);
    return new UserResponseDTO(createdUser);
  }

  async deleteUser(id: string): Promise<UserResponseDTO> {
    const deletedUser = await this.userRepository.deleteUser(id);
    return new UserResponseDTO(deletedUser);
  }

  async editUser(
    id: string,
    userData: UpdateUserDTO
  ): Promise<UserResponseDTO> {
    const editedUser = await this.userRepository.editUser(id, userData);
    return new UserResponseDTO(editedUser);
  }

  async findByAuth0Id(auth0Id: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findOne({ auth0Id });
    if (!user) return null;
    return new UserResponseDTO(user);
  }

  // TODO: Add new functions to the interface
}
