import { useState, useEffect } from 'react';
import type { Place } from '../types';

interface SlotMachineLoaderProps {
  places: Place[];
}

export default function SlotMachineLoader({ places }: SlotMachineLoaderProps) {
  const [currentName, setCurrentName] = useState("Rolling...");
  const [currentIcon, setCurrentIcon] = useState("🎲");
  
  useEffect(() => {
    const icons = ["🍔", "🍣", "🌮", "🍝", "🥗", "🍛", "🍕"];
    const interval = setInterval(() => {
      const randomPlace = places[Math.floor(Math.random() * places.length)];
      setCurrentName(randomPlace.name);
      setCurrentIcon(icons[Math.floor(Math.random() * icons.length)]);
    }, 100);
    return () => clearInterval(interval);
  }, [places]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <div className="text-8xl animate-bounce filter drop-shadow-lg">{currentIcon}</div>
      <div className="h-24 overflow-hidden relative w-full flex justify-center">
        <div className="text-3xl font-black text-gray-800 tracking-tight text-center uppercase">
          Searching...
          <br/>
          <span className="text-orange-500">{currentName}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-75"></div>
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
