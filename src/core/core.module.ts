import { Module } from '@nestjs/common';
import { AppConfigService } from '@core/config/app-config.service';
import { AppSetupService } from '@core/setup/app-setup.service';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ],
  providers: [AppConfigService, AppSetupService],
  exports: [AppConfigService, AppSetupService],
})
export class CoreModule {}
