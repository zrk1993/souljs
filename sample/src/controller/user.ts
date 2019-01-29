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
import { Auth } from '../middleware/Auth';
import { Test } from '../middleware/Test';
import { ResultUtils } from '../utils';
import { Post } from '../../../lib/decorators';

@Controller('/user')
@ApiUseTags('user')
@ApiDescription('用户信息')
@Use(Auth())
@Use(Test())
export default class User {
  @Get()
  @ApiDescription('用户信息1')
  @Render('user')
  @QuerySchame(
    joi.object().keys({
      is: joi.boolean().required(),
      es: joi.boolean().required(),
    }),
  )
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
}
