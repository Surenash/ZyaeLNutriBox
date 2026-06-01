from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db import get_db
import models, schemas

router = APIRouter(
    prefix="/api/mealplans",
    tags=["Meal Plan Catalog"]
)

@router.get("/", response_model=List[schemas.MealPlanResponse])
def get_all_mealplans(db: Session = Depends(get_db)):
    """
    Fetch meal plans for the public landing page.
    Returns only promoted plans if any exist, otherwise falls back to all plans.
    The frontend also filters client-side, so this provides defense-in-depth.
    """
    all_plans = db.query(models.MealPlanCatalog).all()
    promoted = [p for p in all_plans if p.isPromoted]
    return promoted if promoted else all_plans

@router.get("/all", response_model=List[schemas.MealPlanResponse])
def get_all_mealplans_admin(db: Session = Depends(get_db)):
    """Fetch ALL meal plans (Admin panel use)."""
    return db.query(models.MealPlanCatalog).all()

@router.put("/{plan_id}", response_model=schemas.MealPlanResponse)
def update_mealplan(plan_id: int, data: schemas.MealPlanUpdate, db: Session = Depends(get_db)):
    """Edit a meal plan's details, pricing, or picture (Admin only)."""
    plan = db.query(models.MealPlanCatalog).filter(models.MealPlanCatalog.id == plan_id).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
        
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(plan, key, value)
        
    db.commit()
    db.refresh(plan)
    return plan