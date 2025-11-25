import { MapPin, Check, X } from 'lucide-react';
import { useState } from 'react';
import type { Filters, ViewState } from '../types';

interface MapViewProps {
  view: ViewState;
  locationName: string;
  filters: Filters;
  userLocation: {lat: number, lng: number} | null;
  onMapClick: () => void;
  onCloseMap: () => void;
  onRadiusChange: (radius: number) => void;
}

const kmToMiles = (km: number) => Math.round(km * 0.621371 * 10) / 10;

export default function MapView({ 
  view, 
  locationName, 
  filters,
  userLocation, 
  onMapClick, 
  onCloseMap,
  onRadiusChange 
}: MapViewProps) {
  const [tempRadius, setTempRadius] = useState(filters.radius);
  
  const handleConfirm = () => {
    onRadiusChange(tempRadius);
    onCloseMap();
  };

  const radiusInMiles = kmToMiles(view === 'map-expanded' ? tempRadius : filters.radius);
  
  // Use user location if available, otherwise default coordinates
  const lat = userLocation?.lat || 40.7150;
  const lng = userLocation?.lng || -73.9900;
  const bbox = `${lng - 0.02},${lat - 0.015},${lng + 0.02},${lat + 0.015}`;
  
  return (
    <div 
      className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${
        view === 'map-expanded' ? 'h-full z-40' : 'h-[50vh] z-0'
      }`}
    >
      <div className="relative w-full h-full bg-gray-200">
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`}
          className={`w-full h-full transition-all ${
            view === 'map-expanded' 
              ? 'pointer-events-auto filter-none opacity-100' 
              : 'pointer-events-none filter grayscale brightness-90 opacity-60'
          }`}
        />
        
        {/* Always show selection area - visible in both landing and expanded states */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
          <div className="relative">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10 relative"></div>
            <div className="absolute top-0 left-0 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-500/30 rounded-full bg-blue-500/10 w-32 h-32 animate-pulse"></div>
          </div>
        </div>
        
        {view === 'landing' && (
          <div 
            onClick={onMapClick}
            className="absolute inset-0 z-10 cursor-pointer bg-gradient-to-b from-transparent to-gray-50/20"
          >
            <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center">
              <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-xl flex flex-col items-center animate-bounce-slow border border-gray-100/50">
                <span className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-orange-500 fill-current" />
                  {locationName}
                </span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">
                  Within {radiusInMiles} miles
                </span>
              </div>
            </div>
          </div>
        )}

        {view === 'map-expanded' && (
          <>
            <div className="absolute top-6 left-4 right-4 flex justify-end items-start z-50 animate-fade-in-down">
              <div className="bg-white p-4 rounded-2xl shadow-xl w-2/3">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Search Radius</h3>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={tempRadius} 
                  onChange={(e) => setTempRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs font-bold mt-1">
                  <span>0.6 mi</span>
                  <span className="text-orange-600">{radiusInMiles} mi</span>
                  <span>12.4 mi</span>
                </div>
              </div>
            </div>

            {/* Confirm and Cancel Buttons */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-50 animate-fade-in-up px-6">
              <button
                onClick={handleConfirm}
                className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Check className="w-6 h-6" />
                Confirm
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setTempRadius(filters.radius);
                  onCloseMap(); 
                }}
                className="bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-100 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <X className="w-6 h-6" />
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className={`absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none ${
        view === 'map-expanded' ? 'opacity-0' : 'opacity-100'
      }`}></div>
    </div>
  );
}
