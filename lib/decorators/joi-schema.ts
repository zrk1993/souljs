import * as joi from 'joi';
import { METADATA_ROUTER_BODY_SCHAME, METADATA_ROUTER_QUERY_SCHAME } from '../constants';

export const BodySchame = (schame: joi.AnySchema) => {
  return (target: any, propertyKey?: string) => {
    Reflect.defineMetadata(METADATA_ROUTER_BODY_SCHAME, schame, target, propertyKey);
  };
};

export const QuerySchame = (schame: joi.AnySchema) => {
  return (target: any, propertyKey?: string) => {
    Reflect.defineMetadata(METADATA_ROUTER_QUERY_SCHAME, schame, target, propertyKey);
  };
};
