process.env.COSMOS_DB_URL = 'https://cosmos-mock.documents.azure.com:443/';
process.env.COSMOS_DB_KEY = 'mock-cosmos-key';

import { ValidationError } from '@errors';
import { BaseSchema, GuidSchema } from '@models';
import { SchemaValidator } from '@services';

describe('SchemaValidator', () => {
    process.env.COSMOS_DB_URL = 'mockCosmosDbUrl';
    process.env.COSMOS_DB_KEY = 'mockCosmosDbKey';

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockValidGuid = '0ed3e8a9-4689-4465-9c37-7e91bef07a85';
    const mockInvalidGuid = 'mockInvalidGuid';
    const mockSchemaValidator = new SchemaValidator();
    const mockValidKittyCat = {
        name: 'mockKittyCat',
    };
    const mockInvalidKittyCat1 = {
        name: 'mockKittyCat',
        invalidProp: 'mockInvalidProp',
    };
    const mockInvalidKittyCat2 = {
        name: 'mockKittyCat',
        invalidProp1: {
            invalidProp: 'mockInvalidProp',
        },
        invalidProp2: 'mockInvalidProp',
    };

    it('should successfully throw for invalid schema', () => {
        try {
            mockSchemaValidator.validate(mockInvalidKittyCat1, BaseSchema);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.statusCode).toEqual(422);
            expect(error.message).toEqual('Failed schema validation');
            expect(error.data.length).toEqual(1);
            expect(error.data[0].issue).toEqual("Unrecognized key(s) in object: 'invalidProp'");
        }
    });

    it('should successfully throw for multiple unrecognized keys', () => {
        try {
            mockSchemaValidator.validate(mockInvalidKittyCat2, BaseSchema);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.statusCode).toEqual(422);
            expect(error.message).toEqual('Failed schema validation');
            expect(error.data.length).toEqual(2);
            const issues = error.data.map((invalidKey: { issue: string; }) => {
                return invalidKey.issue;
            });
            expect(issues).toEqual(
                [
                    "Invalid enum value. Expected 'A' | 'B' | 'C', received 'mockInvalidReadingLevel'",
                    "Unrecognized key(s) in object: 'invalidProp'",
                ]
            );
        }
    });

    it('should successfully validate guid', () => {
        const response = mockSchemaValidator.validate(mockValidGuid, GuidSchema);
        expect(response).toEqual(mockValidGuid);
    });

    it('should successfully throw for invalid guid', () => {
        try {
            mockSchemaValidator.validate(mockInvalidGuid, BaseSchema);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.statusCode).toEqual(422);
            expect(error.message).toEqual('Failed schema validation');
        }
    });
});
