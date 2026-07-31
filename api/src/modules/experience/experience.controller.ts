// src/experience/experience.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { JwtAuthGuard } from 'src/core/guards/auth.guard';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.create(createExperienceDto);
  }

  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.experienceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<CreateExperienceDto>,
  ) {
    return this.experienceService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.experienceService.remove(id);
  }
}
