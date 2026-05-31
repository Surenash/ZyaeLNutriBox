from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from decimal import Decimal

from db import get_db
import models, schemas

router = APIRouter(
    prefix="/api/delivery",
    tags=["Delivery Portal"]
)

# --- Mock Authentication Dependency ---
def get_current_driver(user_id: str):
    """Pass ?user_id=DELV-XXXX in the URL for MVP testing."""
    if not user_id or not user_id.startswith("DELV"):
        raise HTTPException(status_code=401, detail="Unauthorized. Must be a Delivery Partner.")
    return user_id


# ==========================================
# 1. DRIVER PROFILE & STATUS
# ==========================================

@router.get("/profile")
def get_driver_profile(user_id: str = Depends(get_current_driver), db: Session = Depends(get_db)):
    """Fetch the driver's profile, vehicle details, and total earnings."""
    driver = db.query(models.DriverProfile).filter(models.DriverProfile.userId == user_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
        
    return {
        "userId": driver.userId,
        "fullName": driver.fullName,
        "phoneNumber": driver.phoneNumber,
        "vehicleNumber": driver.vehicleNumber,
        "isActive": driver.isActive,
        "totalEarnings": float(driver.totalEarnings),
        "profilePictureUrl": driver.profilePictureUrl
    }

@router.put("/profile")
def update_driver_profile(data: schemas.DriverProfileUpdate, user_id: str = Depends(get_current_driver), db: Session = Depends(get_db)):
    """Update phone number, vehicle details, and active status."""
    driver = db.query(models.DriverProfile).filter(models.DriverProfile.userId == user_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
        
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(driver, key, value)
        
    db.commit()
    return {"message": "Profile updated successfully"}

@router.put("/status")
def toggle_active_status(data: schemas.DriverStatusUpdate, user_id: str = Depends(get_current_driver), db: Session = Depends(get_db)):
    """Quick toggle to go Online or Offline."""
    driver = db.query(models.DriverProfile).filter(models.DriverProfile.userId == user_id).first()
    driver.isActive = data.isActive
    db.commit()
    return {"message": f"You are now {'ONLINE' if data.isActive else 'OFFLINE'}"}


# ==========================================
# 2. DISPATCH BOARD (FINDING ORDERS)
# ==========================================

@router.get("/available-orders", response_model=List[schemas.DriverOrderResponse])
def get_available_orders(user_id: str = Depends(get_current_driver), db: Session = Depends(get_db)):
    """
    Fetch READY orders that are unassigned OR explicitly assigned to this driver.
    Sorts by HIGH priority first, then oldest.
    """
    tickets = db.query(models.OrderTicket, models.CustomerProfile, models.DailyMenu).join(
        models.CustomerProfile, models.OrderTicket.customerId == models.CustomerProfile.userId
    ).join(
        models.DailyMenu, models.OrderTicket.menuId == models.DailyMenu.id
    ).filter(
        models.OrderTicket.status == models.OrderStatusEnum.READY,
        (models.OrderTicket.assignedDriverId == None) | (models.OrderTicket.assignedDriverId == user_id)
    ).order_by(
        models.OrderTicket.priority.desc(),
        models.OrderTicket.createdAt.asc()
    ).all()

    response = []
    for ticket, customer, menu in tickets:
        response.append({
            "id": ticket.id,
            "customerName": customer.fullName,
            "customerPhone": customer.phoneNumber,
            "addressText": customer.addressText,
            "latitude": float(customer.latitude) if customer.latitude else None,
            "longitude": float(customer.longitude) if customer.longitude else None,
            "mealName": ticket.customMealName if ticket.customMealName else menu.defaultMealName,
            "status": ticket.status,
            "priority": ticket.priority,
            "createdAt": ticket.createdAt
        })
    return response

@router.put("/orders/{order_id}/accept")
def accept_order(order_id: str, user_id: str = Depends(get_current_driver), db: Session = Depends(get_db)):
    """Claim an order from the available pool."""
    ticket = db.query(models.OrderTicket).filter(models.OrderTicket.id == order_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if ticket.assignedDriverId and ticket.assignedDriverId != user_id:
        raise HTTPException(status_code=400, detail="Order has already been claimed by another driver")
        
    ticket.assignedDriverId = user_id
    db.commit()
    return {"message": "Order accepted successfully! Proceed to the kitchen for pickup."}


# ==========================================
# 3. FULFILLMENT (PICKUP & DELIVERY)
# ==========================================

@router.get("/orders/active", response_model=List[schemas.DriverOrderResponse])
def get_my_active_orders(user_id: str = Depends(get_current_driver), db: Session = Depends(get_db)):
    """Fetch the order(s) the driver is currently delivering (IN_TRANSIT)."""
    tickets = db.query(models.OrderTicket, models.CustomerProfile, models.DailyMenu).join(
        models.CustomerProfile, models.OrderTicket.customerId == models.CustomerProfile.userId
    ).join(
        models.DailyMenu, models.OrderTicket.menuId == models.DailyMenu.id
    ).filter(
        models.OrderTicket.assignedDriverId == user_id,
        models.OrderTicket.status == models.OrderStatusEnum.IN_TRANSIT
    ).all()

    response = []
    for ticket, customer, menu in tickets:
        response.append({
            "id": ticket.id,
            "customerName": customer.fullName,
            "customerPhone": customer.phoneNumber,
            "addressText": customer.addressText,
            "latitude": float(customer.latitude) if customer.latitude else None,
            "longitude": float(customer.longitude) if customer.longitude else None,
            "mealName": ticket.customMealName if ticket.customMealName else menu.defaultMealName,
            "status": ticket.status,
            "priority": ticket.priority,
            "createdAt": ticket.createdAt
        })
    return response

@router.put("/orders/{order_id}/pickup")
def verify_pickup_otp(order_id: str, data: schemas.OTPVerification, user_id: str = Depends(get_current_driver), db: Session = Depends(get_db)):
    """Verify OTP with the kitchen to take possession of the food."""
    ticket = db.query(models.OrderTicket).filter(
        models.OrderTicket.id == order_id,
        models.OrderTicket.assignedDriverId == user_id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Assigned order not found")
        
    if ticket.pickupOtp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP. Please check with the kitchen staff.")
        
    # Valid OTP, update status to IN_TRANSIT
    ticket.status = models.OrderStatusEnum.IN_TRANSIT
    db.commit()
    return {"message": "OTP Verified! Proceed to the customer's address."}

@router.put("/orders/{order_id}/deliver")
def mark_as_delivered(order_id: str, user_id: str = Depends(get_current_driver), db: Session = Depends(get_db)):
    """Mark the order as delivered and add delivery fee to earnings."""
    ticket = db.query(models.OrderTicket).filter(
        models.OrderTicket.id == order_id,
        models.OrderTicket.assignedDriverId == user_id,
        models.OrderTicket.status == models.OrderStatusEnum.IN_TRANSIT
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Order not found or not in transit")
        
    # 1. Update Order Status
    ticket.status = models.OrderStatusEnum.DELIVERED
    ticket.deliveredAt = datetime.utcnow()
    
    # 2. Add Earnings to Driver (Flat ₹40 per delivery for MVP)
    driver = db.query(models.DriverProfile).filter(models.DriverProfile.userId == user_id).first()
    delivery_fee = Decimal('40.00')
    driver.totalEarnings = driver.totalEarnings + delivery_fee
    
    db.commit()
    return {
        "message": f"Successfully delivered! You earned ₹{delivery_fee}.",
        "newTotalEarnings": float(driver.totalEarnings)
    }