import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';

export enum TagType {
  PROJECT = 'project',
  BLOG = 'blog',
  BOTH = 'both',
}

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: TagType,
    default: TagType.BOTH,
  })
  type: TagType;

  @ManyToMany(() => Project, (project) => project.tags)
  projects: Project[];

  @ManyToMany(() => Blog, (blog) => blog.tags)
  blogs: Blog[];

  @CreateDateColumn()
  createdAt: Date;
}
