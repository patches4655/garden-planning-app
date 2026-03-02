from pathlib import Path

DATA_DIR = Path(__file__).parent.parent.parent / "data"


def load_seeds() -> dict[str, list[str]]:
    """Parse seeds.txt into category dict."""
    seeds = {"fruits": [], "veggies": [], "herbs": [], "flowers": []}
    current_category = None

    category_map = {
        "fruits": "fruits",
        "veggies": "veggies",
        "herbs": "herbs",
        "flowers": "flowers"
    }

    with open(DATA_DIR / "seeds.txt") as f:
        for line in f:
            line = line.strip()
            if line.startswith("== "):
                cat_name = line.strip("= ").strip().lower()
                current_category = category_map.get(cat_name)
            elif line and current_category:
                seeds[current_category].append(line)

    return seeds


def load_plant_care() -> str:
    """Load plant care data as raw text for Claude context."""
    with open(DATA_DIR / "plant-care.txt") as f:
        return f.read()


def load_containers() -> str:
    """Load container data as raw text for Claude context."""
    with open(DATA_DIR / "boxes.txt") as f:
        return f.read()


def get_plant_context() -> str:
    """Combine all plant data for Claude prompt."""
    plant_care = load_plant_care()
    containers = load_containers()

    return f"""## Plant Care Requirements
{plant_care}

## Available Container Types
{containers}"""
