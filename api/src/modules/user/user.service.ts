import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = this.repository.create(createUserDto);
    return this.repository.save(user);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(options: FindOptionsWhere<User>) {
    return this.repository.findOneBy({ ...options });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundError('User not found');
    return this.repository.save({ ...user, ...updateUserDto });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
