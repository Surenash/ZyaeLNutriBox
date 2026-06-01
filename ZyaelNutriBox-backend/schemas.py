from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from models import RoleEnum, MealTypeEnum, OrderStatusEnum, PriorityEnum, ConsultStatusEnum

# --- AUTH & USERS ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: RoleEnum
    fullName: str # Used to create the associated profile

class UserLogin(BaseModel):
    identifier: str # Can be username or email
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

class LoginResponse(BaseModel):
    message: str
    userId: str
    role: str
    username: str

# --- PROFILES ---
class CustomerProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    phoneNumber: Optional[str] = None
    addressText: Optional[str] = None
    dietaryTags: Optional[List[str]] = None
    profilePictureUrl: Optional[str] = None

class DriverProfileUpdate(BaseModel):
    phoneNumber: Optional[str] = None
    vehicleNumber: Optional[str] = None
    isActive: Optional[bool] = None
    profilePictureUrl: Optional[str] = None

# --- SUBSCRIPTIONS ---
class SubscriptionCreate(BaseModel):
    planId: int

class SubscriptionResponse(BaseModel):
    id: str
    planId: int
    startDate: datetime
    expiryDate: datetime
    isActive: bool
    daysLeft: int

# --- KITCHEN & MENUS ---
class MenuCreate(BaseModel):
    targetDate: date
    mealType: MealTypeEnum
    defaultMealName: str
    proteinGrams: int
    carbsGrams: int
    fatGrams: int

# --- ORDERS & DISPATCH ---
class OrderTicketResponse(BaseModel):
    id: str
    customMealName: Optional[str]
    customInstructions: Optional[str]
    status: OrderStatusEnum
    priority: PriorityEnum
    createdAt: datetime
    
    # Nested data for UI convenience
    customerName: str
    customerPhone: Optional[str]
    dietaryTags: Optional[List[str]]

class DriverAcceptOrder(BaseModel):
    orderId: str

class DriverVerifyOTP(BaseModel):
    orderId: str
    otp: str

# --- TELEHEALTH ---
class ConsultationRequest(BaseModel):
    nutritionistId: str
    scheduledTime: datetime

class ConsultationResponse(BaseModel):
    id: str
    scheduledTime: datetime
    status: ConsultStatusEnum
    meetingLink: Optional[str]
    notes: Optional[str]

    # Add to the bottom of schemas.py

class KitchenOrderUpdateStatus(BaseModel):
    status: OrderStatusEnum

class KitchenOrderUpdatePriority(BaseModel):
    priority: PriorityEnum

class KitchenOrderCustomize(BaseModel):
    customMealName: str
    customInstructions: str

class KitchenOrderResponse(BaseModel):
    id: str
    targetDate: date
    mealType: str
    customerName: str
    dietaryTags: Optional[List[str]]
    mealName: str # Shows custom if available, else default
    instructions: Optional[str]
    status: str
    priority: str
    createdAt: datetime

class KitchenDispatchResponse(BaseModel):
    orderId: str
    customerName: str
    driverName: str
    driverPhone: str
    status: str
    otp: str

class KitchenCustomerTimeline(BaseModel):
    customerName: str
    macrosConsumedToday: dict
    mealsToday: List[dict]

# --- DELIVERY PORTAL SCHEMAS ---

class DriverStatusUpdate(BaseModel):
    isActive: bool

class DriverOrderResponse(BaseModel):
    id: str
    customerName: str
    customerPhone: Optional[str]
    addressText: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    mealName: str
    status: OrderStatusEnum
    priority: PriorityEnum
    createdAt: datetime

class OTPVerification(BaseModel):
    otp: str

# Add to the bottom of schemas.py

class ReviewCreate(BaseModel):
    planId: int
    rating: int 
    reviewText: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str
    customerName: str
    planName: str
    rating: int
    reviewText: Optional[str]
    createdAt: datetime
    profilePictureUrl: Optional[str] = None

# --- NUTRITIONIST PORTAL SCHEMAS ---
class NutritionistProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    specialty: Optional[str] = None
    profilePictureUrl: Optional[str] = None
    phoneNumber: str

class ConsultStatusUpdateRequest(BaseModel):
    status: ConsultStatusEnum
    meetingLink: Optional[str] = None
    notes: Optional[str] = None

# Add to the bottom of schemas.py

class ArticleCreate(BaseModel):
    headline: str
    content: str
    source: Optional[str] = None
    link: Optional[str] = None
    imageUrl: Optional[str] = None
    publishedDate: Optional[datetime] = None

class ArticleResponse(BaseModel):
    id: str
    headline: str
    content: str
    source: Optional[str]
    link: Optional[str]
    imageUrl: Optional[str]
    publishedDate: datetime
    createdAt: datetime

class AdminGenericPayload(BaseModel):
    # Allows passing any JSON key-value pairs directly to the database models
    data: Dict[str, Any]

# --- MEAL PLAN SCHEMAS ---
class MealPlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    monthlyPrice: Optional[float] = None
    imageUrl: Optional[str] = None
    isPromoted: Optional[bool] = None
    benefits: Optional[List[str]] = None
    calories: Optional[int] = None
    protein: Optional[int] = None
    carbs: Optional[int] = None
    fats: Optional[int] = None
    sampleMeals: Optional[List[str]] = None

class MealPlanResponse(BaseModel):
    id: int
    name: str
    description: str
    monthlyPrice: float
    imageUrl: Optional[str] = None
    isPromoted: Optional[bool] = False
    benefits: Optional[List[str]] = None
    calories: Optional[int] = 0
    protein: Optional[int] = 0
    carbs: Optional[int] = 0
    fats: Optional[int] = 0
    sampleMeals: Optional[List[str]] = None
    
    class Config:
        orm_mode = True