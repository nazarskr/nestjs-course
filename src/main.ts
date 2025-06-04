import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from '@core/config/app-config.service';
import { AppSetupService } from '@core/setup/app-setup.service';

async function bootstrap(): Promise<string | number> {
  const app = await NestFactory.create(AppModule);

  const setupService = app.get(AppSetupService);
  setupService.setup(app);

  const appConfigService = app.get(AppConfigService);
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
