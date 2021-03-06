from pathlib import Path
from pydantic import BaseSettings
import secrets

class Settings(BaseSettings):
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 7 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    BASE_DIR = Path(__file__).resolve().parents[1]
    SQLALCHEMY_DATABASE_URL: str = "sqlite:///./test.db"

    USERS_OPEN_REGISTRATION: bool = True

    class Config:
        case_sensitive = True

settings = Settings()