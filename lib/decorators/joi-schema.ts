import * as joi from 'joi';
import { METADATA_ROUTER_BODY_SCHAME, METADATA_ROUTER_QUERY_SCHAME } from '../constants';

export const BodySchame = function(schame: joi.AnySchema) {
  return function(target: any, propertyKey?: string) {
    Reflect.defineMetadata(METADATA_ROUTER_BODY_SCHAME, schame, target, propertyKey);
  };
};

export const QuerySchame = function(schame: joi.AnySchema) {
  return function(target: any, propertyKey?: string) {
    Reflect.defineMetadata(METADATA_ROUTER_QUERY_SCHAME, schame, target, propertyKey);
  };
};
