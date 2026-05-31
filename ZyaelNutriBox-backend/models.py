import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DECIMAL, Boolean, TIMESTAMP, ForeignKey, JSON, Enum, Date, Text
from sqlalchemy.orm import relationship
from db import Base

# --- ENUMS ---
class RoleEnum(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    NUTRITIONIST = "NUTRITIONIST"
    DRIVER = "DRIVER"
    KITCHEN_ADMIN = "KITCHEN_ADMIN"
    ADMIN="SUPER_ADMIN"

class MealTypeEnum(str, enum.Enum):
    BREAKFAST = "BREAKFAST"
    LUNCH = "LUNCH"
    DINNER = "DINNER"

class OrderStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    COOKING = "COOKING"
    READY = "READY"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"

class PriorityEnum(str, enum.Enum):
    NORMAL = "NORMAL"
    HIGH = "HIGH"

class ConsultStatusEnum(str, enum.Enum):
    REQUESTED = "REQUESTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    RESCHEDULED = "RESCHEDULED"
    COMPLETED = "COMPLETED"

# --- MODELS ---

class User(Base):
    __tablename__ = "Users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    passwordHash = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    createdAt = Column(TIMESTAMP, default=datetime.utcnow)
    lastLoginDate = Column(TIMESTAMP, nullable=True)

class CustomerProfile(Base):
    __tablename__ = "CustomerProfile"
    userId = Column(String(36), ForeignKey("Users.id", ondelete="CASCADE"), primary_key=True)
    fullName = Column(String(255), nullable=False)
    phoneNumber = Column(String(50))
    addressText = Column(Text)
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    dietaryTags = Column(JSON) 
    assignedNutritionistId = Column(String(36), ForeignKey("Users.id", ondelete="SET NULL"), nullable=True)
    profilePictureUrl = Column(String(512), nullable=True)
    
    # THE FIX: Explicitly point the relationship to userId
    user = relationship("User", foreign_keys=[userId])

class NutritionistProfile(Base):
    __tablename__ = "NutritionistProfile"
    userId = Column(String(36), ForeignKey("Users.id", ondelete="CASCADE"), primary_key=True)
    fullName = Column(String(255), nullable=False)
    specialty = Column(String(255))
    profilePictureUrl = Column(String(512), nullable=True)
    phoneNumber = Column(String(50), nullable=True)
    isApproved = Column(Boolean, default=False)

class DriverProfile(Base):
    __tablename__ = "DriverProfile"
    userId = Column(String(36), ForeignKey("Users.id", ondelete="CASCADE"), primary_key=True)
    fullName = Column(String(255), nullable=False)
    phoneNumber = Column(String(50), nullable=False)
    vehicleNumber = Column(String(100))
    isActive = Column(Boolean, default=False)
    totalEarnings = Column(DECIMAL(10, 2), default=0.00)
    profilePictureUrl = Column(String(512), nullable=True)

class MealPlanCatalog(Base):
    __tablename__ = "MealPlanCatalog"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    monthlyPrice = Column(DECIMAL(10, 2), nullable=False)
    imageUrl = Column(String(512), nullable=True)

class CustomerSubscription(Base):
    __tablename__ = "CustomerSubscription"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customerId = Column(String(36), ForeignKey("CustomerProfile.userId"), nullable=False)
    planId = Column(Integer, ForeignKey("MealPlanCatalog.id"), nullable=False)
    startDate = Column(TIMESTAMP, nullable=False)
    expiryDate = Column(TIMESTAMP, nullable=False)
    isActive = Column(Boolean, default=True)

class DailyMenu(Base):
    __tablename__ = "DailyMenu"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    targetDate = Column(Date, nullable=False)
    mealType = Column(Enum(MealTypeEnum), nullable=False)
    defaultMealName = Column(String(255), nullable=False)
    proteinGrams = Column(Integer, default=0)
    carbsGrams = Column(Integer, default=0)
    fatGrams = Column(Integer, default=0)

class OrderTicket(Base):
    __tablename__ = "OrderTicket"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customerId = Column(String(36), ForeignKey("CustomerProfile.userId"), nullable=False)
    menuId = Column(String(36), ForeignKey("DailyMenu.id"), nullable=False)
    
    customMealName = Column(String(255))
    customInstructions = Column(Text)
    
    status = Column(Enum(OrderStatusEnum), default=OrderStatusEnum.PENDING)
    priority = Column(Enum(PriorityEnum), default=PriorityEnum.NORMAL)
    
    assignedDriverId = Column(String(36), ForeignKey("DriverProfile.userId"), nullable=True)
    pickupOtp = Column(String(6), nullable=True)
    
    createdAt = Column(TIMESTAMP, default=datetime.utcnow)
    deliveredAt = Column(TIMESTAMP, nullable=True)
    
    menu = relationship("DailyMenu")
    customer = relationship("CustomerProfile")
    driver = relationship("DriverProfile")

class Consultation(Base):
    __tablename__ = "Consultation"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customerId = Column(String(36), ForeignKey("CustomerProfile.userId"), nullable=False)
    nutritionistId = Column(String(36), ForeignKey("NutritionistProfile.userId"), nullable=False)
    scheduledTime = Column(TIMESTAMP, nullable=False)
    status = Column(Enum(ConsultStatusEnum), default=ConsultStatusEnum.REQUESTED)
    meetingLink = Column(String(512), nullable=True)
    notes = Column(Text, nullable=True)

# Add to the bottom of models.py

class Review(Base):
    __tablename__ = "Review"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customerId = Column(String(36), ForeignKey("CustomerProfile.userId", ondelete="CASCADE"), nullable=False)
    planId = Column(Integer, ForeignKey("MealPlanCatalog.id", ondelete="CASCADE"), nullable=False)
    
    rating = Column(Integer, nullable=False) # 1 to 5 stars
    reviewText = Column(Text, nullable=True)
    createdAt = Column(TIMESTAMP, default=datetime.utcnow)
    
    # Relationships for easy data fetching
    customer = relationship("CustomerProfile")
    plan = relationship("MealPlanCatalog")

# Add to the bottom of models.py

class Article(Base):
    __tablename__ = "Article"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    headline = Column(String(255), nullable=False)
    content = Column(Text)
    source = Column(String(255))
    link = Column(String(512))
    imageUrl = Column(String(512))
    publishedDate = Column(TIMESTAMP, default=datetime.utcnow)
    createdAt = Column(TIMESTAMP, default=datetime.utcnow)