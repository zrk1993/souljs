import { createApplication } from '../../index';
import { controllers } from './controller';

async function main() {
  const app = await createApplication({
    controllers,
    hbs: {
      viewPath: __dirname + '/views',
    },
    staticAssets: {
      root: __dirname + '/public',
    },
  });

  app.listen(3001);
}

main();
