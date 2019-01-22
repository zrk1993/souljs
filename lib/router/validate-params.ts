import 'reflect-metadata';
import * as Koa from 'koa';
import { validate as classValidator, Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { METADATA_ROUTER_PARAMS } from '../constants';
import { ParamDecoratorType } from '../enums';
import { METADATA_ROUTER_PARAM_OPTIONAL } from '../constants';

const validator = new Validator();

interface ValidParam {
  type: ParamDecoratorType;
  index: number;
  data: any;
  paramtype: any;
}
const ValidatorOptions = {
  validationError: {
    target: false,
  },
};
async function validate(ctx: Koa.Context, param: ValidParam, ContextClass: any, prop: string): Promise<void> {
  let targetValue;
  switch (param.type) {
    case ParamDecoratorType.Body:
      targetValue = ctx.body;
      break;
    case ParamDecoratorType.Query:
      targetValue = ctx.query;
      break;
    case ParamDecoratorType.Param:
      targetValue = ctx.params;
      break;
    default:
  }

  if (param.data && targetValue) {
    targetValue = targetValue[param.data];
  }

  if (
    targetValue === undefined &&
    Reflect.hasMetadata(METADATA_ROUTER_PARAM_OPTIONAL, ContextClass.prototype, `${prop}_${Number}`)
  ) {
    return;
  }

  switch (param.paramtype) {
    case String:
      if (!validator.isString(targetValue)) throw new Error(`请求参数${param.data || ''}必须是字符串`);
      break;
    case Number:
      if (!validator.isNumber(targetValue)) throw new Error(`请求参数${param.data || ''}必须是数字`);
      break;
    case Boolean:
      if (!validator.isBoolean(targetValue)) throw new Error(`请求参数${param.data || ''}必须是布尔值`);
      break;
    case Object:
      break;
    case undefined:
      break;
    case Array:
      break;
    default:
      const entity = plainToClass(param.paramtype, targetValue);
      const errors = await classValidator(entity, ValidatorOptions);
      if (errors.length > 0) {
        throw errors;
      }
  }
}

export function validateParams(ContextClass: any, prop: string) {
  const types: Array<any> = Reflect.getMetadata('design:paramtypes', ContextClass.prototype, prop);

  const shouldValidParams: Array<ValidParam> = (
    Reflect.getMetadata(METADATA_ROUTER_PARAMS, ContextClass.prototype, prop) || []
  )
    .map((item: ValidParam) => {
      item.paramtype = types[item.index];
      return item;
    })
    .filter((item: ValidParam) => {
      return (
        item.type === ParamDecoratorType.Body ||
        item.type === ParamDecoratorType.Query ||
        item.type === ParamDecoratorType.Param
      );
    })
    .filter((item: ValidParam) => {
      const types = [Object];
      return !types.some(t => item.paramtype === t);
    });

  return async (ctx: Koa.Context, next: Function) => {
    try {
      await Promise.all(shouldValidParams.map(param => validate(ctx, param, ContextClass, prop)));
      await next();
    } catch (errors) {
      throw errors;
    }
  };
}
