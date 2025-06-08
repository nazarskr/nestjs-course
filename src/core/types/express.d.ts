import { User } from '@modules/users/users.entity';
import { ISession } from '@modules/users/interfaces/session';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
      session?: ISession;
    }
  }
}

export {};
