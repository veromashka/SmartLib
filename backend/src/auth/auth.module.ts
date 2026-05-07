import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // `expiresIn` types come from `ms` (StringValue | number).
          // ConfigService returns a plain string — cast to the union ms accepts.
          expiresIn: config.get<string>(
            'JWT_EXPIRES_IN',
            '1d',
          ) as unknown as number,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
