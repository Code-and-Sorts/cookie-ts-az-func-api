import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { KittyCatController } from '@controllers';
import { container } from '@config/inversity.config';
import { detectError } from '@utils';

export async function getKittyCats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url '${request.url}'`);

    try {
        const controller = container.resolve(KittyCatController);

        const result = await controller.list();

        return {
            status: 200,
            body: JSON.stringify(result, null, 2),
            headers: {
                'Content-Type': 'application/json'
            },
        };
    } catch (error) {
        return detectError(error);
    }
};

app.http('getKittyCats', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'kitties',
    handler: getKittyCats
});
