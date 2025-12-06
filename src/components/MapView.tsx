import { MapPin, Check, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Filters, ViewState } from '../types';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';

interface MapViewProps {
    view: ViewState;
    locationName: string;
    filters: Filters;
    searchLocation: { lat: number; lng: number } | null;
    onMapClick: () => void;
    onCloseMap: () => void;
    onRadiusChange: (radius: number) => void;
    onLocationChange: (lat: number, lng: number) => void;
}

const kmToMiles = (km: number) => Math.round(km * 0.621371 * 10) / 10;

// Component to draw radius circle
function RadiusCircle({
    center,
    radiusKm,
}: {
    center: { lat: number; lng: number };
    radiusKm: number;
}) {
    const map = useMap();

    useEffect(() => {
        if (!map || typeof google === 'undefined') return;

        const circle = new google.maps.Circle({
            strokeColor: '#3B82F6',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: '#3B82F6',
            fillOpacity: 0.1,
            map,
            center,
            radius: radiusKm * 1000, // Convert km to meters
        });

        return () => {
            circle.setMap(null);
        };
    }, [map, center, radiusKm]);

    return null;
}

// Component to track map center - only updates when user stops moving
function MapCenterTracker({
    onCenterChange,
}: {
    onCenterChange: (lat: number, lng: number) => void;
}) {
    const map = useMap();

    useEffect(() => {
        if (!map || typeof google === 'undefined') return;

        // Use idle event instead of center_changed for better performance
        const listener = map.addListener('idle', () => {
            const center = map.getCenter();
            if (center) {
                onCenterChange(center.lat(), center.lng());
            }
        });

        return () => {
            google.maps.event.removeListener(listener);
        };
    }, [map, onCenterChange]);

    return null;
}

export default function MapView({
    view,
    locationName,
    filters,
    searchLocation,
    onMapClick,
    onCloseMap,
    onRadiusChange,
    onLocationChange,
}: MapViewProps) {
    const [tempRadius, setTempRadius] = useState(filters.radius);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
        searchLocation || { lat: 40.7128, lng: -74.006 }
    );

    // Update map center when search location changes
    useEffect(() => {
        if (searchLocation) {
            setMapCenter(searchLocation);
        }
    }, [searchLocation]);

    const handleConfirm = () => {
        onRadiusChange(tempRadius);
        onLocationChange(mapCenter.lat, mapCenter.lng);
        onCloseMap();
    };

    const handleCenterChange = useCallback((lat: number, lng: number) => {
        setMapCenter({ lat, lng });
    }, []);

    const radiusInMiles = kmToMiles(
        view === 'map-expanded' ? tempRadius : filters.radius
    );
    const currentRadius = view === 'map-expanded' ? tempRadius : filters.radius;

    // Use environment variable (Next.js uses process.env)
    const GOOGLE_MAPS_API_KEY =
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    return (
        <div
            className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${
                view === 'map-expanded' ? 'h-full z-40' : 'h-[50vh] z-0'
            }`}
        >
            <div className='relative w-full h-full bg-gray-200 overflow-hidden'>
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                    <Map
                        defaultCenter={mapCenter}
                        defaultZoom={14}
                        mapId={
                            process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || undefined
                        }
                        disableDefaultUI={view !== 'map-expanded'}
                        gestureHandling={
                            view === 'map-expanded' ? 'greedy' : 'none'
                        }
                        className={`w-full h-full transition-all ${
                            view === 'map-expanded'
                                ? 'filter-none opacity-100'
                                : 'filter grayscale brightness-90 opacity-60'
                        }`}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {/* Track center changes */}
                        <MapCenterTracker onCenterChange={handleCenterChange} />

                        {/* Show radius circle */}
                        <RadiusCircle
                            center={mapCenter}
                            radiusKm={currentRadius}
                        />

                        {/* Center marker - always visible */}
                        <Marker position={mapCenter} />
                    </Map>
                </APIProvider>

                {/* Crosshair indicator at center */}
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20'>
                    <div className='w-6 h-0.5 bg-blue-500'></div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500'></div>
                </div>

                {view === 'landing' && (
                    <div
                        onClick={onMapClick}
                        className='absolute inset-0 z-10 cursor-pointer bg-linear-to-b from-transparent to-gray-50/20'
                    >
                        <div className='absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center'>
                            <div className='bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-xl flex flex-col items-center animate-bounce-slow border border-gray-100/50'>
                                <span className='font-bold text-gray-800 flex items-center gap-2 text-sm'>
                                    <MapPin className='w-4 h-4 text-orange-500 fill-current' />
                                    {locationName}
                                </span>
                                <span className='text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1'>
                                    Within {radiusInMiles} miles
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'map-expanded' && (
                    <>
                        <div className='absolute top-6 left-4 right-4 flex flex-col gap-3 z-50 animate-fade-in-down'>
                            <div className='bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg'>
                                <p className='text-xs font-semibold text-gray-700'>
                                    Location: {mapCenter.lat.toFixed(4)},{' '}
                                    {mapCenter.lng.toFixed(4)}
                                </p>
                                <p className='text-[10px] text-gray-500 mt-0.5'>
                                    Drag map to adjust • This location will be
                                    used for search
                                </p>
                            </div>

                            <div className='bg-white p-4 rounded-2xl shadow-xl'>
                                <h3 className='text-sm font-bold text-gray-500 uppercase mb-2'>
                                    Search Radius
                                </h3>
                                <input
                                    type='range'
                                    min='1'
                                    max='20'
                                    value={tempRadius}
                                    onChange={(e) =>
                                        setTempRadius(parseInt(e.target.value))
                                    }
                                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500'
                                />
                                <div className='flex justify-between text-xs font-bold mt-1'>
                                    <span>0.6 mi</span>
                                    <span className='text-orange-600'>
                                        {radiusInMiles} mi
                                    </span>
                                    <span>12.4 mi</span>
                                </div>
                            </div>
                        </div>

                        {/* Confirm and Cancel Buttons */}
                        <div className='absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-50 animate-fade-in-up px-6'>
                            <button
                                onClick={handleConfirm}
                                className='bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2 hover:scale-105 active:scale-95'
                            >
                                <Check className='w-6 h-6' />
                                Confirm
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTempRadius(filters.radius);
                                    if (searchLocation) {
                                        setMapCenter(searchLocation);
                                    }
                                    onCloseMap();
                                }}
                                className='bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-100 transition-all flex items-center gap-2 hover:scale-105 active:scale-95'
                            >
                                <X className='w-6 h-6' />
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div
                className={`absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-gray-50 to-transparent pointer-events-none ${
                    view === 'map-expanded' ? 'opacity-0' : 'opacity-100'
                }`}
            ></div>
        </div>
    );
}
