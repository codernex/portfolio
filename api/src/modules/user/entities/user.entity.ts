import { Blog } from 'src/modules/blog/entities/blog.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Index()
  @Column({ unique: true, nullable: true })
  username: string;
  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EDITOR,
  })
  role: UserRole;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
