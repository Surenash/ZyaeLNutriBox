from sqlalchemy import Column, String, Float, Integer, DateTime, Text, Boolean
from sqlalchemy.sql import func
from api.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    role = Column(String, default="client")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=False)
    client_phone = Column(String, nullable=False)
    client_address = Column(Text, nullable=False)
    diet_plan = Column(String, nullable=False)
    meal_type = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(String, default="pending")
    kitchen_status = Column(String, default="pending")
    delivery_agent_id = Column(String)
    delivery_agent_name = Column(String)
    ordered_at = Column(DateTime(timezone=True), server_default=func.now())
    picked_up_at = Column(DateTime(timezone=True))
    delivered_at = Column(DateTime(timezone=True))

class KitchenQueue(Base):
    __tablename__ = "kitchen_queue"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, nullable=False)
    meal_name = Column(String, nullable=False)
    meal_type = Column(String, nullable=False)
    diet_plan = Column(String, nullable=False)
    special_instructions = Column(Text)
    status = Column(String, default="pending")
    chef_assigned = Column(String)
    prep_time_minutes = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))

class DeliveryAgent(Base):
    __tablename__ = "delivery_agents"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    vehicle_type = Column(String, nullable=False)
    vehicle_number = Column(String)
    current_latitude = Column(String)
    current_longitude = Column(String)
    is_available = Column(Boolean, default=True)
    total_deliveries = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DeliveryTracking(Base):
    __tablename__ = "delivery_tracking"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, nullable=False)
    delivery_agent_id = Column(String, nullable=False)
    current_latitude = Column(String, nullable=False)
    current_longitude = Column(String, nullable=False)
    destination_latitude = Column(String, nullable=False)
    destination_longitude = Column(String, nullable=False)
    status = Column(String, default="en_route")
    estimated_time = Column(String)
    distance_km = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MealPlan(Base):
    __tablename__ = "meal_plans"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    original_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=0)
    badge = Column(String)
    image_url = Column(String)
    features = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    meal_plan_id = Column(String, nullable=False)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True))
    status = Column(String, default="active")
    price_paid = Column(Float, nullable=False)
    payment_method = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Nutritionist(Base):
    __tablename__ = "nutritionists"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    specialization = Column(String)
    bio = Column(Text)
    image_url = Column(String)
    rating = Column(Float, default=0.0)
    experience_years = Column(Integer, default=0)
    total_clients = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    nutritionist_id = Column(String)
    weight_start = Column(Float)
    weight_current = Column(Float)
    weight_goal = Column(Float)
    height = Column(Float)
    age = Column(Integer)
    gender = Column(String)
    health_conditions = Column(Text)
    dietary_preferences = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    client_id = Column(String, nullable=False)
    nutritionist_id = Column(String, nullable=False)
    session_date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=30)
    notes = Column(Text)
    status = Column(String, default="scheduled")
    meeting_link = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class ProgressLog(Base):
    __tablename__ = "progress_logs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    client_id = Column(String, nullable=False)
    log_date = Column(DateTime(timezone=True), server_default=func.now())
    weight = Column(Float)
    calories_consumed = Column(Integer)
    protein_intake = Column(Float)
    water_intake_liters = Column(Float)
    meal_completion_percent = Column(Integer)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
