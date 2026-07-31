// src/experience/entities/experience.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  period: string; // e.g., "Jan 2025 - Present"

  @Column('text', { array: true })
  responsibilities: string[];

  @Column('text', { array: true })
  achievements: string[];

  @Column('text', { array: true })
  technologies: string[];

  @Column({ type: 'int', default: 0 })
  order: number; // For manual sorting on the frontend

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
