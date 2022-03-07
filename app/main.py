from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from api.api import api_router
from core.config import settings
from db.database import Base, engine


app = FastAPI()
app.include_router(api_router)
app.mount("/", StaticFiles(directory=Path(settings.BASE_DIR, "front/public"), html=True), name="frontend")
app.mount("/build", StaticFiles(directory=Path(settings.BASE_DIR, "front/public/build")), name="build")

Base.metadata.create_all(bind=engine)
