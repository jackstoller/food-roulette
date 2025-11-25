interface PastRoll {
  id: number;
  name: string;
  cuisine: string;
  date: string;
  loved: boolean;
}

interface PastRollsViewProps {
  onBack: () => void;
}

export default function PastRollsView({ onBack }: PastRollsViewProps) {
  const mockPastRolls: PastRoll[] = [
    { id: 1, name: 'Bella Italia', cuisine: '🍝 Italian', date: 'Nov 24, 2025', loved: true },
    { id: 2, name: 'Sushi Palace', cuisine: '🍱 Japanese', date: 'Nov 23, 2025', loved: false },
    { id: 3, name: 'Taco Haven', cuisine: '🌮 Mexican', date: 'Nov 22, 2025', loved: true },
    { id: 4, name: 'Dragon Wok', cuisine: '🥡 Chinese', date: 'Nov 21, 2025', loved: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
      <div className="space-y-3">
        {mockPastRolls.map((roll) => (
          <div key={roll.id} className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900">{roll.name}</h3>
                <p className="text-sm text-gray-600">{roll.cuisine}</p>
              </div>
              {roll.loved && (
                <div className="text-2xl animate-bounce-slow">❤️</div>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium">{roll.date}</p>
          </div>
        ))}
      </div>
      <button onClick={onBack} className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition">
        ← Back
      </button>
    </div>
  );
}
