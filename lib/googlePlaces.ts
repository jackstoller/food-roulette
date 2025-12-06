import type { Place } from '@/types';
import { MOCK_PLACES } from '@/data/mockData';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const USE_MOCK_DATA = !GOOGLE_PLACES_API_KEY; // Fallback to mock data if no API key

// Map Google Place types to our cuisine categories
const TYPE_TO_CUISINE_MAP: Record<string, string> = {
  'hamburger_restaurant': 'Burgers',
  'american_restaurant': 'Burgers',
  'meal_takeaway': 'Fast Food',
  'japanese_restaurant': 'Japanese',
  'sushi_restaurant': 'Japanese',
  'ramen_restaurant': 'Japanese',
  'mexican_restaurant': 'Mexican',
  'taco_restaurant': 'Mexican',
  'italian_restaurant': 'Italian',
  'pizza_restaurant': 'Pizza',
  'vegan_restaurant': 'Vegan',
  'vegetarian_restaurant': 'Vegan',
  'indian_restaurant': 'Indian',
  'chinese_restaurant': 'Chinese',
  'thai_restaurant': 'Thai',
  'vietnamese_restaurant': 'Vietnamese',
  'korean_restaurant': 'Korean',
  'french_restaurant': 'French',
  'mediterranean_restaurant': 'Mediterranean',
  'middle_eastern_restaurant': 'Middle Eastern',
  'greek_restaurant': 'Greek',
  'seafood_restaurant': 'Seafood',
  'steak_house': 'Steakhouse',
  'barbecue_restaurant': 'BBQ',
  'cafe': 'Cafe',
  'coffee_shop': 'Cafe',
  'bakery': 'Bakery',
  'dessert_shop': 'Desserts',
  'ice_cream_shop': 'Desserts',
  'sandwich_shop': 'Sandwiches',
  'fast_food_restaurant': 'Fast Food',
  'restaurant': 'Restaurant',
};

// Old Places API response interface
interface OldGooglePlace {
  place_id: string;
  name: string;
  types?: string[];
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    open_now?: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  formatted_address?: string;
  vicinity?: string;
}

interface SearchNearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  cuisineTypes?: string[];
  priceLevels?: number[];
  openNow?: boolean;
}

// Convert old API price level (0-4) to our 1-3 scale
function convertPriceLevel(googlePrice?: number): number {
  if (googlePrice === undefined || googlePrice === null) return 2;
  
  if (googlePrice <= 1) return 1;      // $ or Free
  if (googlePrice === 2) return 2;      // $$
  return 3;                              // $$$ or $$$$
}

// Get cuisine type from Google Place types
function getCuisineFromTypes(types?: string[]): string {
  if (!types || types.length === 0) return 'Restaurant';
  
  // Try to find a specific cuisine type
  for (const type of types) {
    if (TYPE_TO_CUISINE_MAP[type]) {
      return TYPE_TO_CUISINE_MAP[type];
    }
  }
  
  // Default to Restaurant if no specific type found
  return 'Restaurant';
}

