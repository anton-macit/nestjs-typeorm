import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  const user = {
    id: '1bd5ad66-077d-4442-b379-1e33f02f27f1',
    username: 'username',
    fullName: 'full name',
    preferredName: 'preferred name',
    hash: '$2a$10$6XznOYttJ/7OTjHv3jApM.9P8OqMSWwmtEGp9P8.YpqFNyq7AKRVy',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest
              .fn()
              .mockImplementation((username: string) =>
                username === user.username ? user : null,
              ),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation(() => '==='),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(() => undefined),
          },
        },
      ],
      controllers: [AuthController],
      exports: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('test method loginAdmin empty password in settings', async () => {
    const originConsoleError = console.error;
    console.error = jest.fn().mockImplementation(() => {});

    expect(await service.loginAdmin('', '', '')).toEqual(false);
    expect(console.error).toHaveBeenCalled();

    console.error = originConsoleError;
  });

  test('test method loginAdmin wrong password', async () => {
    expect(await service.loginAdmin('', '', '1')).toEqual(false);
  });

  test('test method signIn user access, fail, no user found', async () => {
    await expect(service.signIn('1', '1')).rejects.toThrow('Unauthorized');
  });

  test('test method signIn user access, fail, wrong password', async () => {
    await expect(service.signIn('username', '1')).rejects.toThrow(
      'Unauthorized',
    );
  });

  test('test method signIn user access, success', async () => {
    expect(await service.signIn('username', '123')).toEqual({
      access_token: '===',
    });
  });

  test('test method signIn admin success', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation(() => '==='),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(() => 'admin'),
          },
        },
      ],
      controllers: [AuthController],
      exports: [AuthService],
    }).compile();

    const serviceLocal = module.get<AuthService>(AuthService);

    expect(await serviceLocal.signIn('admin', 'admin')).toEqual({
      access_token: '===',
    });
  });
});
