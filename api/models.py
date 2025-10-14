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
