# Backend Implementation Plan (Python/FastAPI)

## Overview

Build a FastAPI backend that serves seed data and generates AI-powered companion planting recommendations using the Anthropic Claude API.

## Project Setup

Create virtual environment and install: fastapi, uvicorn, anthropic, python-dotenv, pydantic, pydantic-settings

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Settings and environment variables
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── seeds.py             # GET /api/seeds
│   │   └── garden.py            # POST /api/garden/plan
│   ├── services/
│   │   ├── __init__.py
│   │   ├── plant_data.py        # Load and parse data files
│   │   └── claude_service.py    # Anthropic API integration
│   └── models/
│       ├── __init__.py
│       ├── requests.py          # Request body models
│       └── responses.py         # Response models
├── data/
│   ├── seeds.txt                # Copy from parent folder
│   ├── plant-care.txt
│   └── boxes.txt
├── tests/
│   ├── __init__.py
│   ├── test_seeds.py
│   └── test_garden.py
├── .env                         # ANTHROPIC_API_KEY (git ignored)
├── .env.example                 # Template for .env
└── requirements.txt
```

## Implementation Steps

### Step 1: Configuration

**config.py**
- Use pydantic-settings for environment variable loading
- Settings: anthropic_api_key, api_prefix, cors_origins
- Cached settings getter function

### Step 2: Pydantic Models

**requests.py**
- GardenPreferences: yard_width (ft), yard_depth (ft), sun_exposure, bed_types (list of allowed types)
- GardenPlanRequest: selected_seeds (list of strings), preferences (GardenPreferences)

**responses.py**
- SeedsByCategory: fruits, veggies, herbs, flowers (lists)
- Container: type, size, depth
- PlantInGroup: name, category (Literal["fruits", "veggies", "herbs", "flowers"])
- PlantGroup: name, plants (list of PlantInGroup), container, reason, placement
- BloomSchedule: spring, summer, fall (lists)
- GardenPlanResponse: plant_groups, aesthetic_tips, bloom_schedule

### Step 3: Plant Data Service

**plant_data.py**
- load_seeds(): Parse seeds.txt into category dict
- load_plant_care(): Load plant care data as raw text
- load_containers(): Load container data as raw text
- get_plant_context(): Combine all data for Claude prompt

### Step 4: Claude Service

**claude_service.py**
- System prompt defining Claude as expert gardener
- User prompt template with plant context and selected seeds
- Request structured JSON response
- Parse and validate response into GardenPlanResponse
- Handle markdown code blocks in response

### Step 5: API Routers

**seeds.py**
- GET /api/seeds
- Returns SeedsByCategory from plant_data.load_seeds()

**garden.py**
- POST /api/garden/plan
- Validates request (non-empty, max 20 seeds)
- Calls claude_service.generate_garden_plan()
- Returns GardenPlanResponse
- Error handling for API failures

### Step 6: Main Application

**main.py**
- Create FastAPI app with title and description
- Add CORS middleware for frontend origin
- Include routers with /api prefix
- Health check endpoint

## API Endpoints

### GET /api/seeds
Returns all available seeds grouped by category.

Response shape:
- fruits: list of seed names
- veggies: list of seed names
- herbs: list of seed names
- flowers: list of seed names

### POST /api/garden/plan
Takes selected seeds and garden preferences, returns AI recommendations.

Request body:
- selected_seeds: list of seed names
- preferences: garden preferences (yard_width, yard_depth, sun_exposure, bed_types)

Response shape:
- plant_groups: list of companion groupings with containers (plants include name + category)
- aesthetic_tips: list of arrangement suggestions
- bloom_schedule: plants organized by bloom season

## Claude Prompt Strategy

System prompt establishes Claude as expert gardener focusing on:
- Companion planting benefits
- Plants to avoid grouping
- Similar care requirements
- Container sizing
- Aesthetic arrangement
- Bloom timing
- Mixing flowers as companions into all beds (never isolate flowers)

User prompt includes:
- Full plant care data
- Container options data
- User's selected seeds
- User's garden preferences (yard size, sun exposure, allowed bed types)
- Requested JSON structure with plants as objects (name + category)
- Rules: exactly 2-4 plant groups, flowers mixed with everything, only user-allowed bed types

## Running the Server

Development: uvicorn app.main:app --reload --port 8000
Production: uvicorn app.main:app --host 0.0.0.0 --port 8000

API docs available at /docs (Swagger) and /redoc

## Testing

- test_seeds.py: Test GET /api/seeds returns expected structure
- test_garden.py: Test validation (empty seeds, too many seeds)

Run with: pytest tests/ -v

## Error Handling

- 400: Invalid request (empty seeds, too many seeds)
- 500: Claude API error or parsing error
- All errors return JSON with detail field

## Data Files

Copy or symlink seeds.txt, plant-care.txt, boxes.txt from parent gardening-app folder to backend/data/
