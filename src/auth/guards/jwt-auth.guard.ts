import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  jwtSecret = this.configService.get<string>('JWT_SECRET');
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.user = this.jwtService.verify(token, {
        secret: this.jwtSecret,
      });
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
