import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  // for more intelligent tests:
  // const users = [];
  // find: (email) => Promise.resolve(users.filter(u => u.email === email))
  // etc
  const fakeUsersService: Partial<UsersService> = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password } as User),
    isEmailUnique: () => Promise.resolve(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const email = '12345@mail.com';
    const password = '12345';
    const user = await service.signup(email, password);

    const [salt, hash] = user.password;
    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user already exists', async () => {
    fakeUsersService.isEmailUnique = () => Promise.resolve(false);
    const email = '12345@mail.com';
    const password = '12345';
    await expect(service.signup(email, password)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with unused mail', async () => {
    const email = '12345@mail.com';
    const password = '12345';
    await expect(service.signin(email, password)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if invalid password provided', async () => {
    const email = '12345@mail.com';
    const password = '12345';
    fakeUsersService.find = () =>
      Promise.resolve([{ email, password } as User]);

    const wrongPassword = '54321';
    await expect(service.signin(email, wrongPassword)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns user if password is correct', async () => {
    fakeUsersService.isEmailUnique = () => Promise.resolve(true);

    const email = '12345@mail.com';
    const password = '12345';

    const user = await service.signup(email, password);

    fakeUsersService.find = () =>
      Promise.resolve([{ email: user.email, password: user.password } as User]);

    const loginUser = await service.signin(email, password);
    expect(loginUser).toBeDefined();
  });
});
