import { createApplication } from '../../index';
import { controllers } from './controller';

async function main() {
  const app = await createApplication({
    controllers,
  });

  app.listen(3000);
}

main();
