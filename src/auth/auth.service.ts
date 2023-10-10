import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  signToken(user: Users): string {
    const payload = {
      sub: user.email,
      id: user.id,
    };
    return this.jwtService.sign(payload, { secret: 'SECRET' });
  }

  async signIn(data) {
    const user = await this.userService.findByEmail(data.email);

    const res = await bcrypt.compare(data.password, user.password);

    if (!res) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.signToken(user),
    };
  }
}
