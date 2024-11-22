import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { KittyCatService } from '@services';
import {
  KittyCat,
  KittyCatRequestSchema,
  KittyCatUpdate,
  KittyCatUpdateSchema,
  GuidSchema,
} from '@models';
import { ValidationError } from '@errors';
import { SchemaValidator } from '@services';

@injectable()
export class KittyCatController {
  private _service: KittyCatService;
  private _validator: SchemaValidator;

  constructor(
    @inject(KittyCatService) service: KittyCatService,
    @inject(SchemaValidator) validator: SchemaValidator
  ) {
    this._service = service;
    this._validator = validator;
  }

  post = async (kittyCatRequest: KittyCat): Promise<KittyCat> => {
    const kittyCat = this._validator.validate(kittyCatRequest, KittyCatRequestSchema);
    return this._service.createKittyCat(kittyCat);
  };

  get = async (id: string): Promise<KittyCat> => {
    this._validator.validate(id, GuidSchema);
    return this._service.getKittyCat(id);
  };

  list = async (): Promise<KittyCat[]> => this._service.getKittyCats();

  update = async (kittyCatRequest: Partial<KittyCatUpdate>): Promise<KittyCat> => {
    if (!kittyCatRequest.id) {
      new ValidationError('Missing kittyCat id.')
    }
    this._validator.validate(kittyCatRequest.id, GuidSchema);
    const kittyCat = this._validator.validate(kittyCatRequest, KittyCatUpdateSchema);
    return this._service.updateKittyCat(kittyCat);
  };

  delete = async (id: string): Promise<void> => {
    this._validator.validate(id, GuidSchema);
    await this._service.deleteKittyCat(id);
  };
}
