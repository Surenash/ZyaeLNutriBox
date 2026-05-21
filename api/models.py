from sqlalchemy import Column, String, Float, Integer, DateTime, Text, Boolean, JSON
from sqlalchemy.sql import func
from api.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Address(Base):
    __tablename__ = "addresses"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    client_id = Column(String, nullable=False)
    label = Column(String, nullable=False)
    address_type = Column(String)
    line1 = Column(String, nullable=False)
    line2 = Column(String)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    country = Column(String, nullable=False, default="India")
    latitude = Column(String)
    longitude = Column(String)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    special_instructions = Column(Text)
    contact_name = Column(String)
    contact_phone = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Area(Base):
    __tablename__ = "areas"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    code = Column(String, unique=True)
    description = Column(Text)
    delivery_radius_km = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String)
    user_role = Column(String)
    action = Column(String, nullable=False)
    target_type = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    before_state = Column(Text)
    after_state = Column(Text)
    changed_fields = Column(Text)
    ip_address = Column(String)
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class BatchMeal(Base):
    __tablename__ = "batch_meals"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    batch_id = Column(String, nullable=False)
    order_id = Column(String, nullable=False)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Batch(Base):
    __tablename__ = "batches"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    area_id = Column(String, nullable=False)
    meal_type = Column(String, nullable=False)
    timeslot_start = Column(DateTime(timezone=True))
    timeslot_end = Column(DateTime(timezone=True))
    status = Column(String)
    delivery_agent_id = Column(String)
    total_orders = Column(Integer, default=0)
    packed_count = Column(Integer, default=0)
    ready_count = Column(Integer, default=0)
    picked_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BlacklistedToken(Base):
    __tablename__ = "blacklisted_tokens"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    token = Column(Text, nullable=False)
    token_hash = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    blacklisted_at = Column(DateTime(timezone=True), server_default=func.now())
    reason = Column(String)

class CheckoutData(Base):
    __tablename__ = "checkout_data"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    subscription_id = Column(String)
    meal_plan_id = Column(String, nullable=False)
    plan_category = Column(String, nullable=False)
    health_inputs = Column(Text)
    meal_timing = Column(Text)
    consultation_preference = Column(Boolean)
    consultation_date = Column(DateTime(timezone=True))
    consultation_time_slot = Column(String)
    consultation_mode = Column(String)
    delivery_addresses = Column(Text)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

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

