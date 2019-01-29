import { createApplication } from '../../index';

async function main() {
  const app = await createApplication(__dirname, 'controller/*.ts');

  app.getKoaInstance().on('error', (err, ctx) => {
    console.error(err);
  });

  app.use(async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
      ctx.body = '404';
    }
  });

  app.listen(3001);
}

process.on('uncaughtException', error => {
  // TODO Youch
  console.error('uncaughtException', error);
});

process.on('unhandledRejection', error => {
  // TODO Youch
  console.error('unhandledRejection', error);
});

main();
