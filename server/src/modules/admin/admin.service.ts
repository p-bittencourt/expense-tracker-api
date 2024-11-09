import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from '../users/user.dto';
import { IUser } from '../users/user.model';
import { AdminUserRepository } from './admin.repository';
import { IAdminUserService } from './interfaces/IAdminUserService';

export class AdminUserService implements IAdminUserService {
  constructor(private adminUserRepository: AdminUserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return await this.adminUserRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<UserResponseDTO> {
    const user = await this.adminUserRepository.getUserById(id);
    return new UserResponseDTO(user);
  }

  async getUserByName(name: string): Promise<UserResponseDTO | null> {
    const user = await this.adminUserRepository.findOne({ username: name });
    if (!user) return null;
    return new UserResponseDTO(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDTO | null> {
    const user = await this.adminUserRepository.findOne({ email: email });
    if (!user) return null;
    return new UserResponseDTO(user);
  }

  async getUserByAuth0Id(auth0Id: string): Promise<UserResponseDTO | null> {
    const user = await this.adminUserRepository.findOne({ auth0Id: auth0Id });
    if (!user) return null;
    return new UserResponseDTO(user);
  }

  async createUser(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const createdUser = await this.adminUserRepository.createUser(userData);
    return new UserResponseDTO(createdUser);
  }

  async deleteUser(id: string): Promise<UserResponseDTO> {
    const deletedUser = await this.adminUserRepository.deleteUser(id);
    return new UserResponseDTO(deletedUser);
  }

  async updateUser(
    id: string,
    userData: UpdateUserDTO
  ): Promise<UserResponseDTO> {
    const updatedUser = await this.adminUserRepository.updateUser(id, userData);
    return new UserResponseDTO(updatedUser);
  }
}
