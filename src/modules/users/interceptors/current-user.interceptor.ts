import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { RequestWithSession } from '@modules/users/interfaces/session';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    const { userId } = request.session || {};

    if (userId) {
      request.currentUser = await this.usersService.findOne(userId);
    }

    return handler.handle();
  }
}
