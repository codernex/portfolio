import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  url: string;

  @Column()
  key: string; // The S3 Object Key

  @Column({ nullable: true })
  mimeType: string;

  @Column({ type: 'bigint', nullable: true })
  size: number;

  @CreateDateColumn()
  createdAt: Date;
}
