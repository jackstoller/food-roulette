'use client';

import { useState, useEffect } from 'react';
import { User, Dice5, ChevronLeft } from 'lucide-react';
import type { Cuisine } from '@/types';
import { api } from '@/api/places';
import { useRoulette } from '@/src/hooks/useRoulette';
import MapView from '@/src/components/MapView';
import CuisineFilter from '@/src/components/CuisineFilter';
import PriceFilter from '@/src/components/PriceFilter';
import TimeFilter from '@/src/components/TimeFilter';
import ProfileMenu from '@/src/components/ProfileMenu';
import SlotMachineLoader from '@/src/components/SlotMachineLoader';
import EmptyState from '@/src/components/EmptyState';
import ResultView from '@/src/components/ResultView';
import '@/src/styles/animations.css';

export default function Home() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [locationName, setLocationName] = useState("Downtown District");
  const [searchLocation, setSearchLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    view,
    setView,
    selectedPlace,
    filters,
    setFilters,
    handleRoll: rollDice,
    handleReroll: rerollDice,
    handleBack,
    togglePrice,
    toggleCuisine,
  } = useRoulette();

  // Wrapper functions to inject the current map/geolocation center when rolling
  const handleRoll = () => rollDice(searchLocation);
  const handleReroll = () => rerollDice(searchLocation);

  // Fetch initial data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const cuisinesData = await api.getCuisines();
        setCuisines(cuisinesData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchLocation({ lat: latitude, lng: longitude });
          setLocationName("Current Location");
        },
        () => {
          console.log('Location access denied, using default location');
          // Default to New York City so roulette still works
          setSearchLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      // Browser does not support geolocation, fall back to default city
      setSearchLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  const handleMapClick = () => {
    if (view === 'landing') setView('map-expanded');
  };

  const handleCloseMap = () => {
    setView('landing');
  };

  const openMaps = () => {
    if (!selectedPlace) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lng}`;
    window.open(url, '_blank');
  };

  const onLocationChange = (lat: number, long: number) => {
    console.log('On Location Change', lat, long);
    setSearchLocation({ lat, lng: long });
    setLocationName("Custom Location");
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 select-none">
      
      <MapView 
        view={view}
        locationName={locationName}
        filters={filters}
        searchLocation={searchLocation}
        onMapClick={handleMapClick}
        onCloseMap={handleCloseMap}
        onLocationChange={onLocationChange}
        onRadiusChange={(radius) => setFilters({...filters, radius})}
      />

      <div className={`absolute top-4 right-4 z-30 transition-all duration-500 ${
        view !== 'landing' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <button 
          onClick={() => setShowProfileMenu(true)}
          className="w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition border border-gray-100"
        >
          <User className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div 
        className={`absolute top-[40vh] left-0 w-full h-[60vh] bg-gray-50 rounded-t-[2.5rem] shadow-[0_-10px_60px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-out z-10 flex flex-col
        ${view === 'map-expanded' ? 'translate-y-full' : 'translate-y-0'}
        ${view === 'rolling' || view === 'result' || view === 'empty' ? 'translate-y-full' : ''}
        `}
      >
        <div className="w-full flex justify-center pt-3 pb-1" onClick={handleMapClick}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full opacity-50"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-2 custom-scrollbar">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none">Food Roulette</h1>
            <p className="text-gray-500 mt-1 font-medium text-sm">Feeling indecisive? Let fate decide.</p>
          </div>

          <CuisineFilter 
            cuisines={cuisines}
            selectedCuisines={filters.cuisine}
            onToggle={toggleCuisine}
          />

          <div className="grid grid-cols-2 gap-4 mb-8">
            <PriceFilter 
              selectedPrices={filters.price}
              onToggle={togglePrice}
            />
            <TimeFilter 
              openNow={filters.openNow}
              onToggle={() => setFilters({...filters, openNow: !filters.openNow})}
            />
          </div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <button 
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="flex items-center justify-between w-full text-gray-500 hover:text-gray-800 transition group"
            >
              <span className="text-sm font-medium group-hover:text-orange-500 transition-colors">More Options</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Rating 4.0+</span>
                <ChevronLeft className={`w-4 h-4 group-hover:text-orange-500 transition-transform ${
                  showMoreOptions ? 'transform rotate-90' : 'transform -rotate-90'
                }`} />
              </div>
            </button>
            
            {showMoreOptions && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Minimum Rating</span>
                  <select className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium bg-white">
                    <option>4.0+</option>
                    <option>4.5+</option>
                    <option>3.5+</option>
                    <option>Any</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Delivery Available</span>
                  <input type="checkbox" className="w-5 h-5 accent-orange-500" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-gray-50 via-gray-50 to-transparent">
          <button 
            onClick={handleRoll}
            className="w-full bg-gray-900 text-white h-16 rounded-2xl font-bold text-lg shadow-xl shadow-gray-400/50 flex items-center justify-center gap-3 transform transition hover:scale-[1.02] active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              ROLL THE DICE <Dice5 className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            </span>
          </button>
        </div>
      </div>

      {view === 'rolling' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
          <SlotMachineLoader />
        </div>
      )}

      {view === 'empty' && <EmptyState onBack={handleBack} />}

      {view === 'result' && selectedPlace && (
        <ResultView 
          place={selectedPlace}
          filters={filters}
          onBack={handleBack}
          onReroll={handleReroll}
          onOpenMaps={openMaps}
        />
      )}

      <ProfileMenu 
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />
    </div>
  );
}
