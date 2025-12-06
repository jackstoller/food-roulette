import { useCallback, useEffect, useState } from 'react';
import { rollsApi } from '../api/rolls';
import type { RollRecord } from '../types';
import { useUserId } from '../hooks/useUserId';

interface PastRollsViewProps {
  onBack: () => void;
}

function formatDateLabel(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PastRollsView({ onBack }: PastRollsViewProps) {
  const [rolls, setRolls] = useState<RollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useUserId();

  const loadRolls = useCallback(async () => {
    if (!userId) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const history = await rollsApi.fetchHistory(userId, 100);
      setRolls(history);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error while loading rolls';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    void loadRolls();
  }, [loadRolls, userId]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
      {(!userId || isLoading) && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500">
          <span className="animate-pulse text-3xl">🎲</span>
          <p className="font-semibold">
            {!userId ? 'Preparing your profile…' : 'Loading your tasty adventures…'}
          </p>
        </div>
      )}

      {!isLoading && userId && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4">
          <p className="font-semibold mb-2">Could not load your roll history.</p>
          <p className="text-sm mb-3">{error}</p>
          <button
            onClick={loadRolls}
            className="w-full py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && userId && !error && rolls.length === 0 && (
        <div className="bg-gray-50 border border-gray-100 text-center rounded-2xl p-6">
          <p className="text-3xl mb-3">👀</p>
          <p className="font-bold text-gray-800 mb-1">No rolls yet</p>
          <p className="text-sm text-gray-500">Start rolling to build your delicious history!</p>
        </div>
      )}

      {!isLoading && userId && !error && rolls.length > 0 && (
        <div className="space-y-3">
          {rolls.map(roll => (
            <div key={roll.id} className="bg-linear-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{roll.placeName}</h3>
                  <p className="text-sm text-gray-600">{roll.cuisine} · ⭐ {roll.rating.toFixed(1)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-1">{formatDateLabel(roll.rolledAt)}</p>
              <p className="text-sm text-gray-600">{roll.address}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition"
      >
        ← Back
      </button>
    </div>
  );
}
