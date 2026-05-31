from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from passlib.context import CryptContext
from datetime import datetime
import uuid

from db import get_db
import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# --- NEW: BULLETPROOF ROLE EXTRACTOR ---
def get_safe_role(role_attr) -> str:
    """Safely extracts the role string whether it's a Python Enum, String, or None."""
    if isinstance(role_attr, str):
        return role_attr.upper()
    if hasattr(role_attr, 'name'):
        return str(role_attr.name).upper()
    if hasattr(role_attr, 'value'):
        return str(role_attr.value).upper()
    return str(role_attr).upper()

def generate_role_id(role) -> str:
    safe_role = get_safe_role(role)
    unique_string = str(uuid.uuid4()).split('-')[0].upper()
    
    if "CUST" in safe_role: prefix = "CUST"
    elif "NUTR" in safe_role: prefix = "NUTR"
    elif "DRIV" in safe_role or "DELV" in safe_role: prefix = "DELV"
    elif "KITCH" in safe_role: prefix = "KTCH"
    elif "ADMIN" in safe_role: prefix = "ADMN"
    else: prefix = "USER"
    
    return f"{prefix}-{unique_string}"

@router.post("/register", response_model=schemas.LoginResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        or_(models.User.email == user.email, models.User.username == user.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or Username already registered")
    
    new_user_id = generate_role_id(user.role)
    hashed_pwd = get_password_hash(user.password)
    
    db_user = models.User(
        id=new_user_id,
        username=user.username,
        email=user.email,
        passwordHash=hashed_pwd,
        role=user.role
    )
    db.add(db_user)
    db.flush()

    safe_role = get_safe_role(user.role)

    # Create Profile based on safe role string
    if "CUSTOMER" in safe_role:
        profile = models.CustomerProfile(userId=new_user_id, fullName=user.fullName)
        db.add(profile)
    elif "NUTR" in safe_role:
        profile = models.NutritionistProfile(userId=new_user_id, fullName=user.fullName)
        db.add(profile)
    elif "DRIV" in safe_role:
        profile = models.DriverProfile(userId=new_user_id, fullName=user.fullName, phoneNumber="Pending")
        db.add(profile)
        
    db.commit()
    
    return {
        "message": "Registration successful",
        "userId": db_user.id,
        "role": safe_role,
        "username": db_user.username
    }

@router.post("/login", response_model=schemas.LoginResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        or_(models.User.email == credentials.identifier, models.User.username == credentials.identifier)
    ).first()
    
    if not user or not verify_password(credentials.password, user.passwordHash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    user.lastLoginDate = datetime.utcnow()
    db.commit()
    
    return {
        "message": "Login successful",
        "userId": user.id,
        "role": get_safe_role(user.role), # Guaranteed to be clean uppercase string
        "username": user.username
    }