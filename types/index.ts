export interface Place {
  id: number;
  name: string;
  cuisine: string;
  price: number;
  rating: number;
  open: boolean;
  lat: number;
  lng: number;
  image: string;
  reviews: number;
  address: string;
}

export interface Cuisine {
  label: string;
  icon: string;
}

export interface Filters {
  cuisine: string[];
  price: number[];
  openNow: boolean;
  radius: number;
}

export type ViewState = 'landing' | 'map-expanded' | 'rolling' | 'result' | 'empty';
