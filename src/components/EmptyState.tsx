import { Ghost } from 'lucide-react';

interface EmptyStateProps {
    onBack: () => void;
}

export default function EmptyState({ onBack }: EmptyStateProps) {
    return (
        <div className='fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in'>
            <Ghost className='w-24 h-24 text-gray-700 mb-6' />
            <h2 className='text-3xl font-black text-white mb-2'>Ghost Town</h2>
            <p className='text-gray-400 mb-8'>
                No places matched your strict criteria. Try loosening up a bit?
            </p>
            <button
                onClick={onBack}
                className='bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition'
            >
                Adjust Filters
            </button>
        </div>
    );
}
