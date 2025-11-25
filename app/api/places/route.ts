import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PLACES } from '@/data/mockData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cuisine = searchParams.getAll('cuisine');
    const price = searchParams.getAll('price').map(p => parseInt(p));
    const openNow = searchParams.get('openNow') === 'true';

    let filteredPlaces = [...MOCK_PLACES];

    // Filter by cuisine
    if (cuisine.length > 0 && !cuisine.includes('Any')) {
      filteredPlaces = filteredPlaces.filter(place => 
        cuisine.includes(place.cuisine)
      );
    }

    // Filter by price
    if (price.length > 0) {
      filteredPlaces = filteredPlaces.filter(place => 
        price.includes(place.price)
      );
    }

    // Filter by open status
    if (openNow) {
      filteredPlaces = filteredPlaces.filter(place => place.open);
    }

    return NextResponse.json({
      success: true,
      count: filteredPlaces.length,
      data: filteredPlaces
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error fetching places',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
