import 'reflect-metadata';
import { ParamDecoratorType } from '../enums';
import { METADATA_ROUTER_PARAMS } from '../constants';

function createParamDecorator(paramDecoratorType: ParamDecoratorType) {
  return (data?: any) => {
    return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
      const routerParams: any[] = Reflect.getMetadata(METADATA_ROUTER_PARAMS, target, propertyKey) || [];

      routerParams.push({
        type: paramDecoratorType,
        index: parameterIndex,
        data,
      });

      Reflect.defineMetadata(METADATA_ROUTER_PARAMS, routerParams, target, propertyKey);
    };
  };
}

export const Request = createParamDecorator(ParamDecoratorType.Request);

export const Response = createParamDecorator(ParamDecoratorType.Response);

export const Ctx = createParamDecorator(ParamDecoratorType.Ctx);

export const Next = createParamDecorator(ParamDecoratorType.Next);

export const Query = createParamDecorator(ParamDecoratorType.Query);

export const Body = createParamDecorator(ParamDecoratorType.Body);

export const ApplicationInstance = createParamDecorator(ParamDecoratorType.ApplicationInstance);

export const KoaInstance = createParamDecorator(ParamDecoratorType.KoaInstance);
