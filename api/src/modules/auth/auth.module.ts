import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/core/guards/auth.guard';
import { JwtStrategy } from 'src/core/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AnonymousThrottlerGuard } from 'src/core/guards/anonymous.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.getOrThrow<string>('JWT_SECRET'),
          global: true,
          signOptions: {
            expiresIn: config.getOrThrow('JWT_EXPIRY'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AnonymousThrottlerGuard,
    },
  ],
})
export class AuthModule {}
