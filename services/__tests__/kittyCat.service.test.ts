process.env.COSMOS_DB_URL = 'https://cosmos-mock.documents.azure.com:443/';
process.env.COSMOS_DB_KEY = 'mock-cosmos-key';

import { injectable } from 'inversify';
import { KittyCatService } from '@services';
import { KittyCatRepository } from '@repositories';
import { KittyCatEntitySchema } from '@models';

let mockResult;
const mockGet = jest.fn().mockImplementation(() => mockResult);
const mockList = jest.fn().mockImplementation(() => mockResult);
const mockCreate = jest.fn().mockImplementation(() => mockResult);
const mockUpdate = jest.fn().mockImplementation(() => mockResult);
const mockDelete = jest.fn().mockImplementation(() => mockResult);

@injectable()
class MockKittyCatRepository {
    constructor() { }
    get = mockGet;
    list = mockList;
    create = mockCreate;
    update = mockUpdate;
    delete = mockDelete;
}

describe('KittyCatService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockKittyCatRepository = new MockKittyCatRepository() as unknown as KittyCatRepository;
    const mockKittyCatService = new KittyCatService(mockKittyCatRepository);
    const mockKittyCatId = '28535ae3-2f1b-4e81-ba13-0f46a0c74ea0';
    const mockKittyCatCreate = {
        name: 'mockKittyCat1',
    };
    const mockKittyCatCreateSchema = {
        id: '28535ae3-2f1b-4e81-ba13-0f46a0c74ea0',
        name: 'mockKittyCat1',
        createdTimestamp: '2024-03-24T00:00:00.000Z',
        updatedTimestamp: '2024-03-24T00:00:00.000Z',
    };
    const mockKittyCatUpdate = {
        id: '28535ae3-2f1b-4e81-ba13-0f46a0c74ea0',
        name: 'mockKittyCat1-updated',
    };
    const mockKittyCatUpdateResponse = {
        id: '28535ae3-2f1b-4e81-ba13-0f46a0c74ea0',
        name: 'mockKittyCat1-updated',
    };
    const mockKittyCatsResponse = [
        {
            id: '28535ae3-2f1b-4e81-ba13-0f46a0c74ea0',
            name: 'mockKittyCat1',
        },
        {
            id: '8123e7f0-b294-4b55-9bd6-d87734d5ad21',
            name: 'mockKittyCat2',
        }
    ];
    const mockKittyCatsRepositoryResponse = [
        {
            id: '28535ae3-2f1b-4e81-ba13-0f46a0c74ea0',
            name: 'mockKittyCat1',
            isDeleted: false,
            createdTimestamp: '2024-03-24T00:00:00.000Z',
            updatedTimestamp: '2024-03-24T00:00:00.000Z',
            createdBy: 'mockUser',
            updatedBy: 'mockUser',
        },
        {
            id: '8123e7f0-b294-4b55-9bd6-d87734d5ad21',
            name: 'mockKittyCat2',
            isDeleted: false,
            createdTimestamp: '2024-03-24T00:00:00.000Z',
            updatedTimestamp: '2024-03-24T00:00:00.000Z',
            createdBy: 'mockUser',
            updatedBy: 'mockUser',
        }
    ];
    const mockKittyCatsRepositoryUpdateResponse = {
        id: '28535ae3-2f1b-4e81-ba13-0f46a0c74ea0',
        name: 'mockKittyCat1-updated',
        isDeleted: false,
        createdTimestamp: '2024-03-24T00:00:00.000Z',
        updatedTimestamp: '2024-03-24T00:00:00.000Z',
        createdBy: 'mockUser',
        updatedBy: 'mockUser',
    };

    describe('createKittyCat', () => {
        it('should successfully call repository', async () => {
            const repository = jest
                .spyOn(mockKittyCatRepository, 'create')
                .mockReturnValue(Promise.resolve(mockKittyCatsRepositoryResponse[0]));
            jest
                .spyOn(KittyCatEntitySchema, 'parse')
                .mockReturnValue(mockKittyCatCreateSchema);
            const result = await mockKittyCatService.createKittyCat(mockKittyCatCreate);
            expect(mockCreate).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockKittyCatsResponse[0]);
            expect(repository).toHaveBeenCalledTimes(1);
            expect(repository).toHaveBeenCalledWith(mockKittyCatCreateSchema);
        });
    });

    describe('getKittyCat', () => {
        it('should successfully call repository', async () => {
            const repository = jest
                .spyOn(mockKittyCatRepository, 'get')
                .mockReturnValue(Promise.resolve(mockKittyCatsRepositoryResponse[0]));
            const result = await mockKittyCatService.getKittyCat(mockKittyCatId);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockKittyCatsResponse[0]);
            expect(repository).toHaveBeenCalledTimes(1);
            expect(repository).toHaveBeenCalledWith(mockKittyCatId);
        });
    });

    describe('getKittyCats', () => {
        it('should successfully call repository', async () => {
            const repository = jest
                .spyOn(mockKittyCatRepository, 'list')
                .mockReturnValue(Promise.resolve(mockKittyCatsRepositoryResponse));
            const result = await mockKittyCatService.getKittyCats();
            expect(mockList).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockKittyCatsResponse);
            expect(repository).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateKittyCat', () => {
        it('should successfully call repository', async () => {
            const repository = jest
                .spyOn(mockKittyCatRepository, 'update')
                .mockReturnValue(Promise.resolve(mockKittyCatsRepositoryUpdateResponse));
            const result = await mockKittyCatService.updateKittyCat(mockKittyCatUpdate);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockKittyCatUpdateResponse);
            expect(repository).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteKittyCat', () => {
        it('should successfully call repository', async () => {
            const repository = jest
                .spyOn(mockKittyCatRepository, 'delete');
            await mockKittyCatService.deleteKittyCat(mockKittyCatId);
            expect(repository).toHaveBeenCalledTimes(1);
            expect(repository).toHaveBeenCalledWith(mockKittyCatId);
        });
    });
});
