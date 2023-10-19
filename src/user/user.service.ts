import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/request';
import { Users } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<Users> {
    return await this.userRepository.findOne(email);
  }
  async findById(id: string): Promise<Users> {
    return await this.userRepository.findOneById(id);
  }
  async update(id: string, data: UpdateUserDto): Promise<Users> {
    try {
      return await this.userRepository.update(id, data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
