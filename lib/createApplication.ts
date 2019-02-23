import * as Path from 'path';
import * as Bodyparser from 'koa-bodyparser';
import * as hbs from 'koa-hbs';
import * as koaStatic from 'koa-static';
import * as helmet from 'koa-helmet';
import * as mount from 'koa-mount';
import koaConditionalGet = require('koa-conditional-get');
import koaEtag = require('koa-etag');
import cors = require('@koa/cors');
import { globs, loadPackage } from './utils/load-modules';
import { logger as voidLogger } from './utils/logger';
import { Application } from './application';
import { useSwaggerApi } from './middlewares/swagger-doc';
import { ILogger } from './interfaces';

export interface ApplicationOptions {
  logger?: ILogger;
  staticAssets?: { root: string; prefix?: string } | object;
  swagger?: { url: string; prefix?: string } | boolean;
  bodyparser?: Bodyparser.Options | boolean;
  hbs?: { viewPath?: string } | object;
  helmet?: object | boolean;
  cors?: object | boolean;
}

export async function createApplication(
  root: string,
  globsOrControllers: string | any[],
  options: ApplicationOptions = {},
): Promise<Application> {
  const logger = options.logger || voidLogger;

  logger.info('application starting ...');

  const routers =
    typeof globsOrControllers === 'string'
      ? (await globs(root, globsOrControllers.replace('.ts', '.?s'))).map(loadPackage).map(m => m.default)
      : globsOrControllers;

  logger.info('find %d routes', routers.length);

  const app = new Application(routers, { logger });

  if (options.helmet !== false) {
    logger.info('应用全局中间件 %s', 'koa-helmet');
    app.use(helmet());
  }

  if (options.cors !== false) {
    logger.info('应用全局中间件 %s', 'koa-cors');
    const corsOptions = { credentials: true };
    app.use(cors(Object.assign(corsOptions, options.cors)));
  }

  if (options.staticAssets) {
    const staticAssetsOptions = Object.assign(
      {
        root: Path.join(root, '..', 'public'),
        prefix: '/static',
        maxage: 86400000,
      },
      options.staticAssets,
    );
    logger.info('应用全局中间件 %s', 'koa-etag');
    app.use(mount(staticAssetsOptions.prefix, koaConditionalGet()));
    app.use(mount(staticAssetsOptions.prefix, koaEtag()));

    logger.info(
      '应用全局中间件 %s 资源目录 %s, prefix: %s',
      'koa-static',
      staticAssetsOptions.root,
      staticAssetsOptions.prefix,
    );
    app.use(mount(staticAssetsOptions.prefix, koaStatic(staticAssetsOptions.root, staticAssetsOptions)));
  }

  if (options.hbs) {
    const hbsOptions = Object.assign(
      {
        viewPath: Path.join(root, '..', 'views'),
      },
      options.hbs,
    );
    logger.info('应用全局中间件 %s 模板位置: %s', 'koa-hbs', hbsOptions.viewPath);
    app.use(hbs.middleware(hbsOptions));
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
    logger.info('应用全局中间件 %s', 'koa-bodyparser');
    app.use(Bodyparser(bodyparserOptions));
  }

  if (options.swagger !== false) {
    const swaggerOptions = Object.assign(
      {
        url: '/swagger-api/doc',
        prefix: '/swagger-ui',
      },
      options.swagger,
    );
    logger.info('应用swagger接口文档 访问路劲：%s%s', swaggerOptions.prefix, '/index.html');
    useSwaggerApi(app, swaggerOptions);
  }

  return app;
}
