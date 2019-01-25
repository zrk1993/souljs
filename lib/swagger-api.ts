import 'reflect-metadata';
import { getFromContainer, MetadataStorage } from 'class-validator';
import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as mount from 'koa-mount';
import * as koaStatic from 'koa-static';
import * as SwaggerUIDist from 'swagger-ui-dist';
import { Application } from './application';
import { ParamDecoratorType } from './enums';
import {
  METADATA_ROUTER_PARAMS,
  METADATA_ROUTER_PARAM_OPTIONAL,
  METADATA_ROUTER_METHOD,
  METADATA_ROUTER_PATH,
  METADATA_API_USETAGS,
  METADATA_API_OPERATION,
  METADATA_API_DESCRIPTION,
} from './constants';

export interface ISwaggerOption {
  url: string;
  prefix?: string;
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

interface ValidParam {
  type: ParamDecoratorType;
  index: number;
  data: any;
  paramtype: any;
}

const api: IAPI = {
  swagger: '2.0',
  info: {
    title: '接口文档',
    description: 'Test API',
    // version: '1.0.0',
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
function generateApi(controllers: Array<any>): IAPI {
  controllers.forEach((Controller: any) => {
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

      const operation = Reflect.getMetadata(METADATA_API_OPERATION, Controller.prototype, prop);

      const method: IPath = {
        summary: operation,
        tags: [tag],
        produces: ['application/json'],
        parameters: [],
        responses: { default: { description: 'successful operation' } },
      };

      const types: Array<any> = Reflect.getMetadata('design:paramtypes', Controller.prototype, prop);

      const shouldValidParams: Array<ValidParam> = (
        Reflect.getMetadata(METADATA_ROUTER_PARAMS, Controller.prototype, prop) || []
      ).map((item: ValidParam) => {
        item.paramtype = types[item.index];
        return item;
      });

      const queryOrPathParams = shouldValidParams.filter(
        item => item.type === ParamDecoratorType.Query || item.type === ParamDecoratorType.Param,
      );

      queryOrPathParams.forEach(param => {
        const required = Reflect.hasMetadata(
          METADATA_ROUTER_PARAM_OPTIONAL,
          Controller.prototype,
          `${prop}_${param.index}`,
        );
        method.parameters.push({
          name: param.data,
          in: param.type.toLocaleLowerCase(),
          type: (param.paramtype ? param.paramtype.name : '').toLowerCase(),
          required,
          description: param.data || '',
        });
      });

      const bodyParams = shouldValidParams.filter(item => item.type === ParamDecoratorType.Body);
      if (bodyParams.length > 0) {
        const properties: { [x: string]: any } = {};
        bodyParams.forEach(param => {
          const types = [String, Number, Boolean, Object, Array, undefined];

          if (types.some(t => t === param.paramtype)) {
            if (param.data) {
              if (param.paramtype === Array) {
                Object.assign(properties, { [param.data]: { type: param.paramtype.name.toLowerCase(), items: { type: 'object' } } });
              } else {
                Object.assign(properties, { [param.data]: { type: param.paramtype.name.toLowerCase() } });
              }
            }
          } else {
            const fields = getFiledFromClass(param.paramtype);

            fields.forEach(field => {
              let target = properties;
              if (param.data) {
                if (!properties[param.data]) {
                  properties[param.data] = { type: 'object', properties: {} };
                }
                target = properties[param.data].properties;
              }
              Object.assign(target, { [field.name]: { type: field.type } });
            });
          }
        });

        method.parameters.push({
          name: 'body',
          in: 'body',
          type: 'object',
          description: 'body',
          schema: {
            properties,
          },
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

interface IField {
  name: string;
  type: string;
}
function getFiledFromClass(paramtype: any): Array<IField> {
  const fields: Array<IField> = [];
  const validationMetadatas = getFromContainer(MetadataStorage).getTargetValidationMetadatas(
    paramtype.constructor,
    paramtype,
  );
  validationMetadatas.forEach((item: any) => {
    const type = Reflect.getMetadata('design:type', paramtype.prototype, item.propertyName);
    fields.push({ name: item.propertyName, type: type ? type.name.toLocaleLowerCase() : 'any' });
  });
  return fields;
}
