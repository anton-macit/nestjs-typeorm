import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { TodosService } from './todos.service';
import { UserDto } from '../auth/dto/userDto';
import { Todo } from './entities/todo.entity';
import { Role } from '../auth/role.enum';

const todo = {
  id: '1bd5ad66-077d-4442-b379-1e33f02f27f1',
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

describe('TodoController', () => {
  let controller: TodosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            create: jest.fn().mockResolvedValue(todo),
            findAll: jest.fn().mockResolvedValue([[todo], 1]),
            findOne: jest
              .fn()
              .mockImplementation((user: UserDto, id: string) =>
                id === todo.id
                  ? Promise.resolve(todo)
                  : Promise.reject(new EntityNotFoundError(Todo, { id })),
              ),
            update: jest
              .fn()
              .mockImplementation((user: UserDto, id: string) =>
                id === todo.id
                  ? Promise.resolve(todo)
                  : Promise.reject(new EntityNotFoundError(Todo, { id })),
              ),
            remove: jest
              .fn()
              .mockImplementation((user: UserDto, id: string) =>
                id === todo.id
                  ? Promise.resolve()
                  : Promise.reject(new EntityNotFoundError(Todo, { id })),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('test method create', async () => {
    expect(await controller.create(userDto, createTodoDto)).toEqual(todo);
  });

  test('test method findAll', async () => {
    expect(await controller.findAll(userDto)).toEqual([[todo], 1]);
  });

  test('test method findOne, success', async () => {
    expect(await controller.findOne(userDto, todo.id)).toEqual(todo);
  });

  test('test method findOne, fail', async () => {
    await expect(controller.findOne(userDto, todo.id + '1')).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  test('test method update, success', async () => {
    expect(await controller.update(userDto, todo.id, updateTodoDto)).toEqual(
      todo,
    );
  });

  test('test method update, fail', async () => {
    await expect(controller.findOne(userDto, todo.id + '1')).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  test('test method remove, success', async () => {
    expect(await controller.remove(userDto, todo.id)).toBeUndefined();
  });

  test('test method findOne, fail', async () => {
    await expect(controller.remove(userDto, todo.id + '1')).rejects.toThrow(
      EntityNotFoundError,
    );
  });
});
