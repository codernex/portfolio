import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  apiKey: string;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column()
  origin: string;

  @Column('simple-array', { nullable: true })
  scope: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
