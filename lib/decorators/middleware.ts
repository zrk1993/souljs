import { METADATA_ROUTER_MIDDLEWARE } from '../constants';

export function Middleware(middlewareClass: any, ...args: Array<any>) {

    return function (target: any, propertyKey?: string) {

        if (!Reflect.hasMetadata(METADATA_ROUTER_MIDDLEWARE, target, propertyKey)) {
            Reflect.defineMetadata(METADATA_ROUTER_MIDDLEWARE, [], target, propertyKey);
        }

        const middlewares: Array<any> = Reflect.getMetadata(METADATA_ROUTER_MIDDLEWARE, target, propertyKey);

        middlewares.push({ middlewareClass, args });

        Reflect.defineMetadata(METADATA_ROUTER_MIDDLEWARE, middlewares, target, propertyKey);
    };
}