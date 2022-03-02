from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from api import deps
from crud import device_crud
from schemas import device_schema, user_schema

router = APIRouter()

@router.get("/devices", response_model=list[device_schema.Device])
def get_device_list(
   skip: int = 0, 
   limit: int = 100,
   current_user: user_schema.User = Depends(deps.get_current_active_user),
   db: Session = Depends(deps.get_db)
   ):

   return device_crud.get_device_list(db, skip=skip, limit=limit)


@router.post("/devices", response_model=device_schema.Device)
def add_device(
   device: device_schema.DeviceCreate,
   current_user: user_schema.User = Depends(deps.get_current_active_user),
   db: Session = Depends(deps.get_db),
   ):

   return device_crud.add_device(db, device)


@router.put("/devices")
def update_device(
   device: device_schema.Device, 
   current_user: user_schema.User = Depends(deps.get_current_active_user),
   db: Session = Depends(deps.get_db)
   ):

   return device_crud.update_device(db, device)


@router.delete("/devices")
def remove_device(
   device: device_schema.Device, 
   current_user: user_schema.User = Depends(deps.get_current_active_user),
   db: Session = Depends(deps.get_db)
   ):
   
   return device_crud.remove_device(db, device)
