import { Module } from '@nestjs/common';

import { UsersModule } from '@modules/users/users.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { DatabaseModule } from '@core/database/database.module';
import { CoreModule } from '@core/core.module';

const featureModules = [UsersModule, ReportsModule];

@Module({
  imports: [CoreModule, DatabaseModule, ...featureModules],
})
export class AppModule {}
