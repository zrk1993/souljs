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
} from '../../../index';

import { Auth } from '../middleware/Auth';
import { Test } from '../middleware/Test';

import { IsEmail, IsNotEmpty } from 'class-validator';

class CreateUserDto {

  @IsNotEmpty()
  password: string;
}


@Controller('/user')
@Middleware(Auth)
@Middleware(Test)
export class User {
  @Get('/info')
  @Render('/user/info')
  @Middleware(Test)
  @Middleware(Auth)
  info(
    @Request() req: IRequest,
    @Response() res: IResponse,
    @Query() query: CreateUserDto,
    @Optional() @Body('s') s: String = 'hi',
    @Headers() hreaders: any,
    @ApplicationInstance() applicationCache: Application
  ) {
    return s;
  }
}
