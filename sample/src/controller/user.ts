import {
  Controller,
  Get,
  Use,
  Render,
  Body,
  BodySchame,
  QuerySchame,
  ApiUseTags,
  ApiDescription,
} from '../../../index';

import * as joi from 'joi';
import * as Koa from 'koa';
import { Auth } from '../middleware/Auth';
import { Test } from '../middleware/Test';
import { ResultUtils } from '../utils';
import { Post, Ctx, Query } from '../../../lib/decorators';

@Controller('/user')
@ApiUseTags('user')
@ApiDescription('用户信息')
@Use(Auth())
@Use(Test())
export default class User {
  @Get()
  @ApiDescription('用户信息1')
  @Render('user')
  index() {
    return { content: 'asdasdasdasd' };
  }

  @Post('/api4')
  @ApiDescription('用户信息2')
  @QuerySchame(
    joi.object().keys({
      id: joi.string(),
      name: joi.number(),
      is: joi.boolean().required(),
    }),
  )
  @BodySchame(
    joi.object().keys({
      name: joi.string().required(),
      code: joi.string().required(),
      desc: joi.string(),
    }),
  )
  api4(@Body() body: any) {
    return ResultUtils.ok(body());
  }

  @Get('/hh')
  api5(@Ctx() ctx: Koa.Context) {
    ctx.redirect('https://www.baidu.com');
  }

  @Post('/test')
  test(@Body() Body: any, @Query() query: any) {}
}
