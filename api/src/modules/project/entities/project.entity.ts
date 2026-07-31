import { ContentBlock } from 'src/modules/blog/entities/blog.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum ProjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  shortDescription: string;

  @Column('text')
  fullDescription: string;

  @Column({ type: 'jsonb', default: [] })
  content: ContentBlock[];

  @Column()
  thumbnailUrl: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column('simple-array')
  technologies: string[];

  @ManyToMany(() => Tag, (tag) => tag.projects, { cascade: true })
  @JoinTable({
    name: 'project_tags',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Column({ nullable: true })
  liveUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  seoTitle: string;

  @Column('text', { nullable: true })
  seoDescription: string;

  @Column({ nullable: true })
  seoKeywords: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
