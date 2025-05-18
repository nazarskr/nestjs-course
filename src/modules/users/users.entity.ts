import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AppLogger } from '@core/logger/app-logger';

@Entity()
@Unique(['email'])
export class User {
  private static readonly logger = AppLogger.getLogger(User.name);
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    User.logger.log(`Inserted user with id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    User.logger.log(`Updated user with id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    User.logger.log(`Removed user with id: ${this.id}`);
  }
}
