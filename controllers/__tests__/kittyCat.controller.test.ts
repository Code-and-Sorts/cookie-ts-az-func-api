process.env.COSMOS_DB_URL = 'https://cosmos-mock.documents.azure.com:443/';
process.env.COSMOS_DB_KEY = 'mock-cosmos-key';

import { KittyCatController } from '@controllers';
import { KittyCatService } from '@services';
import {
    KittyCatRequestSchema,
    KittyCatUpdateSchema,
    GuidSchema,
} from '@models';
import { SchemaValidator } from '@services';
import { ValidationError } from '@errors';
import { injectable } from 'inversify';

let mockResult;
const mockGetKittyCat = jest.fn().mockImplementation(() => mockResult);
const mockGetKittyCats = jest.fn().mockImplementation(() => mockResult);
const mockCreateKittyCat = jest.fn().mockImplementation(() => mockResult);
const mockUpdateKittyCat = jest.fn().mockImplementation(() => mockResult);
const mockDeleteKittyCat = jest.fn().mockImplementation(() => mockResult);

@injectable()
class MockKittyCatService {
    constructor() { }
    getKittyCat = mockGetKittyCat;
    getKittyCats = mockGetKittyCats;
    createKittyCat = mockCreateKittyCat;
    updateKittyCat = mockUpdateKittyCat;
    deleteKittyCat = mockDeleteKittyCat;
}

describe('KittyCatController', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockValidGuid = '91ed1c70-5412-449a-b949-80542a4eb3d5';
    const mockInvalidGuid = 'invalid-guid';
    const mockKittyCatPostRequest = {
        name: 'mockKittyCat',
    };
    const mockKittyCatInvalidPostRequest = {
        name: 'mockKittyCat',
        invalidProp: 'mockInvalidProp',
    };
    const mockKittyCatPutRequest = {
        id: mockValidGuid,
        name: 'mockKittyCat',
    };
    const mockKittyCatInvalidPutRequest = {
        id: mockInvalidGuid,
        name: 'mockKittyCat',
    };
    const mockSchemaValidator = new SchemaValidator();
    const mockKittyCatService = new MockKittyCatService() as unknown as KittyCatService;
    const mockKittyCatController = new KittyCatController(
        mockKittyCatService as KittyCatService,
        mockSchemaValidator as SchemaValidator,
    );

    describe('post', () => {
        it('should successfully call service', async () => {
            await mockKittyCatController.post(mockKittyCatPostRequest);
            expect(mockCreateKittyCat).toHaveBeenCalledTimes(1);
        });

        it('should successfully validate the kittyCat request', async () => {
            const validator = jest
                .spyOn(mockSchemaValidator, 'validate')
                .mockReturnValue(mockKittyCatPostRequest);
            await mockKittyCatController.post(mockKittyCatPostRequest);
            expect(validator).toHaveBeenCalledTimes(1);
            expect(validator).toHaveBeenCalledWith(mockKittyCatPostRequest, KittyCatRequestSchema);
        });

        it('should successfully throw for invalid request', async () => {
            const validator = jest
                .spyOn(mockSchemaValidator, 'validate');
            try {
                await mockKittyCatController.post(mockKittyCatInvalidPostRequest);
            } catch (error) {
                expect(validator).toHaveBeenCalledTimes(1);
                expect(error).toBeInstanceOf(ValidationError);
                expect(error.statusCode).toEqual(422);
                expect(error.message).toEqual('Failed schema validation');
            }
        });
    });

    describe('get', () => {
        it('should successfully call service', async () => {
            await mockKittyCatController.get(mockValidGuid);
            expect(mockGetKittyCat).toHaveBeenCalledTimes(1);
        });

        it('should successfully validate a valid ID', async () => {
            const validator = jest
                .spyOn(mockSchemaValidator, 'validate')
                .mockReturnValue(mockValidGuid);
            await mockKittyCatController.get(mockValidGuid);
            expect(validator).toHaveBeenCalledTimes(1);
            expect(validator).toHaveBeenCalledWith(mockValidGuid, GuidSchema);
        });

        it('should successfully throw validation error for invalid ID', async () => {
            const validator = jest
                .spyOn(mockSchemaValidator, 'validate');
            try {
                await mockKittyCatController.get(mockInvalidGuid);
            } catch (error) {
                expect(validator).toHaveBeenCalledTimes(1);
                expect(error).toBeInstanceOf(ValidationError);
                expect(error.statusCode).toEqual(422);
                expect(error.message).toEqual('Failed schema validation');
            }
        });
    });

    describe('list', () => {
        it('should successfully call service', async () => {
            await mockKittyCatController.list();
            expect(mockGetKittyCats).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        it('should successfully call service', async () => {
            await mockKittyCatController.update(mockKittyCatPutRequest);
            expect(mockUpdateKittyCat).toHaveBeenCalledTimes(1);
        });

        it('should successfully validate a valid ID', async () => {
            const validator = jest
                .spyOn(mockSchemaValidator, 'validate')
                .mockReturnValue(mockUpdateKittyCat);
            await mockKittyCatController.update(mockUpdateKittyCat);
            expect(validator).toHaveBeenCalledTimes(2);
            expect(validator).toHaveBeenCalledWith(mockUpdateKittyCat, KittyCatUpdateSchema);
        });

        it('should successfully throw validation error for invalid ID', async () => {
            const validator = jest
                .spyOn(mockSchemaValidator, 'validate');
            try {
                await mockKittyCatController.update(mockKittyCatInvalidPutRequest);
            } catch (error) {
                expect(validator).toHaveBeenCalledTimes(1);
                expect(error).toBeInstanceOf(ValidationError);
                expect(error.statusCode).toEqual(422);
                expect(error.message).toEqual('Failed schema validation');
            }
        });
    });

    describe('delete', () => {
        it('should successfully call service', async () => {
            await mockKittyCatController.delete(mockValidGuid);
            expect(mockDeleteKittyCat).toHaveBeenCalledTimes(1);
        });

        it('should successfully validate a valid ID', async () => {
            const validator = jest
                .spyOn(mockSchemaValidator, 'validate')
                .mockReturnValue(mockValidGuid);
            await mockKittyCatController.delete(mockValidGuid);
            expect(validator).toHaveBeenCalledTimes(1);
            expect(validator).toHaveBeenCalledWith(mockValidGuid, GuidSchema);
        });

        it('should successfully throw validation error for invalid ID', async () => {
            const validator = jest
                .spyOn(mockSchemaValidator, 'validate');
            try {
                await mockKittyCatController.delete(mockInvalidGuid);
            } catch (error) {
                expect(validator).toHaveBeenCalledTimes(1);
                expect(error).toBeInstanceOf(ValidationError);
                expect(error.statusCode).toEqual(422);
                expect(error.message).toEqual('Failed schema validation');
            }
        });
    });
});
