import { Star } from 'lucide-react';

interface Favorite {
    id: number;
    name: string;
    cuisine: string;
    rating: number;
}

interface FavoritesViewProps {
    onBack: () => void;
}

export default function FavoritesView({ onBack }: FavoritesViewProps) {
    const mockFavorites: Favorite[] = [
        { id: 1, name: 'Bella Italia', cuisine: '🍝 Italian', rating: 4.8 },
        { id: 2, name: 'Taco Haven', cuisine: '🌮 Mexican', rating: 4.7 },
        {
            id: 3,
            name: 'The Burger Joint',
            cuisine: '🍔 American',
            rating: 4.9,
        },
    ];

    return (
        <div className='flex-1 overflow-y-auto custom-scrollbar px-6 py-4'>
            <div className='space-y-3'>
                {mockFavorites.map((fav) => (
                    <div
                        key={fav.id}
                        className='bg-linear-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 hover:shadow-md transition'
                    >
                        <div className='flex justify-between items-center'>
                            <div>
                                <h3 className='font-bold text-gray-900 flex items-center gap-2'>
                                    <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
                                    {fav.name}
                                </h3>
                                <p className='text-sm text-gray-600'>
                                    {fav.cuisine}
                                </p>
                            </div>
                            <div className='text-right'>
                                <div className='text-2xl font-black text-yellow-600'>
                                    {fav.rating}
                                </div>
                                <div className='text-xs text-gray-500'>
                                    rating
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={onBack}
                className='w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition'
            >
                ← Back
            </button>
        </div>
    );
}
