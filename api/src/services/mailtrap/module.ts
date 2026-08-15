import { Module } from '@nestjs/common';
import { MailtrapService } from './service';

@Module({
  providers: [MailtrapService],
  exports: [MailtrapService],
})
export class MailtrapModule {}
