import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  name: string;
}
