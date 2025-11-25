# Food Roulette - Next.js Full-Stack Setup

## Overview

The Food Roulette application is now a **full-stack Next.js application** with integrated backend API routes. No separate server needed!

## Architecture

```
FinalProject/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend API routes
│   │   ├── health/
│   │   │   └── route.ts         # Health check endpoint
│   │   └── places/
│   │       ├── route.ts         # GET /api/places
│   │       ├── cuisines/
│   │       │   └── route.ts     # GET /api/places/cuisines  
│   │       └── [id]/
│   │           └── route.ts     # GET /api/places/:id
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main app page (client component)
│
├── src/
│   ├── app/                     # Legacy src/app (can be moved)
│   │   ├── page.tsx            # Main page component
│   │   └── layout.tsx
│   ├── components/              # React components
│   ├── hooks/                   # Custom hooks
│   └── api/                     # API client (no longer used from src)
│
├── api/                         # API client functions
│   └── places.ts                # Fetch functions for API
│
├── data/                        # Data layer
│   └── mockData.ts             # Mock places data
│
├── types/                       # TypeScript types
│   └── index.ts
│
└── package.json                # Dependencies & scripts
```

## How It Works

### Backend (Next.js API Routes)

API routes are defined in the `app/api` directory using Next.js Route Handlers:

- **app/api/places/route.ts** - Returns all places with optional filtering
- **app/api/places/cuisines/route.ts** - Returns available cuisines
- **app/api/places/[id]/route.ts** - Returns a single place by ID
- **app/api/health/route.ts** - Health check endpoint

Each route exports functions like `GET`, `POST`, etc. that handle HTTP requests.

### Frontend (React Client Components)

The main app is in `src/app/page.tsx` (marked with `'use client'`):

1. **Fetches data** from `/api/places` and `/api/places/cuisines` on mount
2. **Displays loading state** while fetching
3. **Shows error state** if API fails
4. **Renders the app** once data is loaded

### API Client

The `api/places.ts` file provides typed functions to call the API:

```typescript
import { api } from '@/api/places';

// Get all places
const places = await api.getPlaces();

// Get places with filters
const filtered = await api.getPlaces({ 
  cuisine: ['Japanese'], 
  price: [2, 3],
  openNow: true 
});

// Get cuisines
const cuisines = await api.getCuisines();

// Get single place
const place = await api.getPlaceById(1);
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Starts Next.js on http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Other Commands

```bash
npm run lint    # Run ESLint
```

## API Endpoints

All endpoints return JSON in this format:

```typescript
{
  success: boolean;
  data?: T;           // Response data
  count?: number;     // Number of items (for lists)
  message?: string;   // Error message
  error?: string;     // Error details
}
```

### GET /api/places

Get all places with optional filters.

**Query Parameters:**
- `cuisine` (string|array) - Filter by cuisine type(s)
- `price` (number|array) - Filter by price level(s) 1-3
- `openNow` (boolean) - Filter by open status
- `radius` (number) - Search radius (future use)
- `lat`, `lng` (number) - Coordinates (future use)

**Example:**
```
GET /api/places?cuisine=Japanese&price=2&price=3&openNow=true
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 2,
      "name": "Sakura Sushi",
      "cuisine": "Japanese",
      "price": 3,
      "rating": 4.8,
      "open": true,
      "lat": 40.7138,
      "lng": -74.007,
      "image": "https://...",
      "reviews": 850,
      "address": "456 Blossom Way"
    }
  ]
}
```

### GET /api/places/cuisines

Get available cuisine types.

**Response:**
```json
{
  "success": true,
  "data": [
    { "label": "Any", "icon": "🍽️" },
    { "label": "Burgers", "icon": "🍔" },
    { "label": "Japanese", "icon": "🍣" },
    ...
  ]
}
```

### GET /api/places/:id

Get a single place by ID.

**Example:**
```
GET /api/places/2
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Sakura Sushi",
    ...
  }
}
```

### GET /api/health

Server health check.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Data Flow

```
┌─────────────┐
│   Browser   │
│  (page.tsx) │
└──────┬──────┘
       │
       │ fetch('/api/places')
       ▼
┌─────────────────┐
│  API Client     │
│  (api/places.ts)│
└────────┬────────┘
         │
         │ HTTP Request
         ▼
┌────────────────────┐
│  Next.js API Route │
│  (app/api/...)     │
└────────┬───────────┘
         │
         │ Import
         ▼
┌────────────────┐
│   Mock Data    │
│ (data/mockData)│
└────────────────┘
```

## Key Features

✅ **Single Deployment** - One Next.js app, no separate backend server
✅ **API Routes** - Backend endpoints built into Next.js
✅ **Type Safety** - TypeScript throughout
✅ **Server Components** - Fast initial page loads
✅ **Client Components** - Interactive UI with React hooks
✅ **Loading States** - Proper UX during data fetching
✅ **Error Handling** - Graceful error messages
✅ **Path Aliases** - Clean imports with `@/`

## Next Steps: Google Places Integration

To integrate Google Places API:

### 1. Get API Key

Go to Google Cloud Console and get a Places API key.

### 2. Add Environment Variable

Create `.env.local`:

```env
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### 3. Update API Routes

Modify `app/api/places/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  
  // Call Google Places API
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&key=${process.env.GOOGLE_PLACES_API_KEY}`
  );
  
  const data = await response.json();
  
  // Transform Google's response to our format
  const places = data.results.map(place => ({
    id: place.place_id,
    name: place.name,
    rating: place.rating,
    // ... map other fields
  }));
  
  return NextResponse.json({
    success: true,
    count: places.length,
    data: places
  });
}
```

### 4. No Frontend Changes Needed!

The frontend already uses the API client and will automatically work with real data once the backend routes are updated.

## Benefits of Next.js Full-Stack

1. **Simpler Deployment** - Deploy one app instead of two
2. **Type Sharing** - Frontend and backend share TypeScript types
3. **API Co-location** - API routes next to the pages that use them
4. **Server Actions** - Can use React Server Actions for mutations
5. **Caching** - Built-in caching and revalidation
6. **Environment Variables** - Secure API keys on server-side only
7. **Development** - Single dev server, faster DX

## Deployment

Deploy to Vercel (recommended for Next.js):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or deploy to any Node.js hosting:

```bash
npm run build
npm start
```

## Troubleshooting

### Port Already in Use

Next.js runs on port 3000 by default. To change:

```bash
PORT=3001 npm run dev
```

### Module Not Found Errors

Make sure path aliases work:
- Check `tsconfig.json` has `"@/*": ["./src/*"]`
- Restart the dev server after tsconfig changes

### API Route Not Found

API routes must be in `app/api` directory (not `src/app/api`).

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
npm run dev
```
