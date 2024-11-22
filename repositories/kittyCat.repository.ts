import { inject, injectable } from 'inversify';
import { CosmosClient } from '@azure/cosmos';
import { KittyCatItemRecord } from '@models';
import { BaseRepository } from './base.repository';
import 'reflect-metadata';

@injectable()
export class KittyCatRepository extends BaseRepository<KittyCatItemRecord> {
  constructor(
    @inject(CosmosClient) client: CosmosClient
  ) {
    const db = client.database('kittiess-sql-db');
    const container = db.container('kittiess-sql-container');
    super(container);
  }

  create = async (newKittyCat: KittyCatItemRecord): Promise<KittyCatItemRecord> => this.addRecord(newKittyCat);
  get = async (id: string): Promise<KittyCatItemRecord> => this.getRecord(id);
  list = async (): Promise<KittyCatItemRecord[]> => this.getRecords();
  update = async (kittyCat: Partial<KittyCatItemRecord>): Promise<KittyCatItemRecord> => this.updateRecord(kittyCat);
  delete = async (id: string): Promise<void> => this.deleteRecord(id);
}
