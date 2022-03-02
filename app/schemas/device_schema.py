from pydantic import BaseModel, Field
from enum import Enum


class DeviceCategories(str, Enum):
   light = "light"
   fan = "fan"
   inline_fan = "inline fan"
   humidifier = "humidifier"
   dehumidifier = "dehumidifier"
   aircon = "air conditioner"


class Device(BaseModel):
   id: int
   name: str = Field(..., max_length=50)
   category: DeviceCategories
   socket: int = -1
   active: bool = False

   class Config:
        orm_mode = True

class DeviceCreate(BaseModel):
   name: str = Field(..., max_length=50)
   category: DeviceCategories
   socket: int = -1
   active: bool = False