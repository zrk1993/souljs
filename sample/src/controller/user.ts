import {
  Controller,
  Get,
  Middleware,
  Optional,
  Render,
  Query,
  Body,
  ApiOperation,
  ApiUseTags,
  ApiDescription,
} from '../../../index';

import { Auth } from '../middleware/Auth';
import { Test } from '../middleware/Test';

import { ResultUtils } from '../utils';

import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Post } from '../../../lib/decorators';

class CreateUserDto {
  @IsString()
  name: string;
  @IsNumber()
  age: number;
  @IsBoolean()
  isvip: boolean;
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

  @Post('/api4')
  api4(@Body('uu') user: Array<string>) {
    return ResultUtils.ok();
  }
}
