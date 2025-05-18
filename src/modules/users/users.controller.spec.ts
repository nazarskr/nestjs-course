import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '@modules/users/users.service';
import { AuthService } from '@modules/users/auth/auth.service';
import { User } from '@modules/users/users.entity';
import { NotFoundException } from '@nestjs/common';
import { ISession } from '@modules/users/interfaces/session';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  const baseUser = {
    id: 1,
    email: '12345@mail.com',
    password: '12345',
  } as User;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          ...baseUser,
          id,
        } as User);
      },
      find: (email) => {
        return Promise.resolve([{ ...baseUser, email } as User]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email, password) => {
        return Promise.resolve({ id: baseUser.id, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers should return list of users with the given email', async () => {
    const users = await controller.findAllUsers(baseUser.email);

    expect(users.length).toBe(1);
    expect(users[0].email).toBe(baseUser.email);
  });

  it('findUser should return single user with given id', async () => {
    const user = await controller.findUser(String(baseUser.id));
    expect(user).toBeDefined();
  });

  it('findUser should throw an error if user with given id was not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('12')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = {} as ISession;
    const { email, password } = baseUser;
    const user = await controller.signin({ email, password }, session);

    expect(user.id).toEqual(baseUser.id);
    expect(session.userId).toEqual(baseUser.id);
  });
});
