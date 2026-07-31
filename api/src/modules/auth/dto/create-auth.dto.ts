import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateAuthDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  secret: string;
}
