import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/request/create-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(data: CreateUserDto) {
    try {
      const { login, role, email, password } = data;
      //TODO
      //add profile here

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      return await this.userRepository.create({
        login,
        role,
        email,
        password: hashedPassword,
      });
    } catch (e) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  }
  async findByEmail(email: string) {
    return await this.userRepository.findOne(email);
  }
}
