# Food Roulette - Project Structure

## Overview
A clean, modular React + TypeScript application for food discovery with a roulette-style selection interface.

## Directory Structure

```
src/
├── components/          # React components
│   ├── MapView.tsx             # Map display and controls
│   ├── CuisineFilter.tsx       # Cuisine selection UI
│   ├── PriceFilter.tsx         # Price range filter
│   ├── TimeFilter.tsx          # Open now toggle
│   ├── ProfileMenu.tsx         # User profile sidebar
│   ├── SlotMachineLoader.tsx   # Loading animation
│   ├── EmptyState.tsx          # No results screen
│   └── ResultView.tsx          # Restaurant result display
│
├── hooks/               # Custom React hooks
│   └── useRoulette.ts          # Main roulette logic & state
│
├── data/                # Data and constants
│   └── mockData.ts             # Mock restaurant data
│
├── types/               # TypeScript definitions
│   └── index.ts                # All type definitions
│
├── styles/              # Global styles
│   └── animations.css          # CSS animations
│
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global CSS imports

```

## Key Files

### `App.tsx`
Main component that orchestrates all views and manages high-level state.

### `hooks/useRoulette.ts`
Custom hook containing:
- Filter state management
- Place selection logic
- View state transitions

### `types/index.ts`
TypeScript interfaces for:
- Place (restaurant data)
- Cuisine
- Filters
- ViewState

### `components/`
Each component is focused on a single responsibility with clear props interfaces.

## State Management
- Local state with React hooks
- No external state management library
- Props drilling kept minimal with custom hooks

## Styling
- Tailwind CSS for utility-first styling
- Custom animations in `animations.css`
- Responsive mobile-first design

## Running the App

```bash
npm install
npm run dev
```

Visit http://localhost:5173/
