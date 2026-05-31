from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from db import get_db
import models, schemas

router = APIRouter(
    prefix="/api/admin",
    tags=["Grandmaster Portal"]
)

# --- God Mode Authentication ---
def get_grandmaster(user_id: str):
    """Pass ?user_id=ADMN-XXXX. Restricts access to Grandmasters only."""
    if not user_id or not user_id.startswith("ADMN"):
        raise HTTPException(status_code=403, detail="Unauthorized. Grandmaster access required.")
    return user_id

# --- Dynamic Model Registry ---
# Maps URL endpoints to your actual SQLAlchemy models
MODEL_REGISTRY = {
    "users": models.User,
    "customer_profiles": models.CustomerProfile,
    "nutritionist_profiles": models.NutritionistProfile,
    "driver_profiles": models.DriverProfile,
    "meal_plans": models.MealPlanCatalog,
    "subscriptions": models.CustomerSubscription,
    "daily_menus": models.DailyMenu,
    "orders": models.OrderTicket,
    "consultations": models.Consultation,
    "reviews": models.Review,
    "articles": models.Article
}

def get_model(resource: str):
    model = MODEL_REGISTRY.get(resource.lower())
    if not model:
        raise HTTPException(status_code=404, detail=f"Table '{resource}' not found in registry.")
    return model

# ==========================================
# 1. READ (Fetch all from any table)
# ==========================================
@router.get("/{resource}")
def get_all_records(resource: str, skip: int = 0, limit: int = 100, grandmaster_id: str = Depends(get_grandmaster), db: Session = Depends(get_db)):
    """Fetch records from ANY table. Example: /api/admin/users or /api/admin/orders"""
    model = get_model(resource)
    records = db.query(model).offset(skip).limit(limit).all()
    return {"resource": resource, "count": len(records), "data": records}


# ==========================================
# 2. INSERT (Create in any table)
# ==========================================
@router.post("/{resource}", status_code=status.HTTP_201_CREATED)
def insert_record(resource: str, payload: schemas.AdminGenericPayload, grandmaster_id: str = Depends(get_grandmaster), db: Session = Depends(get_db)):
    """Insert a new record into ANY table by passing a JSON object matching the model's columns."""
    model = get_model(resource)
    
    try:
        new_record = model(**payload.data)
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return {"message": f"Record inserted into {resource} successfully", "id": getattr(new_record, "id", None) or getattr(new_record, "userId", None)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database constraint error: {str(e)}")

from sqlalchemy import or_ # Make sure 'or_' is imported at the top of admin.py if it isn't!

# ==========================================
# 3. UPDATE (Edit any table)
# ==========================================
@router.put("/{resource}/{record_id}")
def update_record(resource: str, record_id: str, payload: schemas.AdminGenericPayload, grandmaster_id: str = Depends(get_grandmaster), db: Session = Depends(get_db)):
    """Update specific fields of a record in ANY table."""
    model = get_model(resource)
    
    primary_key = int(record_id) if resource == "meal_plans" else record_id
    
    record = db.get(model, primary_key)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    try:
        for key, value in payload.data.items():
            if hasattr(record, key):
                # FIX: Convert empty strings to None so the DB doesn't crash on optional fields
                if value == "": 
                    value = None
                setattr(record, key, value)
                
        db.commit()
        return {"message": f"Record {record_id} in {resource} updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database update error: {str(e)}")


# ==========================================
# 4. DELETE (Remove from any table)
# ==========================================
# ==========================================
# 4. DELETE (Remove from any table)
# ==========================================
@router.delete("/{resource}/{record_id}")
def delete_record(resource: str, record_id: str, grandmaster_id: str = Depends(get_grandmaster), db: Session = Depends(get_db)):
    """Delete a record from ANY table."""
    model = get_model(resource)
    
    primary_key = int(record_id) if resource == "meal_plans" else record_id
    
    record = db.get(model, primary_key)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    try:
        # FIX: Bulletproof Manual Cascade Deletion!
        if resource == "users":
            # 1. DETACH FROM OTHER TABLES (Set Foreign Keys to NULL)
            # If deleting a Nutritionist, remove them from all their patients
            if hasattr(models.CustomerProfile, 'assignedNutritionistId'):
                db.query(models.CustomerProfile).filter(models.CustomerProfile.assignedNutritionistId == record_id).update({"assignedNutritionistId": None})
            
            # If deleting a Driver, remove them from all their active delivery tickets
            if hasattr(models.OrderTicket, 'driverId'):
                db.query(models.OrderTicket).filter(models.OrderTicket.driverId == record_id).update({"driverId": None})
            
            # 2. DELETE ALL TRACE RECORDS (Consultations, Reviews, Orders)
            db.query(models.Consultation).filter(
                or_(models.Consultation.nutritionistId == record_id, models.Consultation.customerId == record_id)
            ).delete()
            
            # If deleting a Customer, clear their history so it doesn't block deletion
            if hasattr(models, 'Review'):
                db.query(models.Review).filter(models.Review.customerId == record_id).delete()
            if hasattr(models, 'CustomerSubscription'):
                db.query(models.CustomerSubscription).filter(models.CustomerSubscription.customerId == record_id).delete()
            if hasattr(models, 'OrderTicket'):
                db.query(models.OrderTicket).filter(models.OrderTicket.customerId == record_id).delete()

            # 3. FINALLY, DELETE THE ROLE PROFILES
            db.query(models.CustomerProfile).filter(models.CustomerProfile.userId == record_id).delete()
            db.query(models.NutritionistProfile).filter(models.NutritionistProfile.userId == record_id).delete()
            db.query(models.DriverProfile).filter(models.DriverProfile.userId == record_id).delete()

        # Delete the base User record (or MealPlan/Article if resource != "users")
        db.delete(record)
        db.commit()
        return {"message": f"Record {record_id} permanently deleted from {resource}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Deletion failed (Foreign Key restriction): {str(e)}")

@router.get("/nutritionists/pending")
def get_pending_nutritionists(grandmaster_id: str = Depends(get_grandmaster), db: Session = Depends(get_db)):
    """Fetch all nutritionists waiting for admin approval, including their phone numbers."""
    
    pending_docs = db.query(models.NutritionistProfile, models.User.email).join(
        models.User, models.NutritionistProfile.userId == models.User.id
    ).filter(
        models.NutritionistProfile.isApproved == False
    ).all()
    
    response = []
    for profile, email in pending_docs:
        response.append({
            "userId": profile.userId,
            "fullName": profile.fullName,
            "email": email,
            "phoneNumber": profile.phoneNumber,
            "specialty": profile.specialty
        })
        
    return response

@router.put("/nutritionists/{nutritionist_id}/approve")
def approve_nutritionist(nutritionist_id: str, grandmaster_id: str = Depends(get_grandmaster), db: Session = Depends(get_db)):
    """Approve a nutritionist so they can start taking patients."""
    
    profile = db.query(models.NutritionistProfile).filter(models.NutritionistProfile.userId == nutritionist_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Nutritionist not found")
        
    profile.isApproved = True
    db.commit()
    
    return {"message": f"Dr. {profile.fullName} has been approved and can now accept patients!"}