import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithSession } from '../interfaces/session';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    return request.currentUser;
  },
);
