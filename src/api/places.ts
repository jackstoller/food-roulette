import type { Place, Cuisine } from '../types';

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
}

export const api = {
  // Fetch places with optional filters
  async getPlaces(params?: PlacesQueryParams): Promise<Place[]> {
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
  }
};
