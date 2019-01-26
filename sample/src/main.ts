import { createApplication } from '../../index';

async function main() {
  const app = await createApplication(__dirname, 'controller/*.ts');

  app.listen(3001);
}

main();
