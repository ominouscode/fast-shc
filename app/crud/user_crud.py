from typing import Optional

from sqlalchemy.orm import Session

from core import security
from models import user_model
from schemas import user_schema


def get_users(
    db: Session, 
    skip: int = 0, 
    limit: int = 100
    ) -> list[user_schema.User]:

    return db.query(user_model.User).offset(skip).limit(limit).all()


def get_by_id(
    db: Session, 
    user_id: int
    ) -> user_schema.User:

    return db.query(user_model.User).filter(user_model.User.id == user_id).first()


def get_by_username(
    db: Session, 
    username: str
    ) -> user_schema.User:
    
    return db.query(user_model.User).filter(user_model.User.username == username).first()


def create_user(
    db: Session, 
    user: user_schema.UserCreate
    ) -> user_schema.User:

    user.password = security.get_password_hash(user.password)
    db_user = user_model.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate(
    db: Session, 
    username: str, 
    password: str
    ) -> Optional[user_schema.User]:

    user = get_by_username(db, username)
    if not user:
        return None
    if not security.verify_password(password, user.password):
        return None
    return user


def is_active(user: user_schema.User) -> bool:
    return user.is_active