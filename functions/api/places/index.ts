import { searchNearbyPlaces, getRandomPlace } from '../../../lib/googlePlaces';
import { buildFiltersSnapshot, recordRoll } from '../../../lib/rollsRepository';

export async function onRequest(context: any) {
    try {
        const url = new URL(context.request.url);
        const searchParams = url.searchParams;
        
        const cuisine = searchParams
            .getAll('cuisine')
            .filter((value) => typeof value === 'string' && value.length > 0);
        const price = searchParams
            .getAll('price')
            .map((p) => Number.parseInt(p, 10))
            .filter((p) => !Number.isNaN(p));
        const openNow = searchParams.get('openNow') === 'true';
        const random = searchParams.get('random') === 'true';
        const lat = parseFloat(searchParams.get('lat') || '40.7128');
        const lng = parseFloat(searchParams.get('lng') || '-74.0060');
        const radiusParam = Number.parseInt(
            searchParams.get('radius') || '5000',
            10
        );
        const radius = Number.isNaN(radiusParam) ? 5000 : radiusParam;
        const userId = searchParams.get('userId');

        // Return random single place if requested
        if (random) {
            const randomPlace = await getRandomPlace({
                lat,
                lng,
                radius,
                cuisineTypes: cuisine.length > 0 ? cuisine : undefined,
                priceLevels: price.length > 0 ? price : undefined,
                openNow,
            });

            if (!randomPlace) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'No places match the specified filters',
                }), {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }

            if (userId) {
                try {
                    recordRoll({
                        userId,
                        place: randomPlace,
                        filters: buildFiltersSnapshot({
                            cuisine,
                            price,
                            openNow,
                            radius,
                        }),
                    });
                } catch (dbError) {
                    console.error('Failed to record roll history:', dbError);
                }
            }

            return new Response(JSON.stringify({
                success: true,
                data: randomPlace,
            }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Return all matching places
        const places = await searchNearbyPlaces({
            lat,
            lng,
            radius,
            cuisineTypes: cuisine.length > 0 ? cuisine : undefined,
            priceLevels: price.length > 0 ? price : undefined,
            openNow,
        });

        return new Response(JSON.stringify({
            success: true,
            count: places.length,
            data: places,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error in places API:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Error fetching places',
            error: error instanceof Error ? error.message : 'Unknown error',
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
