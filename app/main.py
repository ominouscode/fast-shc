from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from db.database import Base, engine
from api.api import api_router

app = FastAPI()
app.include_router(api_router)
app.mount("/", StaticFiles(directory="front/public", html=True), name="frontend")
app.mount("/build", StaticFiles(directory="front/public/build"), name="build")

Base.metadata.create_all(bind=engine)
