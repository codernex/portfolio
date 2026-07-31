import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/core/strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  signUp(dto: CreateAuthDto) {
    const secret = '1234';
    if (secret !== dto.secret) throw new UnauthorizedException();
    return this.userService.create(dto);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findOne({
      email: dto.email,
    });

    if (!user) throw new NotFoundException('Invalid username or password');

    const isPasswordMatched = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid username or password');

    const { id, email, role } = user;

    const tokenPayload = { sub: id, email, role };
    const token = this.jwtService.sign(tokenPayload);

    const refreshToken = this.jwtService.sign(tokenPayload, {
      expiresIn: this.configService.getOrThrow('REFRESH_EXPIRY'),
    });

    const { password, ...rest } = user;
    console.log('TCL: AuthService -> login -> password', password);
    return {
      accessToken: token,
      user: rest,
      expiresIn: parseInt(
        this.configService.getOrThrow<string>('JWT_EXPIRY'),
        10,
      ),
      refreshToken,
    };
  }

  async refresh(token: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...payload } = this.jwtService.verify<JwtPayload>(token);

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: parseInt(
        this.configService.getOrThrow<string>('JWT_EXPIRY'),
        10,
      ),
    });

    const user = await this.userService.findOne({
      id: payload.sub,
    });

    if (!user) throw new UnauthorizedException();

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn: parseInt(
        this.configService.getOrThrow<string>('JWT_EXPIRY'),
        10,
      ),
    };
  }
}
