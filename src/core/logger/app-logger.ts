import { Logger } from '@nestjs/common';

export class AppLogger {
  static getLogger(context: string): Logger {
    // TODO: add Sentry
    return new Logger(context);
  }
}
