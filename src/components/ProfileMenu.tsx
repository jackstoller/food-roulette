import { X, History, Star, Info, LogOut } from 'lucide-react';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800">Profile</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col items-center py-8 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-4xl shadow-lg mb-4">
            😎
          </div>
          <p className="font-black text-xl text-gray-900">Foodie Explorer</p>
          <p className="text-sm text-gray-500 font-medium">Member since 2023</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-orange-50 rounded-xl transition text-left group">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition">
                <History className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-orange-600 transition">Past Rolls</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-yellow-50 rounded-xl transition text-left group">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-yellow-600 transition">Favorites</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-xl transition text-left group">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">About App</span>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <button className="w-full flex items-center justify-center gap-3 p-4 text-white bg-red-500 hover:bg-red-600 rounded-xl transition font-bold shadow-lg shadow-red-200">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
