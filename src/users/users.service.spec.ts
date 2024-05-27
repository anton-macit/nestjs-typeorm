import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '../utils/test';
import { Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: MockType<Repository<User>>;
  let getHash: (str: string) => Promise<string>;

  const mockUser = {
    id: '0a29ba65-f4c4-4803-8fd2-5f4163b0e455',
    fullName: 'full name',
    preferredName: 'preferred name',
    hash: 'hash',
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        // Provide your mock instead of the actual repository
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    getHash = service.getHash;
    service.getHash = async () => 'hash';
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('test method hash', async () => {
    expect(await getHash('123')).toBeDefined();
  });

  test('test method create', async () => {
    repositoryMock.findOneOrFail?.mockReturnValue(mockUser);
    repositoryMock.insert?.mockReturnValue({
      identifiers: [{ id: '0a29ba65-f4c4-4803-8fd2-5f4163b0e455' }],
    });
    expect(await service.create(createUserDto)).toEqual(mockUser);
    expect(repositoryMock.findOneOrFail).toHaveBeenCalledWith({
      select: ['id', 'fullName', 'preferredName'],
      where: { id: mockUser.id },
    });
  });

  test('test method findAll', async () => {
    repositoryMock.findAndCount?.mockReturnValue([[mockUser], 1]);
    expect(await service.findAll()).toEqual([[mockUser], 1]);
  });

  test('test method update', async () => {
    repositoryMock.update?.mockReturnValue(undefined);
    repositoryMock.findOneOrFail?.mockReturnValue(mockUser);

    expect(await service.update(mockUser.id, updateUserDto)).toEqual(mockUser);
    expect(repositoryMock.update).toHaveBeenCalledWith(
      {
        id: '0a29ba65-f4c4-4803-8fd2-5f4163b0e455',
      },
      {
        fullName: 'full name2',
        hash: 'hash',
        preferredName: 'preferred name2',
      },
    );
  });

  test('test method remove, success', async () => {
    repositoryMock.delete?.mockReturnValue({ affected: 1 });

    expect(await service.remove(mockUser.id)).toBeUndefined();
    expect(repositoryMock.delete).toHaveBeenCalledWith({
      id: '0a29ba65-f4c4-4803-8fd2-5f4163b0e455',
    });
  });

  test('test method remove, failed', async () => {
    repositoryMock.delete?.mockReturnValue({ affected: 0 });

    await expect(service.remove(mockUser.id)).rejects.toThrow(
      EntityNotFoundError,
    );
  });
});
