import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer as useValidatorContainer } from 'class-validator';
import { AppConfigService } from '@core/config/app-config.service';
import { AppValidationPipe } from '@core/validation/app-validation.pipe';
import cookieSession from 'cookie-session';

async function bootstrap(): Promise<string | number> {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get(AppConfigService);
  app.use(
    cookieSession({
      name: 'test-session',
      keys: [appConfigService.cookieSessionKey],
      maxAge: 60 * 1000,
      httpOnly: true,
      secure: appConfigService.isProduction,
      sameSite: appConfigService.sameSite,
    }),
  );
  useValidatorContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new AppValidationPipe(appConfigService));
  app.enableCors({
    origin: appConfigService.clientUrl,
    credentials: true,
  });

  const port = appConfigService.port ?? 3000;
  await app.listen(port);
  return port;
}

bootstrap()
  .then((port) => {
    console.log(`App started at port: ${port}`);
  })
  .catch((err) => {
    console.error(err);
  });
