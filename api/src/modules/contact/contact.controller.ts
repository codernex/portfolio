import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Public } from 'src/core/decorator/auth.decorator';
import { MailtrapService } from 'src/services/mailtrap';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  subject: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly mailtrapService: MailtrapService) {}

  @Public()
  @Post()
  async createContact(@Body() dto: CreateContactDto) {
    await this.mailtrapService.sendEmail(dto);
    await this.mailtrapService.sendCustomerEmail(dto);

    return { message: 'Email successfully sent via Mailtrap', success: true };
  }
}
