import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {},
        },
        JwtService,
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

  test('test method signIn ', async () => {
    await expect(service.signIn('1', '1')).rejects.toThrow('Unauthorized');
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
