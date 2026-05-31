from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List

from db import get_db
import models, schemas

router = APIRouter(
    prefix="/api/nutritionist",
    tags=["Nutritionist Portal"]
)

# --- Mock Authentication Dependency ---
def get_current_nutritionist(user_id: str):
    """Pass ?user_id=NUTR-XXXX in the URL for MVP testing."""
    if not user_id or not user_id.startswith("NUTR"):
        raise HTTPException(status_code=401, detail="Unauthorized. Must be a Nutritionist.")
    return user_id


# ==========================================
# 1. DOCTOR PROFILE
# ==========================================

@router.get("/profile")
def get_nutritionist_profile(user_id: str = Depends(get_current_nutritionist), db: Session = Depends(get_db)):
    """Fetch the nutritionist's profile and specialty."""
    profile = db.query(models.NutritionistProfile).filter(models.NutritionistProfile.userId == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Nutritionist profile not found")
        
    return {
        "userId": profile.userId,
        "fullName": profile.fullName,
        "specialty": profile.specialty,
        "profilePictureUrl": profile.profilePictureUrl,
        "phoneNumber": profile.phoneNumber,
        "isApproved": profile.isApproved
    }

@router.put("/profile")
def update_nutritionist_profile(data: schemas.NutritionistProfileUpdate, user_id: str = Depends(get_current_nutritionist), db: Session = Depends(get_db)):
    """Update name, specialty, and profile picture."""
    profile = db.query(models.NutritionistProfile).filter(models.NutritionistProfile.userId == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.commit()
    return {"message": "Profile updated successfully"}


# ==========================================
# 2. PATIENT MANAGEMENT
# ==========================================

@router.get("/patients")
def get_assigned_patients(user_id: str = Depends(get_current_nutritionist), db: Session = Depends(get_db)):
    """View all customers assigned to this specific nutritionist AND anyone who booked a consult with them."""
    
    # FIX: Fetch patients who are officially assigned OR who have requested a consultation
    patients = db.query(models.CustomerProfile).outerjoin(
        models.Consultation, models.CustomerProfile.userId == models.Consultation.customerId
    ).filter(
        or_(
            models.CustomerProfile.assignedNutritionistId == user_id,
            models.Consultation.nutritionistId == user_id
        )
    ).distinct().all()
    
    response = []
    for p in patients:
        response.append({
            "customerId": p.userId,
            "fullName": p.fullName,
            "dietaryTags": p.dietaryTags,
            "profilePictureUrl": p.profilePictureUrl
        })
    return response


# ==========================================
# 3. CONSULTATION MANAGEMENT
# ==========================================

@router.get("/consultations")
def get_my_consultations(user_id: str = Depends(get_current_nutritionist), db: Session = Depends(get_db)):
    """View all consultation requests and upcoming accepted meetings."""
    consults = db.query(models.Consultation).filter(
        models.Consultation.nutritionistId == user_id
    ).order_by(models.Consultation.scheduledTime.asc()).all()
    
    # Format the response safely for the frontend
    response = []
    for c in consults:
        response.append({
            "id": c.id,
            "customerId": c.customerId,
            "nutritionistId": c.nutritionistId,
            "scheduledTime": c.scheduledTime,
            "status": c.status.name if hasattr(c.status, 'name') else str(c.status),
            "meetingLink": c.meetingLink,
            "notes": c.notes
        })
    
    return response


@router.put("/consultations/{consult_id}/status")
def update_consultation_status(consult_id: str, data: schemas.ConsultStatusUpdateRequest, user_id: str = Depends(get_current_nutritionist), db: Session = Depends(get_db)):
    
    # --- SECURITY LOCK: Check if approved ---
    profile = db.query(models.NutritionistProfile).filter(models.NutritionistProfile.userId == user_id).first()
    if not profile or not profile.isApproved:
        raise HTTPException(
            status_code=403, 
            detail="Your account is pending verification. You cannot accept or reject patients yet."
        )

    # --- FIX: FULL DATABASE UPDATE LOGIC ---
    consult = db.query(models.Consultation).filter(
        models.Consultation.id == consult_id,
        models.Consultation.nutritionistId == user_id
    ).first()
    
    if not consult:
        raise HTTPException(status_code=404, detail="Consultation not found")
        
    # Update the status
    consult.status = data.status
    
    # If the doctor provided a zoom link during approval, save it!
    if data.meetingLink:
        consult.meetingLink = data.meetingLink
        
    if data.notes:
        consult.notes = data.notes

    # Save to Database
    db.commit()
    db.refresh(consult)
    
    return {"message": f"Consultation marked as {data.status.name if hasattr(data.status, 'name') else data.status}."}