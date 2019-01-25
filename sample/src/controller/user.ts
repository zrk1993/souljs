import {
  Controller,
  Get,
  Use,
  Render,
  Query,
  Body,
  ApiOperation,
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
export class User {
  @Get('')
  @ApiOperation('用户信息')
  @Render('user')
  index() {
    return { content: 'asdasdasdasd' };
  }

  @Post('/api4')
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
    return ResultUtils.ok(body);
  }
}
