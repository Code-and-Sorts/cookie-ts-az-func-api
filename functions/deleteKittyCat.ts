import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { KittyCatController } from '@controllers';
import { container } from '@config/inversity.config';
import { detectError } from '@utils';

export async function deleteKittyCat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url '${request.url}'`);

    try {
        const kittyCatId = request.params.id;

        const controller = container.resolve(KittyCatController);

        await controller.delete(kittyCatId);

        return {
            status: 200,
            body: `KittyCat with ID ${ kittyCatId} deleted.`,
            headers: {
                'Content-Type': 'application/json'
            },
        };
    } catch (error) {
        return detectError(error);
    }
};

app.http('deleteKittyCat', {
    methods: ['DELETE'],
    authLevel: 'function',
    route: 'kitties/{id}',
    handler: deleteKittyCat
});
