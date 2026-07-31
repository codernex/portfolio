import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/modules/api-key/api-key.module';
import { GoogleClient } from './client';
import { GoogleService } from './service';

@Module({
  imports: [ApiKeyModule],
  providers: [GoogleClient, GoogleService],
  exports: [GoogleClient, GoogleService],
})
export class GoogleModule {}
