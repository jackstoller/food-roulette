export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { Cuisine } from '@/types';

// Define cuisine icons
const CUISINE_ICONS: Record<string, string> = {
    'Any': '🍽️',
    'Burgers': '🍔',
    'Japanese': '🍣',
    'Mexican': '🌮',
    'Italian': '🍝',
    'Pizza': '🍕',
    'Vegan': '🥗',
    'Indian': '🍛',
    'Chinese': '🥡',
    'Thai': '🍜',
    'Vietnamese': '🍲',
    'Korean': '🍱',
    'French': '🥐',
    'Mediterranean': '🫒',
    'Middle Eastern': '🧆',
    'Greek': '🥙',
    'Seafood': '🦞',
    'Steakhouse': '🥩',
    'BBQ': '🍖',
    'Cafe': '☕',
    'Bakery': '🥖',
    'Desserts': '🍰',
    'Sandwiches': '🥪',
    'Fast Food': '🍟',
    'Restaurant': '🍽️',
};

export async function GET() {
    try {
        // Return a comprehensive list of cuisines
        // In a production app, you might want to dynamically fetch this based on available restaurants
        const cuisineLabels = [
            'Any',
            'Burgers',
            'Japanese',
            'Mexican',
            'Italian',
            'Pizza',
            'Vegan',
            'Indian',
            'Chinese',
            'Thai',
            'Vietnamese',
            'Korean',
            'French',
            'Mediterranean',
            'Middle Eastern',
            'Greek',
            'Seafood',
            'Steakhouse',
            'BBQ',
            'Cafe',
            'Bakery',
            'Desserts',
            'Sandwiches',
            'Fast Food',
        ];

        const cuisines: Cuisine[] = cuisineLabels.map((label) => ({
            label,
            icon: CUISINE_ICONS[label] || '🍽️',
        }));

        return NextResponse.json({
            success: true,
            data: cuisines,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Error fetching cuisines',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
