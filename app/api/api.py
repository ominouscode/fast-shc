from fastapi import APIRouter

from api.routes import auth, devices, users

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(devices.router, tags=["devices"])
api_router.include_router(users.router, tags=["users"])