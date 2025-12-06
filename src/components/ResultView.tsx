import { ChevronLeft, MapPin, Star, Clock, Info, RotateCcw, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Place, Filters } from '../types';

const FALLBACK_IMAGE = '/question-mark.svg';

interface ResultViewProps {
  place: Place;
  filters: Filters;
  onBack: () => void;
  onReroll: () => void;
  onOpenMaps: () => void;
}

export default function ResultView({ place, filters, onBack, onReroll, onOpenMaps }: ResultViewProps) {
  const [imageSrc, setImageSrc] = useState(() => (
    place.image && place.image.trim().length > 0 ? place.image : FALLBACK_IMAGE
  ));

  useEffect(() => {
    setImageSrc(place.image && place.image.trim().length > 0 ? place.image : FALLBACK_IMAGE);
  }, [place.image]);

  const handleImageError = () => {
    if (imageSrc !== FALLBACK_IMAGE) {
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  const cuisineDescription =
    filters.cuisine.length === 0 || filters.cuisine.includes("Any")
      ? 'something delicious'
      : filters.cuisine.join(', ');

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto animate-slide-up">
      <div className="relative h-[45vh] w-full">
        <img 
          src={imageSrc} 
          alt={place.name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-black/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/40 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="inline-block px-3 py-1 bg-orange-500 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3 shadow-sm">
            {place.cuisine}
          </span>
          <h1 className="text-4xl font-black leading-tight mb-3 drop-shadow-md">{place.name}</h1>
          <div className="flex items-center gap-4 text-sm font-medium opacity-95">
            <span className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" /> {place.rating} ({place.reviews})
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-green-400">{Array(place.price).fill('$').join('')}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-blue-300 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {place.open ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pb-32">
        <div className="flex items-start gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="bg-orange-50 p-2 rounded-full">
            <MapPin className="w-6 h-6 text-orange-500 shrink-0" />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-lg">{place.address}</p>
            <p className="text-gray-500 text-sm mt-1">{(filters.radius - 1.2).toFixed(1)} km away from your location</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3">Highlights</h3>
          <div className="flex flex-wrap gap-2">
            {["Lunch Spot", "Casual", "Good for Groups", "Outdoor Seating"].map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold border border-gray-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-orange-800 text-sm">Why this place?</h3>
          </div>
          <p className="text-orange-900/70 text-sm leading-relaxed">
            Matches your craving for <strong>{cuisineDescription}</strong>. 
            Highly rated by {place.reviews} locals and within your budget range.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur border-t border-gray-100 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50">
        <button 
          onClick={onReroll}
          className="flex-1 bg-gray-100 text-gray-800 h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition active:scale-95"
        >
          <RotateCcw className="w-5 h-5" /> Reroll
        </button>
        <button 
          onClick={onOpenMaps}
          className="flex-2 bg-gray-900 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-gray-400/30 hover:bg-black transition active:scale-95"
        >
          <Navigation className="w-5 h-5" /> Take me there
        </button>
      </div>
    </div>
  );
}
