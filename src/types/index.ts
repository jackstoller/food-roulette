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

export interface RollFiltersSnapshot {
    cuisine: string[];
    price: number[];
    openNow: boolean;
    radiusMeters: number;
}

export interface RollRecord {
    id: number;
    userId: string;
    placeId: number | null;
    placeName: string;
    cuisine: string;
    price: number;
    rating: number;
    address: string;
    image: string;
    lat: number;
    lng: number;
    rolledAt: string;
    filters: RollFiltersSnapshot;
}

export type ViewState =
    | 'landing'
    | 'map-expanded'
    | 'rolling'
    | 'result'
    | 'empty';
