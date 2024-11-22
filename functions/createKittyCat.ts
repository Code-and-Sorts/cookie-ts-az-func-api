import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { KittyCatController } from '@controllers';
import { container } from '@config/inversity.config';
import { KittyCat } from '@models';
import { detectError } from '@utils';

export async function createKittyCat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url '${request.url}'`);

    try {
        const kittyCat: KittyCat = await request.json() as KittyCat;

        const controller = container.resolve(KittyCatController);

        const result = await controller.post(kittyCat);

        return {
            status: 201,
            body: JSON.stringify(result, null, 2),
            headers: {
                'Content-Type': 'application/json'
            },
        };
    } catch (error) {
        return detectError(error);
    }
};

app.http('createKittyCat', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'kitties',
    handler: createKittyCat
});
