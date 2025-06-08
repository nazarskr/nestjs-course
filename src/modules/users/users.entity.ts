import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { AppLogger } from '@core/logger/app-logger';
import { Report } from '@modules/reports/reports.entity';

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

  @Column()
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
