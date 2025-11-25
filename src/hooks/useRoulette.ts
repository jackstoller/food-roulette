import { useState } from 'react';
import type { Place, Filters, ViewState } from '../types';

export function useRoulette(places: Place[]) {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [filters, setFilters] = useState<Filters>({
    cuisine: "Any",
    price: [2],
    openNow: true,
    radius: 5,
  });

  const filterPlaces = (filters: Filters): Place[] => {
    return places.filter(place => {
      const cuisineMatch = filters.cuisine === "Any" || place.cuisine === filters.cuisine;
      const priceMatch = filters.price.includes(place.price);
      const openMatch = !filters.openNow || place.open;
      return cuisineMatch && priceMatch && openMatch;
    });
  };

  const handleRoll = () => {
    setView('rolling');
    
    setTimeout(() => {
      const filtered = filterPlaces(filters);

      if (filtered.length > 0) {
        const winner = filtered[Math.floor(Math.random() * filtered.length)];
        setSelectedPlace(winner);
        setView('result');
      } else {
        setView('empty');
      }
    }, 3000);
  };

  const handleReroll = () => {
    handleRoll();
  };

  const handleBack = () => {
    setView('landing');
    setSelectedPlace(null);
  };

  const togglePrice = (price: number) => {
    setFilters(prev => {
      if (prev.price.includes(price)) {
        if (prev.price.length === 1) return prev;
        return { ...prev, price: prev.price.filter(p => p !== price) };
      }
      return { ...prev, price: [...prev.price, price] };
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
  };
}
