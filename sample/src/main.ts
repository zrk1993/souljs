import { createApplication } from '../../index';

async function main() {
  const app = await createApplication(__dirname, 'controller/*.ts');

  app.getKoaInstance().on('error', (err, ctx) => {
    ctx.body = err;
  });

  app.use(async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
      ctx.body = '404';
    }
  });

  app.listen(3001);
}

process.on('uncaughtException', () => {
  process.exit(1);
});

process.on('unhandledRejection', () => {
  process.exit(1);
});

main();
