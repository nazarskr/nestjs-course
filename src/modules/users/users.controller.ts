import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { UserDto } from '@modules/users/dtos/user.dto';
import { Serialize } from '@core/interceptors/serialize.interceptor';
import { AuthService } from '@modules/users/auth/auth.service';
import { SignInDto } from '@modules/users/dtos/sign-in.dto';
import { ISession } from '@modules/users/interfaces/session';
import { CurrentUser } from '@modules/users/decorators/current-user.decorator';
import { AuthGuard } from '@core/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmi(@Session() session: ISession) {
  //   if (!session || !session.userId) return null;
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmi(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signout(@Session() session: ISession) {
    session.userId = undefined;
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: ISession,
  ): Promise<User> {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(
    @Body() body: SignInDto,
    @Session() session: ISession,
  ): Promise<User> {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string): Promise<User | null> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string): Promise<User[]> {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(parseInt(id));
  }
}
