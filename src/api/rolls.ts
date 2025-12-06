import type { Place, RollFiltersSnapshot, RollRecord } from '../types';
import type { ApiResponse } from './places';

const API_BASE_URL = '/api';

export const rollsApi = {
  async fetchHistory(userId: string, limit: number = 50): Promise<RollRecord[]> {
    const query = new URLSearchParams({ userId, limit: limit.toString() });
    const response = await fetch(`${API_BASE_URL}/rolls?${query.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to load roll history (status ${response.status})`);
    }

    const payload: ApiResponse<RollRecord[]> = await response.json();
    if (!payload.success || !payload.data) {
      throw new Error(payload.message || 'Roll history response was malformed');
    }

    return payload.data;
  },

  async recordRoll(params: { userId: string; place: Place; filters: RollFiltersSnapshot }): Promise<RollRecord> {
    const response = await fetch(`${API_BASE_URL}/rolls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to persist roll (status ${response.status})`);
    }

    const payload: ApiResponse<RollRecord> = await response.json();
    if (!payload.success || !payload.data) {
      throw new Error(payload.message || 'Roll persistence response was malformed');
    }

    return payload.data;
  },
};
