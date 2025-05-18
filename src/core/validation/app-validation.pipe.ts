import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';

export class AppValidationPipe extends ValidationPipe {
  constructor(appConfigService: AppConfigService) {
    const isProd = appConfigService.isProduction;

    const options: ValidationPipeOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: !isProd,
      transformOptions: {
        enableImplicitConversion: true,
      },
      skipMissingProperties: false,
      stopAtFirstError: false,
    };

    super(options);
  }
}
