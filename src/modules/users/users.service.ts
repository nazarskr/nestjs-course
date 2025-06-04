import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    // TODO: service should be transport-agnostic
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    // TODO: service should be transport-agnostic
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.repo.remove(user);
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.find(email);
    return !user.length;
  }
}
