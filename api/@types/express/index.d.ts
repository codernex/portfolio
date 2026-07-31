import { JwtPayload } from 'src/core/strategies/jwt.strategy';

declare module 'express' {
  export interface Request {
    user: JwtPayload;
  }

  export interface GoogleRequest extends Request {
    user: JwtPayload & {
      accessToken: string;
    };
  }
}
