import {
  Controller,
  Get,
  Post,
  Ctx,
  Query,
  CronJob,
  Use,
  Render,
  Body,
  BodySchame,
  QuerySchame,
  ApiDescription,
  ResultUtils,
} from '../../../index';

import * as joi from 'joi';
import * as Koa from 'koa';
import { Auth } from '../middleware/Auth';
import { Test } from '../middleware/Test';

@Controller()
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
    return ResultUtils.success(body());
  }

  @Get('/hh')
  api5(@Ctx() ctx: Koa.Context) {
    ctx.redirect('https://www.baidu.com');
  }

  @Post('/test')
  test(@Body() body: any, @Query() query: any) {
    return;
  }

  @Get('/cronjob')
  @CronJob('* * * * * *')
  cron() {
    // console.log('hahahahahah');
    return ResultUtils.success('好了');
  }
}