class Consultation(Base):
    __tablename__ = "consultations"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    nutritionist_id = Column(String, nullable=False)
    client_id = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    time_slot = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=30)
    status = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DailyMealSchedule(Base):
    __tablename__ = "daily_meal_schedules"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    subscription_id = Column(String, nullable=False)
    client_id = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    breakfast_item = Column(String)
    breakfast_calories = Column(Integer)
    breakfast_status = Column(String)
    lunch_item = Column(String)
    lunch_calories = Column(Integer)
    lunch_status = Column(String)
    dinner_item = Column(String)
    dinner_calories = Column(Integer)
    dinner_status = Column(String)
    notes = Column(Text)
    created_by_nutritionist_id = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

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
    is_online = Column(Boolean, default=True)
    areas_served = Column(Text)
    current_batch_id = Column(String)
    total_deliveries = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DeliveryTracking(Base):
    __tablename__ = "delivery_tracking"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, nullable=False)
    delivery_agent_id = Column(String, nullable=False)
    latitude = Column(String, nullable=False)
    longitude = Column(String, nullable=False)
    destination_latitude = Column(String)
    destination_longitude = Column(String)
    status = Column(String, default="en_route")
    estimated_delivery_time = Column(DateTime(timezone=True))
    actual_delivery_time = Column(DateTime(timezone=True))
    route_data = Column(Text)
    distance_km = Column(Float)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DeviceToken(Base):
    __tablename__ = "device_tokens"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    device_id = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    token = Column(String(512), nullable=False)
    app_version = Column(String)
    os_version = Column(String)
    is_active = Column(Boolean, default=True)
    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Event(Base):
    __tablename__ = "events"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    aggregate_id = Column(String, nullable=False)
    aggregate_type = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    event_version = Column(Integer, nullable=False)
    payload = Column(Text, nullable=False)
    event_metadata = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

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
    image_url = Column(String(512))
    features = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    notification_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    data = Column(Text)
    channel = Column(String)
    priority = Column(String)
    status = Column(String, nullable=False)
    delivery_provider = Column(String)
    delivery_provider_id = Column(String)
    retry_count = Column(Integer, default=0)
    last_attempt_at = Column(DateTime(timezone=True))
    delivered_at = Column(DateTime(timezone=True))
    read_at = Column(DateTime(timezone=True))
    failure_reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Nutritionist(Base):
    __tablename__ = "nutritionists"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    specialization = Column(String)
    bio = Column(Text)
    image_url = Column(String(512))
    rating = Column(Float, default=0.0)
    experience_years = Column(Integer, default=0)
    total_clients = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    city = Column(String)
    tagline = Column(Text)
    qualifications = Column(Text)
    available_slots = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    subscription_id = Column(String)
    daily_meal_schedule_id = Column(String)
    client_id = Column(String, nullable=False)
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=False)
    client_phone = Column(String, nullable=False)
    client_address = Column(Text, nullable=False)
    diet_plan = Column(String, nullable=False)
    meal_type = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    price = Column(Float, nullable=False)
    status = Column(String, default="pending")
    kitchen_status = Column(String, default="pending")
    delivery_agent_id = Column(String)
    delivery_agent_name = Column(String)
    priority = Column(String)
    consumed_status = Column(String)
    consumption_logged_at = Column(DateTime(timezone=True))
    rating = Column(Integer)
    feedback = Column(Text)
    notes = Column(Text)
    version = Column(Integer, nullable=False, default=1)
    idempotency_key = Column(String, unique=True)
    area_id = Column(String)
    batch_id = Column(String)
    timeslot_start = Column(DateTime(timezone=True))
    timeslot_end = Column(DateTime(timezone=True))
    label_printed = Column(Boolean, default=False)
    label_scanned_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    prepared_at = Column(DateTime(timezone=True))
    packed_at = Column(DateTime(timezone=True))
    assigned_at = Column(DateTime(timezone=True))
    picked_up_at = Column(DateTime(timezone=True))
    delivered_at = Column(DateTime(timezone=True))
    estimated_delivery_time = Column(DateTime(timezone=True))

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String)
    subscription_id = Column(String)
    client_id = Column(String, nullable=False)
    amount_cents = Column(Integer, nullable=False)
    currency = Column(String, nullable=False, default="INR")
    payment_method = Column(String, nullable=False)
    payment_provider = Column(String)
    payment_provider_id = Column(String)
    payment_provider_reference = Column(String(512))
    status = Column(String, nullable=False)
    failure_reason = Column(Text)
    idempotency_key = Column(String, unique=True)
    payment_metadata = Column(Text)
    initiated_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(Text)
    short_benefit = Column(String)
    price = Column(Float, nullable=False)
    image_url = Column(String(512))
    category = Column(String)
    tags = Column(JSON)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    nutritional_highlights = Column(JSON)
    key_benefits = Column(JSON)
    suitable_for = Column(JSON)
    nutritionist_endorsements = Column(JSON)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

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

class Refund(Base):
    __tablename__ = "refunds"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    payment_id = Column(String, nullable=False)
    order_id = Column(String)
    subscription_id = Column(String)
    client_id = Column(String, nullable=False)
    amount_cents = Column(Integer, nullable=False)
    currency = Column(String, nullable=False)
    refund_reason = Column(Text)
    refund_method = Column(String)
    payment_provider_id = Column(String)
    status = Column(String, nullable=False)
    failure_reason = Column(Text)
    idempotency_key = Column(String, unique=True)
    refund_metadata = Column(Text)
    initiated_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
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
    meeting_link = Column(String(2048))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    client_id = Column(String, nullable=False)
    nutritionist_id = Column(String)
    meal_plan_id = Column(String, nullable=False)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    duration_days = Column(Integer)
    status = Column(String)
    meals_per_day = Column(Integer)
    total_amount = Column(Float, nullable=False)
    payment_status = Column(String)
    payment_method = Column(String)
    allocation_status = Column(String)
    checkout_data_id = Column(String)
    health_inputs = Column(Text)
    meal_timing = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class UserActivity(Base):
    __tablename__ = "user_activities"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    subscription_id = Column(String)
    nutritionist_id = Column(String)
    activity_type = Column(String, nullable=False)
    activity_data = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    role = Column(String, default="client")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WeeklyReport(Base):
    __tablename__ = "weekly_reports"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    client_id = Column(String, nullable=False)
    subscription_id = Column(String, nullable=False)
    week_number = Column(Integer, nullable=False)
    total_meals_delivered = Column(Integer)
    meals_consumed = Column(Integer)
    meals_skipped = Column(Integer)
    total_calories = Column(Integer)
    avg_calories_per_day = Column(Integer)
    weight_change = Column(Float)
    nutritionist_notes = Column(Text)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
