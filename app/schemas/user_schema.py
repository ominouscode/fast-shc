from typing import Optional
from pydantic import BaseModel


class UserBase(BaseModel):
    username: Optional[str] = None
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    username: str
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDB(UserBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class User(UserInDB):
    pass
