import 'reflect-metadata';
import { METADATA_API_USETAGS, METADATA_API_DESCRIPTION } from '../constants';

export const ApiDescription = function(description: string) {
  return function(target: Object, propertyKey?: string) {
    Reflect.defineMetadata(METADATA_API_DESCRIPTION, description, target, propertyKey);
  };
};

export const ApiUseTags = function(tags: string) {
  return function(target: Object, propertyKey?: string) {
    Reflect.defineMetadata(METADATA_API_USETAGS, tags, target, propertyKey);
  };
};
