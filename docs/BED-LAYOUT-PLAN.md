# Plant Quantities & Bed Organization

## Context
Plants are currently shown 1-per-type in the SVG with no quantity info. We want the AI to calculate how many of each plant fit based on spacing requirements and bed dimensions, and the SVG to arrange flowers on the perimeter of each bed with other plants in the interior.

## Approach
Have Claude calculate quantities based on the spacing data it already receives. The frontend then sorts plants (flowers to perimeter cells, others to interior) and shows quantity badges on each icon.

## Changes

### 1. Add `quantity` field to PlantInGroup

**`backend/app/models/responses.py`** — Add `quantity: int` to PlantInGroup:
```python
class PlantInGroup(BaseModel):
    name: str
    category: Literal["fruits", "veggies", "herbs", "flowers"]
    quantity: int
```

**`frontend/src/lib/types/index.ts`** — Mirror the change:
```typescript
export interface PlantInGroup {
    name: string;
    category: Category;
    quantity: number;
}
```

### 2. Update Claude prompt to return quantities

**`backend/app/services/claude_service.py`** — Two changes:

1. Update the JSON example to include `quantity`:
```json
"plants": [
    {"name": "Plant 1", "category": "veggies", "quantity": 4}
]
```

2. Add rule: "For each plant, calculate `quantity` — the number of individual plants that fit in the bed based on the plant's spacing requirements from the plant care data and the bed's dimensions. Use the spacing column to determine how many fit."

### 3. Expand plants list by quantity for SVG rendering

**`frontend/src/lib/components/GardenLayoutSVG.svelte`** — Before computing the bed layout, expand each plant entry by its quantity so we get the right grid size. For example, `{name: "Marigold", quantity: 4}` becomes 4 entries in the render list.

Add a helper:
```typescript
function expandPlants(plants: PlantInGroup[]): PlantInGroup[] {
    return plants.flatMap(p => Array.from({ length: p.quantity || 1 }, () => p));
}
```

Use this expanded list for grid calculations and rendering. Sort before expanding: flowers first (they'll fill perimeter cells), then other categories.

### 4. Perimeter-first layout in SVG

**`frontend/src/lib/components/GardenLayoutSVG.svelte`** — Change the plant ordering so perimeter cells get flowers:

Add a function that generates cell positions in perimeter-first order:
```typescript
function perimeterFirstCells(cols: number, rows: number): {col: number, row: number}[] {
    // First: all edge cells (top row, bottom row, left col, right col)
    // Then: interior cells
}
```

Sort expanded plants: flowers first, then herbs, then veggies/fruits. Map them to perimeterFirstCells positions. This naturally places flowers on the bed borders.

### 5. Show quantity in Bed Details cards

**`frontend/src/lib/components/PlantGroup.svelte`** — Update the plant tag to show quantity:
```svelte
<span class="plant-tag" style="background: {categoryColors[plant.category]}">
    {plant.name} ×{plant.quantity}
</span>
```

### 6. Show quantity badge on SVG icons

Since plants are expanded (one icon per individual plant), no badge needed on icons. The visual count in the bed IS the quantity. Show all individual pixel art icons — the bed will visually show the right number of each plant.

## Files to modify
1. `backend/app/models/responses.py` — add `quantity: int`
2. `frontend/src/lib/types/index.ts` — add `quantity: number`
3. `backend/app/services/claude_service.py` — prompt changes for quantity
4. `frontend/src/lib/components/GardenLayoutSVG.svelte` — expand plants, perimeter layout
5. `frontend/src/lib/components/PlantGroup.svelte` — show "×N" on tags

## Not changing
- pixelArt.ts — icons stay the same, just rendered more times
- Individual containers (barrels/pots) — 1 plant per container, no perimeter logic needed
- Backend plant_data.py — Claude already receives plant-care.txt

## Verification
1. Generate a new plan → each plant should have a quantity > 0
2. SVG should show multiple icons per plant type filling the bed
3. Flowers should appear around the edges of each bed
4. Bed Details cards should show "Marigold ×4" style labels
5. Saved/loaded plans should still work (quantity field defaults to 1 if missing)
