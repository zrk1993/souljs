import * as Bodyparser from 'koa-bodyparser';
import * as KoaSession from 'koa-session';
import { Application, ApplicationOptions } from './application';

export async function createApplication(
  options: ApplicationOptions,
): Promise<Application> {
  const app = new Application(options);

  console.info('应用全局中间件 %s', 'koa-bodyparser');
  app.getKoaInstance().use(
    Bodyparser({
      enableTypes: ['json', 'form'],
      textLimit: '1mb',
      jsonLimit: '1mb',
    }),
  );

  console.info('应用全局中间件 %s', 'koa-session');
  app.getKoaInstance().use(KoaSession(null, app.getKoaInstance()));

  return app;
}
