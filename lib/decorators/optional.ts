import 'reflect-metadata';
import { METADATA_ROUTER_PARAM_OPTIONAL } from '../constants';
export const Optional = function() {
  return function(target: Object, propertyKey: string, parameterIndex: number) {
    Reflect.defineMetadata(METADATA_ROUTER_PARAM_OPTIONAL, true, target, `${propertyKey}_${Number}`);
  };
};
