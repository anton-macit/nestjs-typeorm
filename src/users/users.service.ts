import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  private getHash = (password: string) => bcrypt.hash(password, 10);

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hash = await this.getHash(password);
    this.users.push({ ...user, id: randomUUID(), hash });
  }

  findAll(limit: number) {
    return this.users
      .map((u) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hash, ...user } = u;
        return user;
      })
      .slice(0, limit);
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.find((v) => v.id === id);
    if (user) {
      if (updateUserDto.password) {
        user.hash = await this.getHash(updateUserDto.password);
      }
      user.fullName = updateUserDto.fullName ?? user.fullName;
      user.preferredName = updateUserDto.preferredName ?? user.preferredName;
    }

    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    const idx = this.users.findIndex((v) => v.id === id);
    if (idx > -1) {
      this.users.splice(idx, 1);
    }
    return `This action removes a #${id} user`;
  }
}
