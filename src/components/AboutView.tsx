interface AboutViewProps {
  onBack: () => void;
}

export default function AboutView({ onBack }: AboutViewProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg">
          🎲
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Food Roulette</h3>
        <p className="text-sm text-gray-500 font-medium">Version 1.0.0</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          <span className="font-bold text-blue-600">Food Roulette</span> takes the stress out of choosing where to eat! 
          Simply set your preferences and let fate decide your next culinary adventure.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Discover new restaurants nearby</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Filter by cuisine, price & more</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span>Never be indecisive again!</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mb-4">
        Made with ❤️ by food lovers, for food lovers
      </div>

      <button onClick={onBack} className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition">
        ← Back
      </button>
    </div>
  );
}
