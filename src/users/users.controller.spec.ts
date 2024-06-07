import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const createUserDto = {
    fullName: 'full name',
    preferredName: 'preferred name',
    password: '123',
  };

  const updateUserDto = {
    fullName: 'full name2',
    preferredName: 'preferred name2',
    password: '1234',
  };

  const user = {
    id: '1bd5ad66-077d-4442-b379-1e33f02f27f1',
    fullName: 'full name',
    preferredName: 'preferred name',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        // Provide your mock instead of the actual service
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(user),
            findAll: jest.fn().mockResolvedValue([[user], 1]),
            findOne: jest
              .fn()
              .mockImplementation((id: string) =>
                id === user.id
                  ? Promise.resolve(user)
                  : Promise.reject(new EntityNotFoundError(User, { id })),
              ),
            update: jest
              .fn()
              .mockImplementation((id: string) =>
                id === user.id
                  ? Promise.resolve(user)
                  : Promise.reject(new EntityNotFoundError(User, { id })),
              ),
            remove: jest
              .fn()
              .mockImplementation((id: string) =>
                id === user.id
                  ? Promise.resolve()
                  : Promise.reject(new EntityNotFoundError(User, { id })),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('test method create', async () => {
    expect(await controller.create(createUserDto)).toEqual(user);
  });

  test('test method findAll', async () => {
    expect(await controller.findAll()).toEqual([[user], 1]);
  });

  test('test method findOne, success', async () => {
    expect(await controller.findOne(user.id)).toEqual(user);
  });

  test('test method findOne, fail', async () => {
    await expect(controller.findOne(user.id + '1')).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  test('test method update, success', async () => {
    expect(await controller.update(user.id, updateUserDto)).toEqual(user);
  });

  test('test method update, fail', async () => {
    await expect(controller.findOne(user.id + '1')).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  test('test method remove, success', async () => {
    expect(await controller.remove(user.id)).toBeUndefined();
  });

  test('test method findOne, fail', async () => {
    await expect(controller.remove(user.id + '1')).rejects.toThrow(
      EntityNotFoundError,
    );
  });
});
