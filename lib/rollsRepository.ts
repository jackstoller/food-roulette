import type { Place, RollFiltersSnapshot, RollRecord } from '@/types';
import { getDb } from './db';

interface RecordRollParams {
    userId: string;
    place: Place;
    filters: RollFiltersSnapshot;
}

interface SnapshotParams {
    cuisine: string[];
    price: number[];
    openNow: boolean;
    radius: number;
}

export function normalizeFiltersSnapshot(
    filters?: Partial<RollFiltersSnapshot>
): RollFiltersSnapshot {
    return {
        cuisine:
            filters?.cuisine && filters.cuisine.length > 0
                ? filters.cuisine
                : ['Any'],
        price:
            filters?.price && filters.price.length > 0
                ? filters.price
                : [1, 2, 3],
        openNow: filters?.openNow ?? true,
        radiusMeters: filters?.radiusMeters ?? 5000,
    };
}

function mapRowToRecord(row: any): RollRecord {
    let parsedFilters: RollFiltersSnapshot = normalizeFiltersSnapshot();
    if (row.filters) {
        try {
            parsedFilters = normalizeFiltersSnapshot(JSON.parse(row.filters));
        } catch (error) {
            console.warn(
                'Failed to parse roll filters JSON, using defaults',
                error
            );
        }
    }

    return {
        id: row.id,
        userId: row.user_id,
        placeId: row.place_id ?? null,
        placeName: row.place_name,
        cuisine: row.cuisine,
        price: row.price,
        rating: row.rating,
        address: row.address,
        image: row.image,
        lat: row.lat,
        lng: row.lng,
        rolledAt: row.rolled_at,
        filters: parsedFilters,
    };
}

export function recordRoll({
    userId,
    place,
    filters,
}: RecordRollParams): RollRecord {
    const db = getDb();
    const rolledAt = new Date().toISOString();
    const statement = db.prepare(`
        INSERT INTO rolls (
        user_id,
        place_id,
        place_name,
        cuisine,
        price,
        rating,
        address,
        image,
        lat,
        lng,
        filters,
        rolled_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const filtersJson = JSON.stringify(normalizeFiltersSnapshot(filters));

    const info = statement.run(
        userId,
        place.id ?? null,
        place.name,
        place.cuisine,
        place.price,
        place.rating,
        place.address,
        place.image,
        place.lat,
        place.lng,
        filtersJson,
        rolledAt
    );

    return {
        id: Number(info.lastInsertRowid),
        userId,
        placeId: place.id ?? null,
        placeName: place.name,
        cuisine: place.cuisine,
        price: place.price,
        rating: place.rating,
        address: place.address,
        image: place.image,
        lat: place.lat,
        lng: place.lng,
        rolledAt,
        filters: JSON.parse(filtersJson),
    };
}

export function listRolls(userId: string, limit: number = 50): RollRecord[] {
    const db = getDb();
    const statement = db.prepare(`
        SELECT
        id,
        user_id,
        place_id,
        place_name,
        cuisine,
        price,
        rating,
        address,
        image,
        lat,
        lng,
        filters,
        rolled_at
        FROM rolls
        WHERE user_id = ?
        ORDER BY rolled_at DESC
        LIMIT ?
    `);

    const rows = statement.all(userId, limit);
    return rows.map(mapRowToRecord);
}

export function buildFiltersSnapshot(
    params: SnapshotParams
): RollFiltersSnapshot {
    const cleanedCuisine = params.cuisine.length > 0 ? params.cuisine : ['Any'];
    const cleanedPrice = params.price.length > 0 ? params.price : [1, 2, 3];

    return normalizeFiltersSnapshot({
        cuisine: cleanedCuisine,
        price: cleanedPrice,
        openNow: params.openNow,
        radiusMeters: params.radius,
    });
}
