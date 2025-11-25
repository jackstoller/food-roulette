import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PLACES } from '@/data/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const place = MOCK_PLACES.find(p => p.id === id);
    
    if (!place) {
      return NextResponse.json({
        success: false,
        message: 'Place not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: place
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error fetching place',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
