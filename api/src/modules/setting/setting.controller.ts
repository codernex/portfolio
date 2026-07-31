import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './setting.service';
import { JwtAuthGuard } from 'src/core/guards/auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':key')
  upsert(@Param('key') key: string, @Body() data: any) {
    return this.settingsService.upsert(key, data.value, data.description);
  }
}
