import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { UserDto } from '../auth/dto/userDto';
import { ListAllEntities } from '../users/dto/listAllEntities.dto';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(user: UserDto, createTodoDto: CreateTodoDto) {
    const insertResult = await this.todosRepository.insert({
      ...createTodoDto,
      user,
    });
    return this.findOne(user, insertResult.identifiers[0].id);
  }

  findOne(user: UserDto, id: string) {
    return this.todosRepository.findOneOrFail({
      where: { id, user: { id: user.id } },
      select: ['id', 'content', 'priority'],
    });
  }

  findAll(user: UserDto, query?: ListAllEntities | undefined) {
    return this.todosRepository.findAndCount({
      where: { user: { id: user.id } },
      order: { id: 'ASC' },
      take: query?.limit ?? 10,
      skip: query?.offset ?? 0,
      select: ['id', 'content', 'priority'],
    });
  }

  async update(user: UserDto, id: string, updateTodoDto: UpdateTodoDto) {
    await this.todosRepository.update(
      { id, user: { id: user.id } },
      updateTodoDto,
    );
    return this.findOne(user, id);
  }

  async remove(user: UserDto, id: string) {
    const deleted = !!(
      await this.todosRepository.delete({ id, user: { id: user.id } })
    ).affected;
    if (!deleted) {
      throw new EntityNotFoundError(Todo, { id });
    }
  }
}
