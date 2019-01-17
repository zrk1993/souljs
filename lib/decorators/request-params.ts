import "reflect-metadata";
import { ParamDecoratorType } from '../enums';
import { METADATA_ROUTER_PARAMS } from '../constants';

function createParamDecorator(paramDecoratorType: ParamDecoratorType) {
    return function(data?: any) {
        return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {

            const routerParams: Array<any> = Reflect.getMetadata(METADATA_ROUTER_PARAMS, target, propertyKey) || [];

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

export const Param = createParamDecorator(ParamDecoratorType.Param);

export const Query = createParamDecorator(ParamDecoratorType.Query);

export const Body = createParamDecorator(ParamDecoratorType.Body);

export const Session = createParamDecorator(ParamDecoratorType.Session);

export const Headers = createParamDecorator(ParamDecoratorType.Headers);

export const ApplicationInstance = createParamDecorator(ParamDecoratorType.ApplicationInstance);

export const KoaInstance = createParamDecorator(ParamDecoratorType.KoaInstance);
