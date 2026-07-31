import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './setting.controller';
import { SettingsService } from './setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
