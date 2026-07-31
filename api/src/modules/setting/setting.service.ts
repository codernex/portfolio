import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async findAll() {
    return this.settingsRepository.find();
  }

  async findByKey(key: string) {
    return this.settingsRepository.findOne({ where: { key } });
  }

  async upsert(key: string, value: any, description?: string) {
    let setting = await this.settingsRepository.findOne({ where: { key } });

    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
    } else {
      setting = this.settingsRepository.create({ key, value, description });
    }

    return this.settingsRepository.save(setting);
  }
}
