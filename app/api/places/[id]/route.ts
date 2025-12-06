import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PLACES } from '@/data/mockData';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteParams) {
    try {
        const { id } = await context.params;
        const parsedId = parseInt(id);
        const place = MOCK_PLACES.find((p) => p.id === parsedId);

        if (!place) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Place not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: place,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Error fetching place',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
