import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { KittyCatController } from '@controllers';
import { container } from '@config/inversity.config';
import { KittyCat } from '@models';
import { detectError } from '@utils';

export async function updateKittyCat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url '${request.url}'`);

    try {
        const kittyCatId = request.params.id;
        const kittyCat: KittyCat = await request.json() as KittyCat;

        const controller = container.resolve(KittyCatController);

        const result = await controller.update({ id: kittyCatId, ...kittyCat });

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

app.http('updateKittyCat', {
    methods: ['PUT'],
    authLevel: 'function',
    route: 'kitties/{id}',
    handler: updateKittyCat
});
