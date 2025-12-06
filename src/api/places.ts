import type { Place, Cuisine } from '../types';
import { MOCK_PLACES, CUISINES } from '../data/mockData';

const USE_MOCK_DATA = false; // Set to false when backend is available
const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface PlacesQueryParams {
  cuisine?: string | string[];
  price?: number | number[];
  openNow?: boolean;
  radius?: number;
  lat?: number;
  lng?: number;
  userId?: string;
}

// Helper function to filter mock data
function filterPlaces(places: Place[], params?: PlacesQueryParams): Place[] {
  if (!params) return places;

  return places.filter(place => {
    // Filter by cuisine
    if (params.cuisine) {
      const cuisines = Array.isArray(params.cuisine) ? params.cuisine : [params.cuisine];
      if (cuisines.length > 0 && !cuisines.includes('Any') && !cuisines.includes(place.cuisine)) {
        return false;
      }
    }
    
    // Filter by price
    if (params.price) {
      const prices = Array.isArray(params.price) ? params.price : [params.price];
      if (prices.length > 0 && !prices.includes(place.price)) {
        return false;
      }
    }
    
    // Filter by open now
    if (params.openNow && !place.open) {
      return false;
    }
    
    return true;
  });
}

export const api = {
  // Fetch places with optional filters
  async getPlaces(params?: PlacesQueryParams): Promise<Place[]> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return filterPlaces(MOCK_PLACES, params);
    }
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        if (params.cuisine) {
          if (Array.isArray(params.cuisine)) {
            params.cuisine.forEach(c => queryParams.append('cuisine', c));
          } else {
            queryParams.append('cuisine', params.cuisine);
          }
        }
        
        if (params.price) {
          if (Array.isArray(params.price)) {
            params.price.forEach(p => queryParams.append('price', p.toString()));
          } else {
            queryParams.append('price', params.price.toString());
          }
        }
        
        if (params.openNow !== undefined) {
          queryParams.append('openNow', params.openNow.toString());
        }
        
        if (params.radius !== undefined) {
          queryParams.append('radius', params.radius.toString());
        }
        
        if (params.lat !== undefined) {
          queryParams.append('lat', params.lat.toString());
        }
        
        if (params.lng !== undefined) {
          queryParams.append('lng', params.lng.toString());
        }

        if (params.userId) {
          queryParams.append('userId', params.userId);
        }
      }

      const url = `${API_BASE_URL}/places${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Place[]> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch places');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  },

  // Fetch available cuisines
  async getCuisines(): Promise<Cuisine[]> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      return CUISINES;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/places/cuisines`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Cuisine[]> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch cuisines');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching cuisines:', error);
      throw error;
    }
  },

  // Fetch single place by ID
  async getPlaceById(id: number): Promise<Place> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      const place = MOCK_PLACES.find(p => p.id === id);
      if (!place) {
        throw new Error('Place not found');
      }
      return place;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/places/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Place> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch place');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching place:', error);
      throw error;
    }
  },

  // Fetch a random place based on filters
  async getRandomPlace(params?: PlacesQueryParams): Promise<Place> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const filtered = filterPlaces(MOCK_PLACES, params);
      if (filtered.length === 0) {
        throw new Error('No places match the specified filters');
      }
      const randomIndex = Math.floor(Math.random() * filtered.length);
      return filtered[randomIndex];
    }
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('random', 'true');
      
      if (params) {
        if (params.cuisine) {
          if (Array.isArray(params.cuisine)) {
            params.cuisine.forEach(c => queryParams.append('cuisine', c));
          } else {
            queryParams.append('cuisine', params.cuisine);
          }
        }
        
        if (params.price) {
          if (Array.isArray(params.price)) {
            params.price.forEach(p => queryParams.append('price', p.toString()));
          } else {
            queryParams.append('price', params.price.toString());
          }
        }
        
        if (params.openNow !== undefined) {
          queryParams.append('openNow', params.openNow.toString());
        }
        
        if (params.radius !== undefined) {
          queryParams.append('radius', (params.radius * 1000).toString()); // Convert km to meters
        }
        
        if (params.lat !== undefined) {
          queryParams.append('lat', params.lat.toString());
        }
        
        if (params.lng !== undefined) {
          queryParams.append('lng', params.lng.toString());
        }

        if (params.userId) {
          queryParams.append('userId', params.userId);
        }
      }

      const url = `${API_BASE_URL}/places?${queryParams.toString()}`;
      console.log('📡 API Request URL:', url);
      console.log('📍 Coordinates being sent:', { lat: params?.lat, lng: params?.lng, radius: params?.radius });
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Place> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch random place');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching random place:', error);
      throw error;
    }
  }
};
