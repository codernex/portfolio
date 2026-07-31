// src/experience/experience.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    const experience = this.experienceRepository.create(createExperienceDto);
    return await this.experienceRepository.save(experience);
  }

  async findAll(): Promise<Experience[]> {
    return await this.experienceRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Experience> {
    const experience = await this.experienceRepository.findOneBy({ id });
    if (!experience)
      throw new NotFoundException(`Experience with ID ${id} not found`);
    return experience;
  }

  async update(
    id: string,
    updateDto: Partial<CreateExperienceDto>,
  ): Promise<Experience> {
    const experience = await this.findOne(id);
    Object.assign(experience, updateDto);
    return await this.experienceRepository.save(experience);
  }

  async remove(id: string): Promise<void> {
    const result = await this.experienceRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Experience with ID ${id} not found`);
  }
}
