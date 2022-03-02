from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

from api import deps
from core.config import settings
from crud import user_crud
from schemas import user_schema

router = APIRouter()


@router.get("/users/me", response_model=user_schema.User)
def get_current_user(
    current_user: user_schema.User = Depends(deps.get_current_active_user)
    ):

   return current_user


@router.post("/users/create", response_model=user_schema.User)
def create_user_open(
    username: str = Body(...), 
    password: str = Body(...),
    db: Session = Depends(deps.get_db), 
    ):
    
    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=403,
            detail="Open user registration is forbidden on this server",
        )
    user = user_crud.get_by_username(db, username=username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )
    user_in = user_schema.UserCreate(password=password, username=username)
    user = user_crud.create_user(db, user=user_in)
    return user