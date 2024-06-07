import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '../utils/test';
import { Todo } from './entities/todo.entity';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Repository } from 'typeorm';
import { Role } from '../auth/role.enum';
import { UserDto } from '../auth/dto/userDto';

describe('TodoService', () => {
  let service: TodosService;
  let repositoryMock: MockType<Repository<Todo>>;

  const mockTodo = {
    id: '0a29ba65-f4c4-4803-8fd2-5f4163b0e455',
    content: 'Content',
    priority: 0,
  };

  const userDto = {
    id: '1bd5ad66-077d-4442-b379-1e33f02f27f1',
    username: 'username',
    roles: [Role.User],
  } satisfies UserDto;

  const createTodoDto = {
    content: 'Content create',
    priority: 1,
  };

  const updateTodoDto = {
    content: 'Content update',
    priority: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repositoryMock = module.get(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('test method create', async () => {
    repositoryMock.findOneOrFail?.mockReturnValue(mockTodo);
    repositoryMock.insert?.mockReturnValue({
      identifiers: [{ id: '0a29ba65-f4c4-4803-8fd2-5f4163b0e455' }],
    });
    expect(await service.create(userDto, createTodoDto)).toEqual(mockTodo);
    expect(repositoryMock.findOneOrFail).toHaveBeenCalledWith({
      select: ['id', 'content', 'priority'],
      where: { id: mockTodo.id, user: { id: userDto.id } },
    });
  });

  test('test method findAll', async () => {
    repositoryMock.findAndCount?.mockReturnValue([[mockTodo], 1]);
    expect(await service.findAll(userDto)).toEqual([[mockTodo], 1]);
  });

  test('test method update', async () => {
    repositoryMock.update?.mockReturnValue(undefined);
    repositoryMock.findOneOrFail?.mockReturnValue(mockTodo);

    expect(await service.update(userDto, mockTodo.id, updateTodoDto)).toEqual(
      mockTodo,
    );
    expect(repositoryMock.update).toHaveBeenCalledWith(
      {
        id: '0a29ba65-f4c4-4803-8fd2-5f4163b0e455',
        user: { id: userDto.id },
      },
      {
        content: 'Content update',
        priority: 2,
      },
    );
  });

  test('test method remove, success', async () => {
    repositoryMock.delete?.mockReturnValue({ affected: 1 });

    expect(await service.remove(userDto, mockTodo.id)).toBeUndefined();
    expect(repositoryMock.delete).toHaveBeenCalledWith({
      id: '0a29ba65-f4c4-4803-8fd2-5f4163b0e455',
      user: { id: userDto.id },
    });
  });

  test('test method remove, failed', async () => {
    repositoryMock.delete?.mockReturnValue({ affected: 0 });

    await expect(service.remove(userDto, mockTodo.id)).rejects.toThrow(
      EntityNotFoundError,
    );
  });
});
