import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request } from 'express';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request: Request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      request.currentUser = await this.usersService.findOne(+userId);
    }

    return handler.handle();
  }
}
