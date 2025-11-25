import { DollarSign } from 'lucide-react';

interface PriceFilterProps {
  selectedPrices: number[];
  onToggle: (price: number) => void;
}

export default function PriceFilter({ selectedPrices, onToggle }: PriceFilterProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <DollarSign className="w-3 h-3" /> Price
      </h2>
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((p) => (
          <button
            key={p}
            onClick={() => onToggle(p)}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              selectedPrices.includes(p)
                ? 'bg-green-50 text-green-600 border border-green-300' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {'$'.repeat(p)}
          </button>
        ))}
      </div>
    </div>
  );
}
