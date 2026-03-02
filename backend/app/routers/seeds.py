from fastapi import APIRouter

from app.services.plant_data import load_seeds
from app.models.responses import SeedsByCategory

router = APIRouter(prefix="/seeds", tags=["seeds"])


@router.get("", response_model=SeedsByCategory)
async def get_seeds():
    """Return all available seeds grouped by category."""
    return load_seeds()
