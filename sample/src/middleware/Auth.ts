import { ICtx, Ctx, INext, Next } from '../../../index';

export class Auth {

    private aa: string;

    constructor(aa?: string) {
        this.aa = aa;
    }

    async pip(@Ctx() ctx: ICtx, @Next() next: INext) {
        console.log(this.aa);
        await next();
    }
}
