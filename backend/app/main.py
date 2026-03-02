from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import seeds, garden

settings = get_settings()

app = FastAPI(
    title="Garden Companion Planting API",
    description="AI-powered companion planting recommendations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(seeds.router, prefix=settings.api_prefix)
app.include_router(garden.router, prefix=settings.api_prefix)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
