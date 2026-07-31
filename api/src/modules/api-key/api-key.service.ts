import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entitity';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiOrigin, CreateApiKey } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly repository: Repository<ApiKey>,
  ) {}

  createApiKey(dto: CreateApiKey) {
    const apiKey = this.repository.create(dto);
    return this.repository.save(apiKey);
  }

  storeNonce(dto: CreateApiKey) {
    const apiKey = this.repository.create(dto);
    return this.repository.save(apiKey);
  }

  getApiKey(origin = 'google') {
    return this.repository.findOne({ where: { origin } });
  }

  deletedStoredNonce() {
    return this.repository.delete({
      origin: ApiOrigin.nonce,
    });
  }

  async getStoredNonce() {
    return this.repository.findOne({
      where: {
        origin: 'nonce-storage',
      },
    });
  }
}
