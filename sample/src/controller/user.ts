import {
    Application,
    Controller,
    Get,
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

@Controller('/user')
export class User {

    @Get('/info')
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