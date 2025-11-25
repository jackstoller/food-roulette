import { Utensils, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import type { Cuisine } from '../types';

interface CuisineFilterProps {
  cuisines: Cuisine[];
  selectedCuisines: string[];
  onToggle: (cuisine: string) => void;
}

export default function CuisineFilter({ cuisines, selectedCuisines, onToggle }: CuisineFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        setShowArrow(!isAtEnd);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
        <Utensils className="w-4 h-4" /> Cuisine
      </h2>
      <div className="relative -mr-6">
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-6 no-scrollbar px-1 pt-4 -mx-1 snap-x scroll-padding-6 pr-6">
          {cuisines.map((c) => {
            const isSelected = selectedCuisines.includes(c.label);
            return (
              <button
                key={c.label}
                onClick={() => onToggle(c.label)}
                className={`flex flex-col items-center gap-2 min-w-[72px] snap-center transition-all duration-300 ${
                  isSelected 
                    ? 'transform scale-105' 
                    : 'opacity-70 hover:opacity-100 scale-100'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all border-2 ${
                  isSelected 
                    ? 'bg-orange-500 text-white shadow-orange-200 border-orange-500' 
                    : 'bg-white text-gray-700 border-transparent'
                }`}>
                  {c.icon}
                </div>
                <span className={`text-xs font-bold ${
                  isSelected ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
        {showArrow && (
          <div className="absolute right-0 top-4 bottom-6 flex items-center pointer-events-none bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent w-20 transition-opacity duration-300">
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto mr-1" />
          </div>
        )}
      </div>
    </div>
  );
}
