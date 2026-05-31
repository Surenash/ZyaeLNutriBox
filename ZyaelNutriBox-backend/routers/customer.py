from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta
from typing import List

from db import get_db
import models, schemas

router = APIRouter(
    prefix="/api/customer",
    tags=["Customer Portal"]
)

# --- Mock Authentication Dependency ---
def get_current_user_id(user_id: str):
    """
    For MVP testing without tokens, pass ?user_id=CUST-XXXX in the URL.
    In production, this will be replaced by a JWT token verifier.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Missing user_id parameter")
    return user_id


# ==========================================
# 1. PROFILE MANAGEMENT
# ==========================================

@router.get("/profile")
def get_profile(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Fetch the customer's profile, including their dietary preferences."""
    profile = db.query(models.CustomerProfile).filter(models.CustomerProfile.userId == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    
    # Also fetch the base user for email/username
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    return {
        "userId": profile.userId,
        "username": user.username,
        "email": user.email,
        "fullName": profile.fullName,
        "phoneNumber": profile.phoneNumber,
        "addressText": profile.addressText,
        "dietaryTags": profile.dietaryTags,
        "profilePictureUrl": profile.profilePictureUrl
    }

@router.put("/profile")
def update_profile(data: schemas.CustomerProfileUpdate, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Update address, phone number, and dietary tags."""
    profile = db.query(models.CustomerProfile).filter(models.CustomerProfile.userId == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    
    # Update fields only if they are provided
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.commit()
    db.refresh(profile)
    return {"message": "Profile updated successfully"}


# ==========================================
# 2. SUBSCRIPTIONS & PLANS
# ==========================================

@router.get("/plans")
def get_available_plans(db: Session = Depends(get_db)):
    """Fetch the 5 subscription plans available to purchase."""
    plans = db.query(models.MealPlanCatalog).all()
    return plans

@router.get("/subscription", response_model=schemas.SubscriptionResponse)
def get_active_subscription(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Get the user's active subscription and calculate days left."""
    sub = db.query(models.CustomerSubscription).filter(
        models.CustomerSubscription.customerId == user_id,
        models.CustomerSubscription.isActive == True
    ).first()
    
    if not sub:
        raise HTTPException(status_code=404, detail="No active subscription found")
    
    # Calculate days left
    days_left = (sub.expiryDate.date() - datetime.utcnow().date()).days
    
    # If expired, deactivate it
    if days_left < 0:
        sub.isActive = False
        db.commit()
        raise HTTPException(status_code=404, detail="Subscription has expired")
        
    return {
        "id": sub.id,
        "planId": sub.planId,
        "startDate": sub.startDate,
        "expiryDate": sub.expiryDate,
        "isActive": sub.isActive,
        "daysLeft": max(0, days_left)
    }

@router.post("/subscription", status_code=status.HTTP_201_CREATED)
def purchase_subscription(data: schemas.SubscriptionCreate, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Buy a new subscription. Starts a 30-day timer."""
    # Check if they already have an active sub
    existing_sub = db.query(models.CustomerSubscription).filter(
        models.CustomerSubscription.customerId == user_id,
        models.CustomerSubscription.isActive == True
    ).first()
    
    if existing_sub:
        raise HTTPException(status_code=400, detail="You already have an active subscription")
        
    # Verify the plan exists
    plan = db.query(models.MealPlanCatalog).filter(models.MealPlanCatalog.id == data.planId).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    now = datetime.utcnow()
    new_sub = models.CustomerSubscription(
        customerId=user_id,
        planId=plan.id,
        startDate=now,
        expiryDate=now + timedelta(days=30),
        isActive=True
    )
    
    db.add(new_sub)
    db.commit()
    
    return {"message": "Subscription purchased successfully. Your 30-day plan begins now!"}


# ==========================================
# 3. DAILY TRACKING & MEALS
# ==========================================

@router.get("/today")
def get_daily_status(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Fetch today's assigned meal, its macros, and live delivery status."""
    today = date.today()
    
    # 1. Look for today's order ticket
    ticket = db.query(models.OrderTicket).filter(
        models.OrderTicket.customerId == user_id,
        func.date(models.OrderTicket.createdAt) == today
    ).first()
    
    if not ticket:
        return {"message": "No meal assigned for today yet. Check back later!"}
        
    # 2. Fetch the corresponding menu to get macros
    menu = db.query(models.DailyMenu).filter(models.DailyMenu.id == ticket.menuId).first()
    
    # 3. Formulate response
    meal_name = ticket.customMealName if ticket.customMealName else menu.defaultMealName
    
    return {
        "orderId": ticket.id,
        "mealName": meal_name,
        "macros": {
            "protein": menu.proteinGrams,
            "carbs": menu.carbsGrams,
            "fats": menu.fatGrams
        },
        "customInstructions": ticket.customInstructions,
        "status": ticket.status.value,  # PENDING, COOKING, READY, IN_TRANSIT, DELIVERED
        "otp": ticket.pickupOtp  # Only show if needed for customer, otherwise hide
    }


# ==========================================
# 4. TELEHEALTH CONSULTATIONS
# ==========================================

@router.get("/consultations", response_model=List[schemas.ConsultationResponse])
def get_my_consultations(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """List all consultations (upcoming and past) for the user."""
    consults = db.query(models.Consultation).filter(models.Consultation.customerId == user_id).order_by(models.Consultation.scheduledTime.desc()).all()
    return consults

# In customer.py

@router.post("/consultations", status_code=status.HTTP_201_CREATED)
def book_consultation(data: schemas.ConsultationRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Request a new video meeting with a nutritionist."""
    
    # Check if the nutritionist exists
    doctor = db.query(models.NutritionistProfile).filter(models.NutritionistProfile.userId == data.nutritionistId).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Nutritionist not found")
        
    new_consult = models.Consultation(
        customerId=user_id,
        nutritionistId=data.nutritionistId,
        scheduledTime=data.scheduledTime,
        status=models.ConsultStatusEnum.REQUESTED
    )
    db.add(new_consult)
    
    # --- FIX: AUTO-ASSIGN PATIENT ---
    # Automatically assign this patient to the Nutritionist so they show up on the Doctor's dashboard!
    patient_profile = db.query(models.CustomerProfile).filter(models.CustomerProfile.userId == user_id).first()
    if patient_profile:
        patient_profile.assignedNutritionistId = data.nutritionistId
        
    db.commit()
    
    return {"message": "Consultation requested successfully. Waiting for doctor approval."}
@router.delete("/consultations/{consult_id}")
def cancel_consultation(consult_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Cancel an upcoming consultation."""
    consult = db.query(models.Consultation).filter(
        models.Consultation.id == consult_id,
        models.Consultation.customerId == user_id
    ).first()
    
    if not consult:
        raise HTTPException(status_code=404, detail="Consultation not found")
        
    db.delete(consult)
    db.commit()
    return {"message": "Consultation canceled successfully"}