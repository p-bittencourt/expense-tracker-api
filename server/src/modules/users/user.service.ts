import { UserRepository } from './user.repository';
import { IUserService } from './interfaces/IUserServices';
import { UserResponseDTO } from './user.dto';

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}
}
