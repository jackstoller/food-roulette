import { listRolls, normalizeFiltersSnapshot, recordRoll } from '../../lib/rollsRepository';
import type { Place, RollFiltersSnapshot } from '../../types';

function parseLimit(value: string | null): number {
  if (!value) return 50;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return 50;
  }
  return Math.min(parsed, 200);
}

function ensurePlace(payload: any): payload is Place {
  return Boolean(
    payload &&
    typeof payload.name === 'string' &&
    typeof payload.cuisine === 'string' &&
    typeof payload.price === 'number' &&
    typeof payload.rating === 'number' &&
    typeof payload.address === 'string' &&
    typeof payload.image === 'string' &&
    typeof payload.lat === 'number' &&
    typeof payload.lng === 'number'
  );
}

function coerceFiltersSnapshot(filters: any): RollFiltersSnapshot {
  if (!filters) {
    return normalizeFiltersSnapshot();
  }

  const cuisine = Array.isArray(filters.cuisine)
    ? filters.cuisine.filter((value: unknown): value is string => typeof value === 'string')
    : [];

  const price = Array.isArray(filters.price)
    ? filters.price.filter((value: unknown): value is number => typeof value === 'number')
    : [];

  const openNow = typeof filters.openNow === 'boolean' ? filters.openNow : true;
  const radiusMeters = typeof filters.radiusMeters === 'number' ? filters.radiusMeters : 5000;

  return normalizeFiltersSnapshot({ cuisine, price, openNow, radiusMeters });
}

export async function onRequestGet(context: any) {
  try {
    const url = new URL(context.request.url);
    const searchParams = url.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required userId parameter',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const limit = parseLimit(searchParams.get('limit'));
    const rolls = listRolls(userId, limit);

    return new Response(JSON.stringify({
      success: true,
      count: rolls.length,
      data: rolls,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching rolls history:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to load roll history',
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function onRequestPost(context: any) {
  try {
    const payload = await context.request.json();
    const { userId, place, filters } = payload ?? {};

    if (!userId || typeof userId !== 'string') {
      return new Response(JSON.stringify({
        success: false,
        message: 'A valid userId is required to record a roll',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!ensurePlace(place)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'A valid place object is required to record a roll',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const filtersSnapshot = coerceFiltersSnapshot(filters);
    const record = recordRoll({ userId, place, filters: filtersSnapshot });

    return new Response(JSON.stringify({
      success: true,
      data: record,
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error recording roll:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to record roll',
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
