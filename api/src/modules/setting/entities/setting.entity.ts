import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column('jsonb')
  value: any;

  @Column('text', { nullable: true })
  description: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
