import { NextRequest, NextResponse } from 'next/server';
import { searchNearbyPlaces, getRandomPlace } from '@/lib/googlePlaces';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cuisine = searchParams.getAll('cuisine');
    const price = searchParams.getAll('price').map(p => parseInt(p));
    const openNow = searchParams.get('openNow') === 'true';
    const random = searchParams.get('random') === 'true';
    const lat = parseFloat(searchParams.get('lat') || '40.7128');
    const lng = parseFloat(searchParams.get('lng') || '-74.0060');
    const radius = parseInt(searchParams.get('radius') || '5000');

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
        return NextResponse.json({
          success: false,
          message: 'No places match the specified filters'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        data: randomPlace
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

    return NextResponse.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('Error in places API:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching places',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
