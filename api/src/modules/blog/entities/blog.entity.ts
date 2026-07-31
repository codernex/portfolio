import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'code'
  | 'image'
  | 'checklist'
  | 'mermaid'
  | 'table';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    url?: string;
    alt?: string;
    language?: string;
    checked?: boolean;
  };
}

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column('text', { nullable: true })
  excerpt: string;

  @Column({ type: 'jsonb', default: [] })
  content: ContentBlock[];

  @Column({ nullable: true })
  featuredImage: string;

  @ManyToOne(() => User, (user) => user.blogs, { eager: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToMany(() => Tag, (tag) => tag.blogs, { cascade: true })
  @JoinTable({
    name: 'blog_tags',
    joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Column({ default: 5 })
  readingTime: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  featured: boolean;

  @Column({ nullable: true })
  seoTitle: string;

  @Column('text', { nullable: true })
  seoDescription: string;

  @Column({ nullable: true })
  seoKeywords: string;

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
