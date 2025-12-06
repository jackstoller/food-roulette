import { useState } from 'react';
import type { Place, Filters, ViewState } from '../types';
import { api } from '../api/places';
import { getOrCreateUserId } from '../lib/userId';

export function useRoulette() {
    const [view, setView] = useState<ViewState>('landing');
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [filters, setFilters] = useState<Filters>({
        cuisine: ['Any'],
        price: [2],
        openNow: true,
        radius: 5,
    });

    const handleRoll = async (
        searchLocation: { lat: number; lng: number } | null
    ) => {
        setView('rolling');

        setTimeout(async () => {
            try {
                // Use search location or default to New York City
                const lat = searchLocation?.lat || 40.7128;
                const lng = searchLocation?.lng || -74.006;

                console.log('🎲 Rolling with location:', {
                    lat,
                    lng,
                    radius: filters.radius,
                });

                const place = await api.getRandomPlace({
                    cuisine: filters.cuisine,
                    price: filters.price,
                    openNow: filters.openNow,
                    radius: filters.radius,
                    lat,
                    lng,
                    userId: getOrCreateUserId(),
                });

                console.log('✅ Found place:', place);
                setSelectedPlace(place);
                setView('result');
            } catch (error) {
                console.error('❌ Error fetching random place:', error);
                setView('empty');
            }
        }, 3000);
    };

    const handleReroll = (
        searchLocation: { lat: number; lng: number } | null
    ) => {
        handleRoll(searchLocation);
    };

    const handleBack = () => {
        setView('landing');
        setSelectedPlace(null);
    };

    const togglePrice = (price: number) => {
        setFilters((prev) => {
            if (prev.price.includes(price)) {
                if (prev.price.length === 1) return prev;
                return {
                    ...prev,
                    price: prev.price.filter((p) => p !== price),
                };
            }
            return { ...prev, price: [...prev.price, price] };
        });
    };

    const toggleCuisine = (cuisine: string) => {
        setFilters((prev) => {
            if (cuisine === 'Any') {
                return { ...prev, cuisine: ['Any'] };
            }

            let newCuisines = prev.cuisine.filter((c) => c !== 'Any');

            if (newCuisines.includes(cuisine)) {
                newCuisines = newCuisines.filter((c) => c !== cuisine);
                if (newCuisines.length === 0) {
                    newCuisines = ['Any'];
                }
            } else {
                newCuisines = [...newCuisines, cuisine];
            }

            return { ...prev, cuisine: newCuisines };
        });
    };

    return {
        view,
        setView,
        selectedPlace,
        filters,
        setFilters,
        handleRoll,
        handleReroll,
        handleBack,
        togglePrice,
        toggleCuisine,
    };
}
