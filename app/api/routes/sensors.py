from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from api import deps
from crud import device_crud
from gpio import gpio
from schemas import device_schema, user_schema

router = APIRouter()

@router.get("/sensors", response_model=list[device_schema.Device])
def get_sensor_list(
   skip: int = 0, 
   limit: int = 100,
   current_user: user_schema.User = Depends(deps.get_current_active_user),
   db: Session = Depends(deps.get_db)
   ):

   return device_crud.get_device_list(db, skip=skip, limit=limit)


@router.get("/sensors/test")
async def sensor_test():

   return await gpio.read_sensor_data(18, "DHT22")