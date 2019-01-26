import 'reflect-metadata';
import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as mount from 'koa-mount';
import * as koaStatic from 'koa-static';
import * as SwaggerUIDist from 'swagger-ui-dist';
import { Application } from '../application';
import {
  METADATA_ROUTER_QUERY_SCHAME,
  METADATA_ROUTER_BODY_SCHAME,
  METADATA_ROUTER_METHOD,
  METADATA_ROUTER_PATH,
  METADATA_API_USETAGS,
  METADATA_API_DESCRIPTION,
} from '../constants';

const convert = require('joi-to-json-schema');

export interface ISwaggerOption {
  url: string;
  prefix?: string;
}

interface IAPI {
  swagger: string;
  paths: { [prop: string]: { [prop: string]: IPath } };
  info: any;
  basePath: string;
  consumes: Array<string>;
  produces: Array<string>;
  schemes: Array<string>;
  tags: Array<{ name: string; description?: string }>;
}

interface IPath {
  summary: string;
  tags: Array<string>;
  produces?: Array<string>;
  responses?: any;
  parameters?: Array<any>;
}

export function useSwaggerApi(app: Application, swaggerConfig: ISwaggerOption) {
  const pathToSwaggerUi = SwaggerUIDist.getAbsoluteFSPath();
  app.getKoaInstance().use(
    mount((swaggerConfig.prefix || '/api') + '/index.html', async (ctx: Koa.Context) => {
      const d: string = await new Promise((resolve, reject) => {
        fs.readFile(path.join(pathToSwaggerUi, 'index.html'), (err, data) => {
          if (err) return reject(err.message);
          resolve(data.toString());
        });
      });
      ctx.type = 'text/html';
      ctx.body = d.replace(/url:\s*?"\S*"/gi, `url:"${swaggerConfig.url}"`);
    }),
  );
  app.getKoaInstance().use(
    mount(swaggerConfig.url, (ctx: Koa.Context) => {
      ctx.body = generateApi(app.getRouters());
    }),
  );
  app.getKoaInstance().use(mount(swaggerConfig.prefix || '/api', koaStatic(pathToSwaggerUi)));
}

const api: IAPI = {
  swagger: '2.0',
  info: {
    title: '接口文档',
    version: '1.0.0',
  },
  //  the domain of the service
  //  host: 127.0.0.1:3457
  schemes: ['http'],
  basePath: '',
  consumes: ['application/json', 'application/x-www-form-urlencoded'],
  produces: ['application/json'],
  paths: {},
  tags: [],
};

function generateApi(controllers: Array<any>) {
  controllers.forEach(Controller => {
    const requestMappings = getRequestMappings(Controller.prototype);
    const tag = Reflect.getMetadata(METADATA_API_USETAGS, Controller);
    const description = Reflect.getMetadata(METADATA_API_DESCRIPTION, Controller) || '';

    if (!api.tags.find(i => i.name === tag)) api.tags.push({ name: tag, description });

    requestMappings.forEach(prop => {
      const requestPath: string = [
        Reflect.getMetadata(METADATA_ROUTER_PATH, Controller),
        Reflect.getMetadata(METADATA_ROUTER_PATH, Controller.prototype, prop),
      ].join('');

      const requestMethod: string = Reflect.getMetadata(METADATA_ROUTER_METHOD, Controller.prototype, prop);

      const description = Reflect.getMetadata(METADATA_API_DESCRIPTION, Controller.prototype, prop) || '';
      const mtag = Reflect.getMetadata(METADATA_API_USETAGS, Controller.prototype, prop);

      const method: IPath = {
        summary: description,
        tags: [mtag || tag],
        produces: ['application/json', 'application/x-www-form-urlencoded'],
        parameters: [],
        responses: { default: { description: 'successful operation' } },
      };

      const validQuerySchame = Reflect.getMetadata(METADATA_ROUTER_QUERY_SCHAME, Controller.prototype, prop);
      if (validQuerySchame) {
        const schema = convert(validQuerySchame);
        Object.keys(schema.properties).forEach(key => {
          const property = schema.properties[key];
          method.parameters.push({
            name: key,
            in: 'query',
            type: property.type,
            required: !!(schema.required || []).find((i: string) => i === key),
            description: key,
          });
        });
      }

      const validBodySchame = Reflect.getMetadata(METADATA_ROUTER_BODY_SCHAME, Controller.prototype, prop);
      if (validBodySchame) {
        const schema = convert(validBodySchame);
        method.parameters.push({
          description: '',
          in: 'body',
          name: 'body',
          required: true,
          schema,
        });
      }

      api.paths[requestPath] = { [requestMethod.toLowerCase()]: method };
    });
  });
  return api;
}

function getRequestMappings(router: any): Array<string> {
  return Object.getOwnPropertyNames(router).filter(prop => {
    return (
      prop !== 'constructor' &&
      typeof router[prop] === 'function' &&
      Reflect.hasMetadata(METADATA_ROUTER_METHOD, router, prop)
    );
  });
}
