import { METADATA_ROUTER_RENDER_VIEW } from '../constants';

export const Render = function(view: string) {
  return function(target: any, propertyKey?: string) {
    Reflect.defineMetadata(METADATA_ROUTER_RENDER_VIEW, view, target, propertyKey);
  };
};
