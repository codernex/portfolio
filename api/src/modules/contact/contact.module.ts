import { Module } from '@nestjs/common';
import { MailtrapModule } from 'src/services/mailtrap';
import { ContactController } from './contact.controller';

@Module({
  imports: [MailtrapModule],
  controllers: [ContactController],
})
export class ContactModule {}
