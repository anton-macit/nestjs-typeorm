import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListAllEntities } from './dto/listAllEntities.dto';

@Injectable()
export class UsersService {
  private getHash = (password: string) => bcrypt.hash(password, 10);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hash = await this.getHash(password);
    const insertResult = await this.usersRepository.insert({ ...user, hash });
    return this.findOne(insertResult.identifiers[0].id);
  }

  findAll(query: ListAllEntities) {
    return this.usersRepository.findAndCount({
      order: { id: 'ASC' },
      take: query.limit,
      skip: query.offset,
      select: ['id', 'fullName', 'preferredName'],
    });
  }

  findOne(id: string) {
    return this.usersRepository.findOneOrFail({
      where: { id },
      select: ['id', 'fullName', 'preferredName'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let hash;
    if (updateUserDto.password) {
      hash = await this.getHash(updateUserDto.password);
      delete updateUserDto.password;
    }
    await this.usersRepository.update({ id }, { ...updateUserDto, hash });
    return this.findOne(id);
  }

  async remove(id: string) {
    return !!(await this.usersRepository.delete({ id })).affected;
  }
}
