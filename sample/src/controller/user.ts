import {
  Application,
  Controller,
  Get,
  Middleware,
  IRequest,
  Request,
  IResponse,
  Response,
  Optional,
  Render,
  ICtx,
  Ctx,
  Next,
  Param,
  Query,
  Body,
  Headers,
  ApplicationInstance,
  KoaInstance,
  ApiOperation,
  ApiUseTags,
  ApiDescription,
} from '../../../index';

import { Auth } from '../middleware/Auth';
import { Test } from '../middleware/Test';

import { ResultUtils } from '../utils';

import { IsEmail, IsNotEmpty } from 'class-validator';

class CreateUserDto {
  @IsNotEmpty()
  password: string;
}

@Controller('/user')
@ApiUseTags('user')
@ApiDescription('用户信息')
@Middleware(Auth)
@Middleware(Test)
export class User {
  @Get('')
  @ApiOperation('用户信息')
  @Render('user')
  index() {
    return { content: 'asdasdasdasd' };
  }

  @Get('/info')
  @Middleware(Auth)
  info(@Query() query: CreateUserDto, @Optional() @Body('s') s: String = 'hi') {
    return ResultUtils.ok(query);
  }
}
