import { Module } from '@nestjs/common';
import { BrevoModule } from 'src/services/brevo';
import { ContactController } from './contact.controller';

@Module({
  imports: [BrevoModule],
  controllers: [ContactController],
})
export class ContactModule {}
