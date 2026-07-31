import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(data: any) {
    const tag = this.tagsRepository.create(data);
    return this.tagsRepository.save(tag);
  }

  async findAll() {
    return this.tagsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async update(id: string, data: any) {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    Object.assign(tag, data);
    return this.tagsRepository.save(tag);
  }

  async remove(id: string) {
    const result = await this.tagsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Tag not found');
    }
    return { message: 'Tag deleted successfully' };
  }
}
