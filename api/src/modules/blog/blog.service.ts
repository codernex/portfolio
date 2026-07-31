import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/core/dto/paginated-query.dto';
import { blockToHtml } from 'src/utils/blockToHtml';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Blog, BlogStatus, ContentBlock } from './entities/blog.entity';

const map = new Map<string, string>();

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly repository: Repository<Blog>,
  ) {}
  async create(createBlogDto: any) {
    const blog = new Blog();
    Object.assign(blog, createBlogDto);
    const readingTime = this.getReadingTime(blog.content);
    blog.readingTime = readingTime;
    return this.repository.save(blog);
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const queryBuilder = this.repository.createQueryBuilder('b');

    // 1. Join relations for the archive view
    queryBuilder
      .leftJoinAndSelect('b.author', 'author')
      .leftJoinAndSelect('b.tags', 'tags');

    // 2. Apply Search Filter
    if (search) {
      queryBuilder.where(
        '(b.title ILIKE :q OR b.slug ILIKE :q OR b.excerpt ILIKE :q)',
        { q: `%${search}%` },
      );
    }

    // 3. Sorting (Default to newest first)
    queryBuilder.orderBy('b.createdAt', 'DESC');

    // 4. Apply Pagination Logic
    // skip = (page - 1) * limit
    queryBuilder.skip((page - 1) * limit).take(limit);

    // 5. Execute with Count
    const [items, total] = await queryBuilder.getManyAndCount();

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

  async getAll() {
    return this.repository.find({
      select: ['slug', 'updatedAt'],
    });
  }

  async findOne(opts: FindOptionsWhere<Blog>, ip: string) {
    if (opts.slug) {
      const key = `${ip}-${opts.slug as string}`;
      const hasInMap = map.get(key);

      if (!hasInMap) {
        map.set(key, opts.slug as string);
        await this.repository
          .createQueryBuilder()
          .update(Blog)
          .set({
            views() {
              return 'views + 1';
            },
          })
          .where('slug = :slug', { slug: opts.slug as string })
          .execute();
      }
    }
    return this.repository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.author', 'author')
      .leftJoinAndSelect('b.tags', 'tag')
      .where('b.slug = :slug', { slug: opts.slug })
      .getOneOrFail();
  }

  update(opts: FindOptionsWhere<Blog>, updateBlogDto: any) {
    return this.repository.update(opts, updateBlogDto);
  }

  getRecentArticles(limit: number = 5) {
    return this.repository.find({
      where: { status: BlogStatus.PUBLISHED },
      order: { publishedAt: 'DESC' },
      take: limit,
      select: [
        'id',
        'title',
        'slug',
        'excerpt',
        'featuredImage',
        'publishedAt',
        'readingTime',
        'views',
        'createdAt',
        'updatedAt',
      ],
      relations: ['author', 'tags'],
    });
  }

  private getReadingTime(content: ContentBlock[]): number {
    // 1. Convert blocks to plain text (strip HTML tags)
    const plainText = content
      .map((block) => blockToHtml({ block }))
      .join(' ')
      .replace(/<[^>]*>/g, ''); // Simple regex to remove HTML tags

    // 2. Count the words
    const words = plainText.trim().split(/\s+/).length;

    // 3. Divide by average reading speed (approx 225 wpm)
    const wordsPerMinute = 225;
    const minutes = Math.ceil(words / wordsPerMinute);

    return minutes;
  }

  remove(id: string) {
    return this.repository.delete({ id });
  }
}
