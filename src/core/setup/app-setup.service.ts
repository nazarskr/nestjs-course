import { INestApplication, Injectable } from '@nestjs/common';
import { AppConfigService } from '@core/config/app-config.service';
import { AppValidationPipe } from '@core/validation/app-validation.pipe';
import cookieSession from 'cookie-session';
import { AppModule } from '../../app.module';
import { useContainer as useValidatorContainer } from 'class-validator';

@Injectable()
export class AppSetupService {
  constructor(private readonly config: AppConfigService) {}

  setup(app: INestApplication) {
    app.use(
      cookieSession({
        name: this.config.cookieSessionName,
        keys: [this.config.cookieSessionKey],
        maxAge: this.config.getCookieSessionDuration,
        httpOnly: true,
        secure: this.config.isProduction,
        sameSite: this.config.sameSite,
      }),
    );

    useValidatorContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(new AppValidationPipe(this.config));

    app.enableCors({
      origin: this.config.clientUrl,
      credentials: true,
    });
  }
}
