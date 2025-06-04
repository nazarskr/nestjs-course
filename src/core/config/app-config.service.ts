import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get cookieSessionName(): string {
    return this.configService.get<string>(
      'COOKIE_SESSION_NAME',
      'test-session',
    );
  }

  get cookieSessionKey(): string {
    return this.configService.get<string>('COOKIE_SESSION_KEY', 'default');
  }

  get getCookieSessionDuration(): number {
    const raw = this.configService.get<string>('COOKIE_SESSION_DURATION');
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 60 * 1000 : parsed;
  }

  get clientUrl(): string {
    return this.configService.get<string>('CLIENT_URL', 'default');
  }

  get sameSite(): boolean | 'strict' | 'lax' | 'none' | undefined {
    return this.isProduction ? 'none' : 'lax';
  }

  get databaseType(): 'sqlite' {
    return this.configService.get<'sqlite'>('DB_TYPE', 'sqlite');
  }

  get databaseName(): string {
    return this.configService.get<string>('DB_DATABASE', 'development.sqlite');
  }
}
