import { MOCK_PLACES } from '../../../data/mockData';

export async function onRequest(context: any) {
    try {
        const id = context.params.id;
        const parsedId = parseInt(id);
        const place = MOCK_PLACES.find((p) => p.id === parsedId);

        if (!place) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Place not found',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({
            success: true,
            data: place,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Error fetching place',
            error: error instanceof Error ? error.message : 'Unknown error',
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
