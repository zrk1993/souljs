import { ICtx, Ctx, Next } from '../../../index';

export class Test {
    async pip(@Ctx() ctx: ICtx, @Next() next: Function) {
        await next();
    }
}
