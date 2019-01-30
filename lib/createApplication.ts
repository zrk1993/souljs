import * as Path from 'path';
import * as Bodyparser from 'koa-bodyparser';
import * as KoaSession from 'koa-session';
import * as hbs from 'koa-hbs';
import * as koaStatic from 'koa-static';
import * as helmet from 'koa-helmet';
import * as mount from 'koa-mount';
import koaConditionalGet = require('koa-conditional-get');
import koaEtag = require('koa-etag');
import * as Debug from 'debug';
import { globs, loadPackage } from './utils/load-modules';
import { Application } from './application';
import { useSwaggerApi } from './middlewares/swagger-doc';

const debug = Debug('soul:createApplication');

export interface ApplicationOptions {
  staticAssets?: { root: string; prefix?: string } | boolean;
  swagger?: { url: string; prefix?: string } | boolean;
  bodyparser?: Bodyparser.Options | boolean;
  session?: KoaSession.opts | boolean;
  hbs?: { viewPath?: string } | boolean;
  helmet?: object | boolean;
}

export async function createApplication(
  root: string,
  globsOrControllers: any,
  options: ApplicationOptions = {},
): Promise<Application> {
  debug('application starting ...');

  const routers = (await globs(root, globsOrControllers)).map(loadPackage).map(m => m.default);

  debug('find %d routes', routers.length);

  const app = new Application(routers);

  if (options.helmet !== false) {
    debug('应用全局中间件 %s', 'koa-helmet');
    app.use(helmet());
  }

  if (options.staticAssets !== false) {
    const staticAssetsOptions = Object.assign(
      {
        root: 'public',
        prefix: '/static',
        maxage: 86400000,
      },
      options.staticAssets,
    );
    debug('应用全局中间件 %s', 'koa-etag');
    app.use(mount(staticAssetsOptions.prefix, koaConditionalGet()));
    app.use(mount(staticAssetsOptions.prefix, koaEtag()));

    debug(
      '应用全局中间件 %s 资源目录 %s, prefix: %s',
      'koa-static',
      staticAssetsOptions.root,
      staticAssetsOptions.prefix,
    );
    app.use(
      mount(staticAssetsOptions.prefix, koaStatic(Path.join(root, staticAssetsOptions.root), staticAssetsOptions)),
    );
  }

  if (options.bodyparser !== false) {
    const bodyparserOptions = Object.assign(
      {
        enableTypes: ['json', 'form'],
        textLimit: '1mb',
        jsonLimit: '1mb',
      },
      options.bodyparser,
    );
    debug('应用全局中间件 %s', 'koa-bodyparser');
    app.use(Bodyparser(bodyparserOptions));
  }

  if (options.session !== false) {
    const sessionOptions = Object.assign(
      {
        key: 'soul:sess',
        maxAge: 86400000,
        httpOnly: true,
        renew: false,
      },
      options.session,
    );
    debug('应用全局中间件 %s', 'koa-session');
    app.use(KoaSession(sessionOptions, app.getKoaInstance()));
  }

  if (options.hbs !== false) {
    const hbsOptions = Object.assign(
      {
        viewPath: './views',
      },
      options.hbs,
    );
    debug('应用全局中间件 %s 模板位置: %s', 'koa-hbs', hbsOptions.viewPath);
    hbsOptions.viewPath = Path.join(root, hbsOptions.viewPath);
    app.use(hbs.middleware(hbsOptions));
  }

  if (options.swagger !== false) {
    const swaggerOptions = Object.assign(
      {
        url: '/swagger-api/doc',
        prefix: '/swagger-ui',
      },
      options.swagger,
    );
    debug('应用swagger接口文档 访问路劲：%s%s', swaggerOptions.prefix, '/index.html');
    useSwaggerApi(app, swaggerOptions);
  }

  return app;
}
