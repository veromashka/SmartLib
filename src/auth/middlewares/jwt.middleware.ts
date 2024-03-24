import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export interface UserRequest extends Request {
  user?: any; // Define the user property
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  jwtSecret = this.configService.get<string>('JWT_SECRET');
  use(req: UserRequest, res: Response, next: NextFunction): any {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        req.user = jwt.verify(token, this.jwtSecret);
      } catch (err) {
        console.error(err);
      }
    }
    next();
  }
}
