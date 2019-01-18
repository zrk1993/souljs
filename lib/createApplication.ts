import * as Bodyparser from 'koa-bodyparser';
import * as KoaSession from 'koa-session';
import { Application, ApplicationOptions } from './application';

export async function createApplication(options: ApplicationOptions): Promise<Application> {
    const app = new Application(options);

    console.info('应用全局中间件 %s', 'koa-bodyparser');
    app.getKoaInstance().use(Bodyparser({
        enableTypes: ['json', 'form'],
        textLimit: '1mb',
        jsonLimit: '1mb',
    }));

    console.info('应用全局中间件 %s', 'koa-session');
    const koaSessionConfig = {
        key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        autoCommit: true, /** (boolean) automatically commit headers (default true) */
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    };
    app.getKoaInstance().use(KoaSession(koaSessionConfig, app.getKoaInstance()))

    return app;
}