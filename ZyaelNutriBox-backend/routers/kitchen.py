from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
import random
from typing import List

from db import get_db
import models, schemas

router = APIRouter(
    prefix="/api/kitchen",
    tags=["Kitchen Portal"]
)

# --- Mock Authentication Dependency ---
def get_current_kitchen_user(user_id: str):
    """Pass ?user_id=KTCH-XXXX in the URL for testing."""
    if not user_id or not user_id.startswith("KTCH"):
        raise HTTPException(status_code=401, detail="Unauthorized. Must be a Kitchen Admin.")
    return user_id


# ==========================================
# 1. MENU MANAGEMENT & 1-HOUR LOCK
# ==========================================

@router.post("/menu")
def update_daily_menu(data: schemas.MenuCreate, user_id: str = Depends(get_current_kitchen_user), db: Session = Depends(get_db)):
    """Create or update a daily meal plan. Enforces the 1-hour prep lock."""
    now = datetime.now()
    
    # Define meal deadlines (e.g., Breakfast at 8am, Lunch at 1pm, Dinner at 7pm)
    meal_deadlines = {
        models.MealTypeEnum.BREAKFAST: 8,
        models.MealTypeEnum.LUNCH: 13,
        models.MealTypeEnum.DINNER: 19
    }
    
    # Check 1-hour lock if the target date is today
    if data.targetDate == now.date():
        deadline_hour = meal_deadlines.get(data.mealType, 0)
        if now.hour >= (deadline_hour - 1):
            raise HTTPException(
                status_code=400, 
                detail=f"Menu Locked! Must update at least 1 hour before {data.mealType.value}."
            )

    # Check if a menu already exists for this date and meal type
    menu = db.query(models.DailyMenu).filter(
        models.DailyMenu.targetDate == data.targetDate,
        models.DailyMenu.mealType == data.mealType
    ).first()

    if menu:
        menu.defaultMealName = data.defaultMealName
        menu.proteinGrams = data.proteinGrams
        menu.carbsGrams = data.carbsGrams
        menu.fatGrams = data.fatGrams
    else:
        menu = models.DailyMenu(**data.dict())
        db.add(menu)

    db.commit()
    return {"message": f"{data.mealType.value} menu updated successfully!"}


# ==========================================
# 2. ACTIVE ORDERS & CUSTOMIZATION
# ==========================================

@router.get("/orders", response_model=List[schemas.KitchenOrderResponse])
def get_active_orders(user_id: str = Depends(get_current_kitchen_user), db: Session = Depends(get_db)):
    """Fetch orders that need to be cooked (PENDING or COOKING)."""
    tickets = db.query(models.OrderTicket, models.CustomerProfile, models.DailyMenu).join(
        models.CustomerProfile, models.OrderTicket.customerId == models.CustomerProfile.userId
    ).join(
        models.DailyMenu, models.OrderTicket.menuId == models.DailyMenu.id
    ).filter(
        models.OrderTicket.status.in_([models.OrderStatusEnum.PENDING, models.OrderStatusEnum.COOKING])
    ).order_by(
        models.OrderTicket.priority.desc(), # High priority first
        models.OrderTicket.createdAt.asc()  # Oldest first
    ).all()

    response = []
    for ticket, customer, menu in tickets:
        response.append({
            "id": ticket.id,
            "targetDate": menu.targetDate,
            "mealType": menu.mealType.value,
            "customerName": customer.fullName,
            "dietaryTags": customer.dietaryTags,
            "mealName": ticket.customMealName if ticket.customMealName else menu.defaultMealName,
            "instructions": ticket.customInstructions,
            "status": ticket.status.value,
            "priority": ticket.priority.value,
            "createdAt": ticket.createdAt
        })
    return response

