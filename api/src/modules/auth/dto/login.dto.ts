import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
