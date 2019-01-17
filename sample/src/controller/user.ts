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
    INext,
    Next,
    Param,
    Query,
    Body,
    Headers,
    ApplicationInstance,
    KoaInstance,
} from '../../../index';

import { Auth } from '../middleware/Auth';

@Controller('/user')
@Middleware(Auth)
export class User {

    @Get('/info')
    @Middleware(Auth, '122')
    @Middleware(Auth, '122')
    @Middleware(Auth, '122')
    info(
        @Request() req: IRequest,
        @Response() res: IResponse,
        @Query() query: any,
        @Headers() hreaders: any,
        @ApplicationInstance() applicationCache: Application,
        @Body() body: { a: 12, as: 9 }
    ) {
        return query;
    }

}