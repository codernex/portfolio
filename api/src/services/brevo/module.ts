import { Module } from '@nestjs/common';
import { BrevoService } from './service';

@Module({
  providers: [BrevoService],
  exports: [BrevoService],
})
export class BrevoModule {}
