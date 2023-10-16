import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';

import { UpdateUserDto } from './dto/request/update-user.dto';
import { Users } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findByEmail(email: string) {
    return await this.userRepository.findOne(email);
  }

  async findById(id: string) {
    return await this.userRepository.findOneById(id);
  }
  async update(id: string, data: UpdateUserDto): Promise<Users> {
    console.log('click');
    try {
      console.log(data);
      return await this.userRepository.update(id, data);
    } catch (e) {
      throw new BadRequestException(e.message, {
        cause: new Error(),
      });
    }
  }
}
