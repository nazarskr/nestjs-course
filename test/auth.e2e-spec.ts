import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '@modules/users/users.entity';
import { AppSetupService } from '@core/setup/app-setup.service';
import { AppConfigService } from '@core/config/app-config.service';

describe('Authentication System', () => {
  let app: INestApplication;
  let appConfigService: AppConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const setupService = app.get(AppSetupService);
    setupService.setup(app);
    appConfigService = app.get(AppConfigService);

    await app.init();
  });

  it('handles signup request', () => {
    const email = `Some${Date.now()}@mail.com`;
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'Some123456' })
      .expect(201)
      .then((res: { body: User }) => {
        const { email: responseEmail, id } = res.body;
        expect(id).toBeDefined();
        expect(responseEmail).toEqual(email);
      });
  });

  it('signup as a new user and get currently logged in as a new user', async () => {
    const email = `Some${Date.now()}@mail.com`;
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'Some1234567' })
      .expect(201);

    const cookie = res.get('Set-Cookie') || [''];
    expect(cookie[0]).toContain(appConfigService.cookieSessionName);
    const whoami = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect((whoami.body as User).email).toEqual(email);
  });
});
