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
  Description,
  ResultUtils,
} from '../../../index';

import * as joi from 'joi';
import * as Koa from 'koa';
import { Auth } from '../middleware/Auth';
import { Test } from '../middleware/Test';
import CurrentUser from '../decorators/current-user';

@Controller('/book')
@Description('用户信息')
@Use(Auth())
@Use(Test())
export default class Book {
  @Get()
  @Description('用户信息1')
  @Render('user')
  index() {
    return { content: 'asdasdasdasd' };
  }

  @Post('/api4')
  @Description('用户信息2')
  @QuerySchame({
    id: joi.string(),
    name: joi.number(),
    is: joi.boolean().required(),
  })
  @BodySchame({
    name: joi.string().required(),
    code: joi.string().required(),
    desc: joi.string(),
  })
  api4(@Body() body: any, @CurrentUser() currentUser: any) {
    return ResultUtils.success(body);
  }

  @Get('/hh')
  api5(@Ctx() ctx: Koa.Context) {
    ctx.redirect('https://www.baidu.com');
  }

  @Post('/test')
  @BodySchame({
    name: joi.string().required(),
    code: joi.string().required(),
    desc: joi.string(),
  })
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
