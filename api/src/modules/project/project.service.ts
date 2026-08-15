import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryProjectDto } from './dto/query-project.dto';
import { Project, ProjectStatus } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private repository: Repository<Project>,
  ) {}
  create(dto: any) {
    const project = this.repository.create(dto);

    return this.repository.save(project);
  }

  async getAll() {
    return this.repository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
      select: [
        'id',
        'title',
        'slug',
        'shortDescription',
        'thumbnailUrl',
        'technologies',
        'featured',
        'liveUrl',
        'githubUrl',
        'createdAt',
        'updatedAt',
      ],
      relations: ['tags'],
    });
  }

  async findAll(query: QueryProjectDto) {
    const { page = 1, limit = 10, status, featured, tag, search } = query;

    const qb = this.repository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tags', 'tag')
      .orderBy('project.order', 'ASC')
      .addOrderBy('project.createdAt', 'DESC');

    // 🔍 Status filter
    if (status) {
      qb.andWhere('project.status = :status', { status });
    }

    // ⭐ Featured filter
    if (featured !== undefined) {
      qb.andWhere('project.featured = :featured', {
        featured: featured === 'true',
      });
    }

    // 🏷 Tag filter (by slug or name)
    if (tag) {
      qb.andWhere('tag.slug = :tag OR tag.name = :tag', { tag });
    }

    // 🔎 Search (title + description)
    if (search) {
      qb.andWhere(
        `(project.title ILIKE :search
        OR project.shortDescription ILIKE :search
        OR project.fullDescription ILIKE :search)
        OR project.technologies ILIKE :search
        `,
        { search: `%${search}%` },
      );
    }

    // 📄 Pagination
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFeatured() {
    return this.repository.find({
      where: {
        featured: true,
        status: ProjectStatus.PUBLISHED,
      },
      order: { order: 'ASC', createdAt: 'DESC' },
      // Optimization: Only select fields needed for the cards
      select: [
        'id',
        'title',
        'slug',
        'shortDescription',
        'thumbnailUrl',
        'technologies',
        'featured',
        'liveUrl',
        'githubUrl',
      ],
      relations: ['tags'],
    });
  }

  findOne(opts: FindOptionsWhere<Project>) {
    return this.repository.findOne({
      where: {
        ...opts,
      },
      relations: {
        tags: true,
      },
    });
  }

  update(id: string, updateProjectDto: any) {
    return this.repository.update(id, { ...updateProjectDto });
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
