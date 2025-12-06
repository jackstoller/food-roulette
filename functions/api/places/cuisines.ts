import type { Cuisine } from '../../../types';

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

export async function onRequest() {
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

        return new Response(JSON.stringify({
            success: true,
            data: cuisines,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Error fetching cuisines',
            error: error instanceof Error ? error.message : 'Unknown error',
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
