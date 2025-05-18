import { Request } from 'express';
import { User } from '@modules/users/users.entity';

export interface ISession {
  userId: number | undefined;
}

export interface RequestWithSession extends Request {
  session: ISession;
  currentUser: User | null;
}