// Get photo URL from old Places API
function getPhotoUrl(photoReference?: string, maxWidth: number = 1200): string {
  if (!photoReference || !GOOGLE_PLACES_API_KEY) {
    // Fallback to Unsplash for places without photos
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
  }
  
  // Use Google Places Photo API to get actual restaurant photos
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

// Get multiple photo URLs for a place (useful for future features like photo galleries)
function getPhotoUrls(photos?: Array<{photo_reference: string; height: number; width: number}>): string[] {
  if (!photos || photos.length === 0) {
    return ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'];
  }
  
  return photos.slice(0, 5).map(photo => getPhotoUrl(photo.photo_reference));
}

// Convert old API place to our Place type
function convertOldGooglePlaceToPlace(googlePlace: OldGooglePlace, index: number): Place {
  return {
    id: index,
    name: googlePlace.name || 'Unknown Restaurant',
    cuisine: getCuisineFromTypes(googlePlace.types),
    price: convertPriceLevel(googlePlace.price_level),
    rating: googlePlace.rating || 0,
    open: googlePlace.opening_hours?.open_now ?? true,
    lat: googlePlace.geometry?.location.lat || 0,
    lng: googlePlace.geometry?.location.lng || 0,
    image: getPhotoUrl(googlePlace.photos?.[0]?.photo_reference),
    reviews: googlePlace.user_ratings_total || 0,
    address: googlePlace.vicinity || googlePlace.formatted_address || 'Address not available',
  };
}

export async function searchNearbyPlaces(params: SearchNearbyParams): Promise<Place[]> {
  // Fallback to mock data if no API key or if API fails
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('No Google Places API key configured, using mock data');
    return filterMockPlaces(params);
  }

  const { lat, lng, radius = 5000, cuisineTypes, priceLevels, openNow } = params;

  // Build keyword for search
  let keyword = '';
  if (cuisineTypes && cuisineTypes.length > 0 && !cuisineTypes.includes('Any')) {
    keyword = cuisineTypes.join(' ');
  }

  // Build URL with query parameters
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.append('location', `${lat},${lng}`);
  url.searchParams.append('radius', radius.toString());
  url.searchParams.append('type', 'restaurant');
  if (keyword) {
    url.searchParams.append('keyword', keyword);
  }
  if (openNow) {
    url.searchParams.append('opennow', 'true');
  }
  url.searchParams.append('key', GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('Google Places API error:', response.status);
      console.warn('Falling back to mock data');
      return filterMockPlaces(params);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      console.warn('Falling back to mock data');
      return filterMockPlaces(params);
    }

    let places: Place[] = (data.results || []).map((place: OldGooglePlace, index: number) => 
      convertOldGooglePlaceToPlace(place, index)
    );

    // Log successful API call with photo info
    const placesWithPhotos = places.filter(p => !p.image.includes('unsplash')).length;
    console.log(`✅ Loaded ${places.length} restaurants from Google Places API (${placesWithPhotos} with real photos)`);

    // Apply client-side filters
    if (priceLevels && priceLevels.length > 0) {
      places = places.filter(place => priceLevels.includes(place.price));
    }

    return places;
  } catch (error) {
    console.error('Error searching nearby places:', error);
    console.warn('Falling back to mock data');
    return filterMockPlaces(params);
  }
}

// Filter mock data based on search parameters
function filterMockPlaces(params: SearchNearbyParams): Place[] {
  let places = [...MOCK_PLACES];
  
  // Filter by cuisine
  if (params.cuisineTypes && params.cuisineTypes.length > 0 && !params.cuisineTypes.includes('Any')) {
    places = places.filter(place => params.cuisineTypes!.includes(place.cuisine));
  }
  
  // Filter by price
  if (params.priceLevels && params.priceLevels.length > 0) {
    places = places.filter(place => params.priceLevels!.includes(place.price));
  }
  
  // Filter by open status
  if (params.openNow) {
    places = places.filter(place => place.open);
  }
  
  return places;
}

export async function getRandomPlace(params: SearchNearbyParams): Promise<Place | null> {
  const places = await searchNearbyPlaces(params);
  
  if (places.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * places.length);
  return places[randomIndex];
}

// Get all unique cuisines from available restaurants
export async function getAvailableCuisines(lat: number, lng: number, radius: number = 10000): Promise<string[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    // Return default cuisines if API key not configured
    return ['Any', 'Burgers', 'Japanese', 'Mexican', 'Italian', 'Pizza', 'Vegan', 'Indian', 'Chinese', 'Thai'];
  }

  try {
    const places = await searchNearbyPlaces({ lat, lng, radius });
    const cuisines = new Set(places.map(place => place.cuisine));
    return ['Any', ...Array.from(cuisines).sort()];
  } catch (error) {
    console.error('Error getting available cuisines:', error);
    // Return default cuisines on error
    return ['Any', 'Burgers', 'Japanese', 'Mexican', 'Italian', 'Pizza', 'Vegan', 'Indian', 'Chinese', 'Thai'];
  }
}
