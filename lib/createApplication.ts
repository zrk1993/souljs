import * as Bodyparser from 'koa-bodyparser';
import * as KoaSession from 'koa-session';
import * as hbs from 'koa-hbs';
import * as koaStatic from 'koa-static';
import { Application, ApplicationOptions } from './application';

export async function createApplication(
  options: ApplicationOptions,
): Promise<Application> {
  const app = new Application(options);

  const staticAssetsOptions = options.staticAssets;
  if (staticAssetsOptions && staticAssetsOptions.root) {
    console.info('应用全局中间件 %s', 'koa-static');
    app.getKoaInstance().use(koaStatic(staticAssetsOptions.root, staticAssetsOptions));
  }

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

  const hbsOptions = options.hbs;
  if (hbsOptions && hbsOptions.viewPath) {
    console.info('应用全局中间件 %s', 'koa-hbs');
    app.getKoaInstance().use(hbs.middleware(hbsOptions));
  }

  return app;
}
