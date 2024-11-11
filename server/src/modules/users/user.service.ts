import { UserRepository } from './user.repository';
import { IUserService } from './interfaces/IUserServices';
import { UserResponseDTO } from './user.dto';

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getCurrentUser(auth0Id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.getCurrentUser(auth0Id);
    return new UserResponseDTO(user);
  }
}
