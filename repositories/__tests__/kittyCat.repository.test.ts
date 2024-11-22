import "reflect-metadata";
import { CosmosClient } from "@azure/cosmos";
import { KittyCatRepository } from "@repositories";
import { injectable } from "inversify";

let mockResult;

@injectable()
class MockCosmosClient {
    public database = jest.fn().mockImplementation(() => ({
        container: jest.fn(() => mockResult),
    }));
}

describe('KittyCatRepository', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockCosmosClient = new MockCosmosClient() as unknown as CosmosClient;
    const mockKittyCatRepository = new KittyCatRepository(mockCosmosClient);
    const mockKittyCatId = '28535ae3-2f1b-4e81-ba13-0f46a0c74ea0';
    const mockKittyCat = {
        name: 'mockKittyCat',
    };
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
    const mockKittyCatUpdate = {
        name: 'mockKittyCatUpdate',
    }

    describe('create', () => {
        it('should successfully create a kittyCat', async () => {
            const repository = jest.spyOn(mockKittyCatRepository, 'create')
                .mockResolvedValue(mockKittyCatsRepositoryResponse[0]);
            const result = await mockKittyCatRepository.create(mockKittyCat);
            expect(repository).toHaveBeenCalledTimes(1);
            expect(repository).toHaveBeenCalledWith(mockKittyCat);
        });
    });

    describe('get', () => {
        it('should successfully get a kittyCat', async () => {
            const repository = jest.spyOn(mockKittyCatRepository, 'get')
                .mockResolvedValue(mockKittyCatsRepositoryResponse[0]);
            const result = await mockKittyCatRepository.get(mockKittyCatId);
            expect(repository).toHaveBeenCalledTimes(1);
            expect(repository).toHaveBeenCalledWith(mockKittyCatId);
        });
    });

    describe('list', () => {
        it('should successfully get kittyCat', async () => {
            const repository = jest.spyOn(mockKittyCatRepository, 'list')
                .mockResolvedValue(mockKittyCatsRepositoryResponse);
            const result = await mockKittyCatRepository.list();
            expect(repository).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        it('should successfully update a kittyCat', async () => {
            const repository = jest.spyOn(mockKittyCatRepository, 'update')
                .mockResolvedValue(mockKittyCatsRepositoryResponse[0]);
            const result = await mockKittyCatRepository.update(mockKittyCatUpdate);
            expect(repository).toHaveBeenCalledTimes(1);
            expect(repository).toHaveBeenCalledWith(mockKittyCatUpdate);
        });
    });

    describe('delete', () => {
        it('should successfully delete a kittyCat', async () => {
            const repository = jest.spyOn(mockKittyCatRepository, 'delete')
                .mockResolvedValue();
            const result = await mockKittyCatRepository.delete(mockKittyCatId);
            expect(repository).toHaveBeenCalledTimes(1);
            expect(repository).toHaveBeenCalledWith(mockKittyCatId);
        });
    });
});