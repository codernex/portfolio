import { Controller } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';

@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}
}
