import 'reflect-metadata';

import { METADATA_ROUTER_METHOD, METADATA_ROUTER_PATH } from '../constants';

function createRequestMapping(method: String) {
  return function(path: string) {
    return function(target: any, propertyKey: string) {
      Reflect.defineMetadata(METADATA_ROUTER_PATH, path, target, propertyKey);
      Reflect.defineMetadata(
        METADATA_ROUTER_METHOD,
        method,
        target,
        propertyKey,
      );
    };
  };
}

export const Get = createRequestMapping('GET');

export const Post = createRequestMapping('POST');

export const Controller = function(path: string) {
  return function(target: any) {
    Reflect.defineMetadata(METADATA_ROUTER_PATH, path, target);
  };
};
