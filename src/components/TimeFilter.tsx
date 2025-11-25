import { Clock } from 'lucide-react';

interface TimeFilterProps {
  openNow: boolean;
  onToggle: () => void;
}

const TIME_OPTIONS = [
  { label: 'Any Time', value: 'any' },
  { label: 'Open Now', value: 'now' },
  { label: 'In 30 min', value: '30min' },
  { label: 'In 1 hour', value: '1hour' },
  { label: 'In 2 hours', value: '2hours' },
];

export default function TimeFilter({ openNow, onToggle }: TimeFilterProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Clock className="w-3 h-3" /> Time
      </h2>
      <div className="flex flex-col gap-2">
        {TIME_OPTIONS.map((option) => {
          const isSelected = option.value === 'now' ? openNow : option.value === 'any' && !openNow;
          return (
            <button
              key={option.value}
              onClick={() => {
                if (option.value === 'now' && !openNow) {
                  onToggle();
                } else if (option.value === 'any' && openNow) {
                  onToggle();
                }
                // TODO: Handle other time options when backend is ready
              }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span>{option.label}</span>
              {isSelected && option.value === 'now' && (
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
