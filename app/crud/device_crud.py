from sqlalchemy.orm import Session

from models import device_model
from schemas import device_schema


def get_device_list(
    db: Session, 
    skip: int = 0, 
    limit: int = 100
    ) -> list[device_schema.Device]:

    return db.query(device_model.Device).offset(skip).limit(limit).all()


def add_device(
    db: Session, 
    item: device_schema.DeviceCreate
    ) -> device_schema.Device:

    db_device = device_model.Device(**item.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device


def update_device(
    db: Session, 
    item: device_schema.Device
    ) -> dict:

    result = db.query(device_model.Device).filter(device_model.Device.id==item.id).update(item.dict())
    db.commit()
    return {"Status": "Updated successfully", "DeviceId": item.id, "result": result}


def remove_device(
    db: Session, 
    item: device_schema.Device
    ) -> dict:
    
    result = db.query(device_model.Device).filter(device_model.Device.id==item.id).delete()
    db.commit()
    return {"Status": "Removed successfully", "DeviceId": item.id, "result": result}