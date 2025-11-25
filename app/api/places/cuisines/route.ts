import { NextResponse } from 'next/server';
import { CUISINES } from '@/data/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: CUISINES
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error fetching cuisines',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