@router.put("/orders/{order_id}/customize")
def customize_customer_meal(order_id: str, data: schemas.KitchenOrderCustomize, user_id: str = Depends(get_current_kitchen_user), db: Session = Depends(get_db)):
    """Allow kitchen to alter a specific customer's meal based on their dietary tags."""
    ticket = db.query(models.OrderTicket).filter(models.OrderTicket.id == order_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Order not found")
        
    ticket.customMealName = data.customMealName
    ticket.customInstructions = data.customInstructions
    db.commit()
    return {"message": "Meal customized successfully"}

@router.put("/orders/{order_id}/priority")
def update_priority(order_id: str, data: schemas.KitchenOrderUpdatePriority, user_id: str = Depends(get_current_kitchen_user), db: Session = Depends(get_db)):
    """Bump an order to High Priority."""
    ticket = db.query(models.OrderTicket).filter(models.OrderTicket.id == order_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Order not found")
        
    ticket.priority = data.priority
    db.commit()
    return {"message": "Priority updated"}


# ==========================================
# 3. ORDER STATUS & DISPATCH (OTP HANDOFF)
# ==========================================

@router.put("/orders/{order_id}/status")
def update_status(order_id: str, data: schemas.KitchenOrderUpdateStatus, user_id: str = Depends(get_current_kitchen_user), db: Session = Depends(get_db)):
    """Update cooking status. If READY, generate OTP and assign driver."""
    ticket = db.query(models.OrderTicket).filter(models.OrderTicket.id == order_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Order not found")
        
    ticket.status = data.status
    
    # When food is READY, prepare it for dispatch handoff
    if data.status == models.OrderStatusEnum.READY and not ticket.pickupOtp:
        # Generate a 4-digit OTP for the driver handoff
        ticket.pickupOtp = str(random.randint(1000, 9999))
        
        # MOCK DISPATCH LOGIC: Assign to a random active driver
        active_driver = db.query(models.DriverProfile).filter(models.DriverProfile.isActive == True).first()
        if active_driver:
            ticket.assignedDriverId = active_driver.userId

    db.commit()
    return {"message": f"Order status updated to {data.status.value}"}

@router.get("/dispatch", response_model=List[schemas.KitchenDispatchResponse])
def get_dispatch_board(user_id: str = Depends(get_current_kitchen_user), db: Session = Depends(get_db)):
    """Fetch orders waiting for driver pickup."""
    tickets = db.query(models.OrderTicket, models.CustomerProfile, models.DriverProfile).join(
        models.CustomerProfile, models.OrderTicket.customerId == models.CustomerProfile.userId
    ).outerjoin( # Outer join in case no driver is assigned yet
        models.DriverProfile, models.OrderTicket.assignedDriverId == models.DriverProfile.userId
    ).filter(
        models.OrderTicket.status == models.OrderStatusEnum.READY
    ).all()

    response = []
    for ticket, customer, driver in tickets:
        response.append({
            "orderId": ticket.id,
            "customerName": customer.fullName,
            "driverName": driver.fullName if driver else "Waiting for Assignment",
            "driverPhone": driver.phoneNumber if driver else "N/A",
            "status": ticket.status.value,
            "otp": ticket.pickupOtp if ticket.pickupOtp else "----"
        })
    return response


# ==========================================
# 4. CUSTOMER TIMELINE (MACRO INTAKE)
# ==========================================

@router.get("/customer/{customer_id}/timeline", response_model=schemas.KitchenCustomerTimeline)
def get_customer_timeline(customer_id: str, user_id: str = Depends(get_current_kitchen_user), db: Session = Depends(get_db)):
    """Allow kitchen to check if the user has eaten today and their macros."""
    customer = db.query(models.CustomerProfile).filter(models.CustomerProfile.userId == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Fetch all delivered/eaten meals for today
    today = date.today()
    tickets = db.query(models.OrderTicket, models.DailyMenu).join(
        models.DailyMenu, models.OrderTicket.menuId == models.DailyMenu.id
    ).filter(
        models.OrderTicket.customerId == customer_id,
        func.date(models.OrderTicket.createdAt) == today,
        models.OrderTicket.status == models.OrderStatusEnum.DELIVERED
    ).all()

    total_protein, total_carbs, total_fats = 0, 0, 0
    meals_today = []

    for ticket, menu in tickets:
        total_protein += menu.proteinGrams
        total_carbs += menu.carbsGrams
        total_fats += menu.fatGrams
        
        meals_today.append({
            "mealType": menu.mealType.value,
            "mealName": ticket.customMealName if ticket.customMealName else menu.defaultMealName,
            "deliveredAt": ticket.deliveredAt
        })

    return {
        "customerName": customer.fullName,
        "macrosConsumedToday": {
            "protein": total_protein,
            "carbs": total_carbs,
            "fats": total_fats
        },
        "mealsToday": meals_today
    }