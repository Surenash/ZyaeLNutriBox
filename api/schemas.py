from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

def to_camel(string: str) -> str:
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

class OrderCreate(BaseModel):
    client_name: str
    client_email: str
    client_phone: str
    client_address: str
    diet_plan: str
    meal_type: str
    price: float

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    kitchen_status: Optional[str] = None
    delivery_agent_id: Optional[str] = None
    delivery_agent_name: Optional[str] = None
    picked_up_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

class OrderResponse(BaseModel):
    id: str
    client_name: str
    client_email: str
    client_phone: str
    client_address: str
    diet_plan: str
    meal_type: str
    price: float
    status: str
    kitchen_status: str
    delivery_agent_id: Optional[str] = None
    delivery_agent_name: Optional[str] = None
    ordered_at: datetime
    picked_up_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

class KitchenQueueCreate(BaseModel):
    order_id: str
    meal_name: str
    meal_type: str
    diet_plan: str
    special_instructions: Optional[str] = None
    prep_time_minutes: Optional[int] = None

class KitchenQueueUpdate(BaseModel):
    status: Optional[str] = None
    chef_assigned: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class KitchenQueueResponse(BaseModel):
    id: str
    order_id: str
    meal_name: str
    meal_type: str
    diet_plan: str
    special_instructions: Optional[str] = None
    status: str
    chef_assigned: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

class DeliveryAgentCreate(BaseModel):
    name: str
    phone: str
    vehicle_type: str
    vehicle_number: Optional[str] = None

class DeliveryAgentUpdate(BaseModel):
    current_latitude: Optional[str] = None
    current_longitude: Optional[str] = None
    is_available: Optional[bool] = None
    total_deliveries: Optional[int] = None
    rating: Optional[float] = None

class DeliveryAgentResponse(BaseModel):
    id: str
    name: str
    phone: str
    vehicle_type: str
    vehicle_number: Optional[str] = None
    current_latitude: Optional[str] = None
    current_longitude: Optional[str] = None
    is_available: bool
    total_deliveries: int
    rating: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

class DeliveryTrackingCreate(BaseModel):
    order_id: str
    delivery_agent_id: str
    current_latitude: str
    current_longitude: str
    destination_latitude: str
    destination_longitude: str
    status: str = "en_route"
    estimated_time: Optional[str] = None
    distance_km: Optional[float] = None

class DeliveryTrackingUpdate(BaseModel):
    current_latitude: Optional[str] = None
    current_longitude: Optional[str] = None
    status: Optional[str] = None
    estimated_time: Optional[str] = None
    distance_km: Optional[float] = None

class DeliveryTrackingResponse(BaseModel):
    id: str
    order_id: str
    delivery_agent_id: str
    current_latitude: str
    current_longitude: str
    destination_latitude: str
    destination_longitude: str
    status: str
    estimated_time: Optional[str] = None
    distance_km: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)
