import { ICtx, Ctx, Next } from '../../../index';

export class Auth {
  async pip(@Ctx() ctx: ICtx, @Next() next: Function) {
    await next();
  }
}
