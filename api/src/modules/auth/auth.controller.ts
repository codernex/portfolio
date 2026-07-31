import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto, RefreshDto } from './dto/login.dto';
import { Public } from 'src/core/decorator/auth.decorator';
import { type Response } from 'express';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(loginDto);

    return res
      .status(200)
      .cookie('accessToken', data.accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .cookie('refreshToken', data.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      })
      .json(data);
  }

  @Post('refresh')
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refreshToken);
  }
}
