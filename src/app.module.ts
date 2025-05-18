import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '@modules/users/users.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { DatabaseModule } from '@core/database/database.module';
import { AppConfigService } from '@core/config/app-config.service';

const featureModules = [UsersModule, ReportsModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ...featureModules,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
