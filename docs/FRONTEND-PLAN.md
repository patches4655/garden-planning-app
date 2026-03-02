# Frontend Implementation Plan (Svelte/SvelteKit)

## Overview

Build a Svelte frontend that allows users to select seeds and view AI-generated companion planting recommendations.

## Project Setup

Use SvelteKit with TypeScript, ESLint, and Prettier.

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── SeedSelector.svelte      # Main seed selection grid
│   │   │   ├── SeedCard.svelte          # Individual seed card (selectable)
│   │   │   ├── CategorySection.svelte   # Group seeds by category
│   │   │   ├── PlantGroup.svelte        # Display companion plant group
│   │   │   ├── ContainerCard.svelte     # Container recommendation display
│   │   │   ├── GardenPlan.svelte        # Full AI recommendation view
│   │   │   ├── GardenLayoutSVG.svelte   # SVG top-down garden visual
│   │   │   ├── GardenPreferences.svelte # Garden setup form (yard size, bed types)
│   │   │   ├── SavedGardens.svelte      # List of saved garden plans
│   │   │   └── LoadingSpinner.svelte    # Loading state
│   │   ├── stores/
│   │   │   ├── seeds.ts                 # Available seeds from API
│   │   │   ├── selectedSeeds.ts         # User's selected seeds
│   │   │   ├── gardenPlan.ts            # AI-generated plan
│   │   │   ├── gardenPreferences.ts     # User's garden preferences
│   │   │   └── savedGardens.ts          # localStorage saved plans
│   │   ├── api/
│   │   │   └── client.ts                # API calls to backend
│   │   └── types/
│   │       └── index.ts                 # TypeScript interfaces
│   ├── routes/
│   │   ├── +page.svelte                 # Home: seed selection
│   │   ├── +layout.svelte               # App shell with header
│   │   └── plan/
│   │       └── +page.svelte             # Results: garden plan view
│   ├── app.css                          # Global styles
│   └── app.html                         # HTML template
├── static/
│   └── favicon.svg
├── package.json
├── svelte.config.js
├── vite.config.ts
└── tsconfig.json
```

## Implementation Steps

### Step 1: Types and API Client

Create TypeScript interfaces for:
- Seed (name, category)
- SeedsByCategory (fruits, veggies, herbs, flowers arrays)
- Container (type, size, depth)
- PlantInGroup (name, category)
- PlantGroup (name, plants as PlantInGroup[], container, reason, placement)
- GardenPlan (plant_groups, aesthetic_tips, bloom_schedule)
- GardenPreferences (yard_width, yard_depth, sun_exposure, bed_types)

Create API client with:
- fetchSeeds() - GET /api/seeds
- generatePlan(seeds, preferences) - POST /api/garden/plan

### Step 2: Stores

**seeds.ts**
- Store for available seeds from API
- Loading and error states

**selectedSeeds.ts**
- Set of user-selected seed names
- Derived store for count
- toggleSeed() and clearSelection() functions

**gardenPlan.ts**
- Store for AI-generated plan
- Loading and error states

**savedGardens.ts**
- Custom store synced with localStorage
- save(), delete(), and clear() methods
- Each saved garden has: id, name, createdAt, seeds, plan
- Backward compatibility: old saves with string[] plants mapped to PlantInGroup[]

**gardenPreferences.ts**
- Writable store for user's garden setup
- Defaults: 10ft x 10ft, full sun, wood + metal raised beds
- Used when calling generatePlan()

### Step 3: Components

**SeedCard.svelte**
- Props: name, category, selected
- Click toggles selection
- Visual feedback for selected state

**CategorySection.svelte**
- Props: category name, seeds array
- Renders SeedCard for each seed
- Collapsible header

**SeedSelector.svelte**
- Fetches seeds on mount
- Renders CategorySection for each category
- Shows selected count
- "Generate Plan" button

**PlantGroup.svelte**
- Props: PlantGroup data
- Shows plant names (color-coded by category), container info, reason
- Styled card layout

**GardenPreferences.svelte**
- Garden setup form shown alongside/above seed selection
- Fields: yard width, yard depth, sun exposure dropdown, bed type checkboxes
- Defaults: 10ft x 10ft, full sun, wood + metal raised beds
- Bound to gardenPreferences store

**GardenLayoutSVG.svelte**
- SVG top-down visual of the garden yard
- Shows 2-4 rectangular beds within the yard area
- Wood beds = warm brown border, metal beds = gray border
- Plants as colored circles inside beds (fruits=red, veggies=teal, herbs=purple, flowers=orange)
- Plant names labeled, tooltips on hover
- Color legend for categories
- Responsive scaling via viewBox

**GardenPlan.svelte**
- Props: GardenPlan data
- Renders GardenLayoutSVG at the top ("Your Garden Layout")
- Renders PlantGroup cards below ("Bed Details")
- Shows aesthetic tips
- Shows bloom schedule
- Save button

### Step 4: Pages

**+layout.svelte**
- App header with title
- Navigation (Home, Saved Gardens)
- Main content slot

**+page.svelte (Home)**
- SeedSelector component
- Navigate to /plan on generate

**plan/+page.svelte**
- Show loading while generating
- GardenPlan component with results
- "Start Over" button

### Step 5: Styling

**app.css**
- CSS variables for garden theme colors
- Green, brown, cream palette
- Clean card-based layout
- Responsive grid for seed cards
- Mobile-friendly design

## UI Flow

1. User lands on home page → sees garden preferences form + seed grid by category
2. User sets garden preferences (yard size, sun, bed types) → defaults pre-filled
3. User clicks seeds to select → cards highlight, count updates
4. User clicks "Generate Garden Plan" → show loading, send seeds + preferences to API
5. API returns results → display SVG garden layout at top, text details below
6. Flowers appear mixed into all beds as companions (never isolated)
7. User clicks "Save" → prompt for name, save to localStorage
8. User can view/delete saved gardens from sidebar

## Dependencies

- @sveltejs/kit
- svelte
- typescript
- vite

## Environment

Create `.env` for API URL (PUBLIC_API_URL)

## Testing

- Unit tests with Vitest for stores and utilities
- Component tests for SeedCard, PlantGroup
- E2E tests with Playwright for full user flow
