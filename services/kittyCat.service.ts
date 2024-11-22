import { inject, injectable } from 'inversify';
import { KittyCatRepository } from '@repositories';
import {
  KittyCat,
  KittyCatResponse,
  KittyCatResponseSchema,
  KittyCatEntitySchema,
} from '@models';

@injectable()
export class KittyCatService {
  private _repo: KittyCatRepository;

  constructor(@inject(KittyCatRepository) repo: KittyCatRepository) {
    this._repo = repo;
  }

  createKittyCat = async (kittyCat: KittyCat): Promise<KittyCatResponse> => {
    const newKittyCat = KittyCatEntitySchema.parse(kittyCat);
    const createdKittyCat: KittyCatResponse = await this._repo.create(newKittyCat);
    return KittyCatResponseSchema.parse(createdKittyCat);
  };

  getKittyCat = async (id: string): Promise<KittyCatResponse> => {
    const kittyCat = await this._repo.get(id);
    return KittyCatResponseSchema.parse(kittyCat);
  };

  getKittyCats = async (): Promise<KittyCatResponse[]> => {
    const kittyCat = await this._repo.list();
    return kittyCat.map((kittyCat) => KittyCatResponseSchema.parse(kittyCat));
  };

  updateKittyCat = async (kittyCat: Partial<KittyCatResponse>) => {
    const updatedKittyCat = await this._repo.update(kittyCat);
    return KittyCatResponseSchema.parse(updatedKittyCat);
  };

  deleteKittyCat = async (id: string): Promise<void> => this._repo.delete(id);
}
