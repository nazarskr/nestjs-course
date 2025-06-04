import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/users.entity';
import { Report } from '@modules/reports/reports.entity';
import { AppConfigService } from '@core/config/app-config.service';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: config.databaseType,
        database: config.databaseName,
        entities: [User, Report],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
