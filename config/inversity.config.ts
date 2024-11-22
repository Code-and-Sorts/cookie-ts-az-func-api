import "reflect-metadata";
import { Container } from 'inversify';
import { CosmosClient } from '@azure/cosmos';
import { KittyCatRepository } from '@repositories';
import { KittyCatController } from '@controllers';
import { KittyCatService, SchemaValidator } from '@services';
import { env } from '@models';

const client = new CosmosClient({
  endpoint: env.COSMOS_DB_URL,
  key: env.COSMOS_DB_KEY,
});

export const container = new Container({ skipBaseClassChecks: true });
container.bind<SchemaValidator>(SchemaValidator).to(SchemaValidator);
container.bind<KittyCatController>(KittyCatController).to(KittyCatController);
container.bind<KittyCatService>(KittyCatService).to(KittyCatService);
container.bind<KittyCatRepository>(KittyCatRepository).to(KittyCatRepository);
container.bind<CosmosClient>(CosmosClient).toConstantValue(client);

export default container;
