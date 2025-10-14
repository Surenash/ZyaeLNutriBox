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

# Meal Plan Schemas
class MealPlanCreate(BaseModel):
    title: str
    description: str
    category: str
    original_price: float
    current_price: float
    rating: Optional[float] = 4.5
    review_count: Optional[int] = 0
    badge: Optional[str] = None
    image_url: Optional[str] = None
    features: Optional[str] = None
    is_active: Optional[bool] = True

class MealPlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    original_price: Optional[float] = None
    current_price: Optional[float] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    badge: Optional[str] = None
    image_url: Optional[str] = None
    features: Optional[str] = None
    is_active: Optional[bool] = None

class MealPlanResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    original_price: float
    current_price: float
    rating: float
    review_count: int
    badge: Optional[str] = None
    image_url: Optional[str] = None
    features: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

# Subscription Schemas
class SubscriptionCreate(BaseModel):
    user_id: str
    meal_plan_id: str
    end_date: Optional[datetime] = None
    price_paid: float
    payment_method: Optional[str] = None

class SubscriptionUpdate(BaseModel):
    status: Optional[str] = None
    end_date: Optional[datetime] = None

class SubscriptionResponse(BaseModel):
    id: str
    user_id: str
    meal_plan_id: str
    start_date: datetime
    end_date: Optional[datetime] = None
    status: str
    price_paid: float
    payment_method: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

# Nutritionist Schemas
class NutritionistCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    experience_years: Optional[int] = 0

class NutritionistUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None
    total_clients: Optional[int] = None
    is_available: Optional[bool] = None

class NutritionistResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    rating: float
    experience_years: int
    total_clients: int
    is_available: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

# Client Schemas
class ClientCreate(BaseModel):
    user_id: str
    nutritionist_id: Optional[str] = None
    weight_start: Optional[float] = None
    weight_current: Optional[float] = None
    weight_goal: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    health_conditions: Optional[str] = None
    dietary_preferences: Optional[str] = None

class ClientUpdate(BaseModel):
    nutritionist_id: Optional[str] = None
    weight_current: Optional[float] = None
    weight_goal: Optional[float] = None
    health_conditions: Optional[str] = None
    dietary_preferences: Optional[str] = None

class ClientResponse(BaseModel):
    id: str
    user_id: str
    nutritionist_id: Optional[str] = None
    weight_start: Optional[float] = None
    weight_current: Optional[float] = None
    weight_goal: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    health_conditions: Optional[str] = None
    dietary_preferences: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

# Session Schemas
class SessionCreate(BaseModel):
    client_id: str
    nutritionist_id: str
    session_date: datetime
    duration_minutes: Optional[int] = 30
    notes: Optional[str] = None
    meeting_link: Optional[str] = None

class SessionUpdate(BaseModel):
    session_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    completed_at: Optional[datetime] = None

class SessionResponse(BaseModel):
    id: str
    client_id: str
    nutritionist_id: str
    session_date: datetime
    duration_minutes: int
    notes: Optional[str] = None
    status: str
    meeting_link: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

# Progress Log Schemas
class ProgressLogCreate(BaseModel):
    client_id: str
    weight: Optional[float] = None
    calories_consumed: Optional[int] = None
    protein_intake: Optional[float] = None
    water_intake_liters: Optional[float] = None
    meal_completion_percent: Optional[int] = None
    notes: Optional[str] = None

class ProgressLogUpdate(BaseModel):
    weight: Optional[float] = None
    calories_consumed: Optional[int] = None
    protein_intake: Optional[float] = None
    water_intake_liters: Optional[float] = None
    meal_completion_percent: Optional[int] = None
    notes: Optional[str] = None

class ProgressLogResponse(BaseModel):
    id: str
    client_id: str
    log_date: datetime
    weight: Optional[float] = None
    calories_consumed: Optional[int] = None
    protein_intake: Optional[float] = None
    water_intake_liters: Optional[float] = None
    meal_completion_percent: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)
