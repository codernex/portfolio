import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { UserRole } from 'src/modules/user/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.extractTokenFromCookies(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }

    // returned value becomes req.user
    return payload;
  }

  private static extractTokenFromCookies(): JwtFromRequestFunction {
    return (req: Request) => {
      if (!req || !req.cookies) {
        return null;
      }
      console.log(
        'TCL: JwtStrategy -> exportclassJwtStrategyextendsPassportStrategy -> req',
        req.cookies,
      );

      const tokenKeys = ['accessToken', 'authToken', 'refreshToken'];

      for (const key of tokenKeys) {
        const token = req.cookies[key] as string;
        if (typeof token === 'string' && token.length > 0) {
          return token;
        }
      }

      return null;
    };
  }
}
