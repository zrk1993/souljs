import {
  Application,
  Controller,
  Get,
  Middleware,
  IRequest,
  Request,
  IResponse,
  Response,
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

@Controller('/user')
@Middleware(Auth)
@Middleware(Test)
export class User {
  @Get('/info')
  @Middleware(Test)
  @Middleware(Auth)
  info(
    @Request() req: IRequest,
    @Response() res: IResponse,
    @Query() query: any,
    @Headers() hreaders: any,
    @ApplicationInstance() applicationCache: Application,
    @Body() body: { a: 12; as: 9 },
  ) {
    return query;
  }
}
