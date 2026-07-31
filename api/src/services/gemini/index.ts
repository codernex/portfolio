import { Module } from '@nestjs/common';
import { GeminiService } from './service';

@Module({
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
