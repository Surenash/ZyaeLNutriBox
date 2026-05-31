from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db import get_db
import models, schemas

router = APIRouter(
    prefix="/api/reviews",
    tags=["Reviews & Ratings"]
)

# --- Mock Authentication Dependency ---
def get_current_customer(user_id: str):
    """Pass ?user_id=CUST-XXXX in the URL for MVP testing."""
    if not user_id or not user_id.startswith("CUST"):
        raise HTTPException(status_code=401, detail="Unauthorized. Must be a Customer.")
    return user_id


# ==========================================
# 1. SUBMIT A REVIEW
# ==========================================

@router.post("/", status_code=status.HTTP_201_CREATED)
def submit_review(data: schemas.ReviewCreate, user_id: str = Depends(get_current_customer), db: Session = Depends(get_db)):
    """Allow a customer to leave a 1-5 star rating and text review for a plan."""
    
    # 1. Validate Rating
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5 stars.")
        
    # 2. Verify the Plan exists
    plan = db.query(models.MealPlanCatalog).filter(models.MealPlanCatalog.id == data.planId).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found.")
        
    # 3. Prevent duplicate reviews (optional: 1 review per plan per customer)
    existing_review = db.query(models.Review).filter(
        models.Review.customerId == user_id,
        models.Review.planId == data.planId
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this meal plan.")

    # 4. Save to Database
    new_review = models.Review(
        customerId=user_id,
        planId=data.planId,
        rating=data.rating,
        reviewText=data.reviewText
    )
    
    db.add(new_review)
    db.commit()
    
    return {"message": "Thank you for your feedback! Review submitted successfully."}


# ==========================================
# 2. FETCH REVIEWS (PUBLIC)
# ==========================================

@router.get("/plan/{plan_id}", response_model=List[schemas.ReviewResponse])
def get_plan_reviews(plan_id: int, db: Session = Depends(get_db)):
    """Fetch all reviews for a specific meal plan (e.g., to show on the details page)."""
    
    reviews = db.query(models.Review, models.CustomerProfile, models.MealPlanCatalog).join(
        models.CustomerProfile, models.Review.customerId == models.CustomerProfile.userId
    ).join(
        models.MealPlanCatalog, models.Review.planId == models.MealPlanCatalog.id
    ).filter(
        models.Review.planId == plan_id
    ).order_by(
        models.Review.createdAt.desc()
    ).all()

    response = []
    for review, customer, plan in reviews:
        response.append({
            "id": review.id,
            "customerName": customer.fullName,
            "planName": plan.name,
            "rating": review.rating,
            "reviewText": review.reviewText,
            "createdAt": review.createdAt,
            "profilePictureUrl": customer.profilePictureUrl
        })
        
    return response

@router.get("/recent", response_model=List[schemas.ReviewResponse])
def get_recent_reviews(limit: int = 5, db: Session = Depends(get_db)):
    """Fetch the most recent reviews across all plans (e.g., for the homepage)."""
    
    reviews = db.query(models.Review, models.CustomerProfile, models.MealPlanCatalog).join(
        models.CustomerProfile, models.Review.customerId == models.CustomerProfile.userId
    ).join(
        models.MealPlanCatalog, models.Review.planId == models.MealPlanCatalog.id
    ).order_by(
        models.Review.createdAt.desc()
    ).limit(limit).all()

    response = []
    for review, customer, plan in reviews:
        response.append({
            "id": review.id,
            "customerName": customer.fullName,
            "planName": plan.name,
            "rating": review.rating,
            "reviewText": review.reviewText,
            "createdAt": review.createdAt,
            "profilePictureUrl": customer.profilePictureUrl
        })
        
    return response