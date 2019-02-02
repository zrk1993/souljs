import 'reflect-metadata';
import { METADATA_API_DESCRIPTION } from '../constants';

export const ApiDescription = (description: string) => {
  return (target: object, propertyKey?: string) => {
    Reflect.defineMetadata(METADATA_API_DESCRIPTION, description, target, propertyKey);
  };
};
