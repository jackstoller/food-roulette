# Food Roulette

Next.js 16 / React 19 experience that helps hungry students discover nearby restaurants by “rolling” for a random spot using Google Places or curated mock data. Rolls, rerolls, and profile history are now persisted in SQLite so the profile drawer can show an accurate meal timeline.

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. (Optional) Set `GOOGLE_PLACES_API_KEY` in `.env.local` to switch from mock data to live Google Places results.
3. Start the dev server:
   ```sh
   npm run dev
   ```
4. Visit `http://localhost:3000` and start rolling.

> **Note:** `npm run lint` is currently unavailable because the latest Next.js CLI no longer exposes the legacy `next lint` command. Use another TypeScript/ESLint runner (VS Code, `eslint .`, etc.) if you need static analysis.

## Backend API

- `GET /api/places`: existing search endpoint with support for cuisine, price, open-now, radius, and location filters.
- `GET /api/places?random=true`: returns a single random place. When a `userId` query param is included the selection is automatically recorded in the SQLite history.
- `GET /api/rolls?userId=demo-user&limit=50`: returns the most recent rolls for the supplied user.
- `POST /api/rolls`: manually persist a roll (body must include `userId`, `place`, and optional `filters`).

All API routes run in the Node.js runtime so they can safely access the local SQLite database.

## SQLite Roll History

- Database file lives at `data/roulette.db`; delete it anytime to wipe history.
- Schema (`rolls` table) captures the user id, place snapshot, coordinates, and the filters that produced the roll (`cuisine`, `price`, `openNow`, `radiusMeters`).
- Storage is powered by [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) for zero-config, synchronous access inside API routes.

## Frontend Integration

- `useRoulette` now passes the current user id (see `src/config/user.ts`) when requesting a random place so each roll is automatically persisted.
- `PastRollsView` fetches real history through `src/api/rolls.ts`, surfaces loading/error states, and provides a refresh action inside the profile modal.

## Lightweight Authentication

- Each browser session generates a UUID (see `src/lib/userId.ts`) that is stored in `localStorage` under `food-roulette-user-id` and reused for every request.
- The helper hook `useUserId` exposes the persisted value to React components. When absent, it lazily creates and stores a new UUID.
- All API calls that mutate or retrieve roll history include this UUID via the `userId` query parameter or request body; the backend treats it as the user identifier when reading/writing SQLite rows.
- Selecting **Reset Account** in the profile drawer clears the old UUID, generates a new one, and immediately closes the modal so future rolls build a fresh history.

## Verifying the Flow

1. Start the dev server and open the app.
2. Hit **Roll** (and optionally reroll) a few times.
3. Open the Profile drawer → **Past Rolls** to see the saved entries.
4. Optional: query the API directly via `curl http://localhost:3000/api/rolls?userId=demo-user` to inspect the JSON payload.
