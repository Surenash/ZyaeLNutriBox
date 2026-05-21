from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta
from api.database import get_db
from api import models, schemas
from api.simple_auth import get_current_user_required
from api.connection_manager import manager
from api.events import EventType, EventChannel, EventBuilder
from api.event_store import EventStore
from api.audit_logger import AuditLogger
from api.state_machine import KitchenStatusStateMachine

router = APIRouter(prefix="/kitchen", tags=["Kitchen"])

@router.get("/orders", response_model=List[schemas.OrderResponse])
async def get_kitchen_orders(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Get orders for kitchen management"""
    query = db.query(models.Order)
    
    if status:
        query = query.filter(models.Order.status == status)
    if priority:
        query = query.filter(models.Order.priority == priority)
    
    # Kitchen typically sees pending, preparing, and ready orders
    if not status:
        query = query.filter(models.Order.status.in_(["pending", "preparing", "ready"]))
    
    orders = query.order_by(models.Order.created_at.asc()).offset(skip).limit(limit).all()
    return orders

@router.get("/orders/queue", response_model=List[schemas.OrderResponse])
async def get_kitchen_queue(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Get pending orders in kitchen queue"""
    orders = db.query(models.Order).filter(
        models.Order.status == "pending"
    ).order_by(models.Order.created_at.asc()).all()
    return orders

@router.get("/orders/preparing", response_model=List[schemas.OrderResponse])
async def get_preparing_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Get orders currently being prepared"""
    orders = db.query(models.Order).filter(
        models.Order.status == "preparing"
    ).order_by(models.Order.created_at.asc()).all()
    return orders

@router.get("/orders/ready", response_model=List[schemas.OrderResponse])
async def get_ready_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Get orders ready for pickup"""
    orders = db.query(models.Order).filter(
        models.Order.status == "ready"
    ).order_by(models.Order.created_at.asc()).all()
    return orders

@router.patch("/orders/{order_id}/start-preparing")
async def start_preparing_order(
    order_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Start preparing an order with optimistic locking, state machine validation, and event logging"""
    try:
        # Use with_for_update() to lock the row during update (prevents race conditions)
        order = db.query(models.Order).filter(models.Order.id == order_id).with_for_update().first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Validate state transition using state machine
        from api.state_machine import OrderStateMachine
        OrderStateMachine.validate_transition(order.status, "preparing")
        
        # Store before state
        old_status = order.status
        
        # Update order status atomically
        order.status = "preparing"
        order.kitchen_status = "preparing"
        order.version += 1
        order.prepared_at = datetime.now()
        
        # Log event
        EventStore.append_event(
            db=db,
            aggregate_id=order_id,
            aggregate_type='order',
            event_type=EventType.MEAL_PREPARING,
            payload={
                'order_id': order_id,
                'client_id': order.client_id,
                'old_status': old_status,
                'new_status': 'preparing',
                'meal_type': order.meal_type
            },
            metadata={
                'user_id': current_user.id,
                'user_role': current_user.role,
                'ip_address': request.client.host if request.client else None
            }
        )
        
        # Log to audit log
        AuditLogger.log_update(
            db=db,
            target_type='order',
            target_id=order_id,
            before_state={'status': old_status, 'kitchen_status': order.kitchen_status},
            after_state={'status': 'preparing', 'kitchen_status': 'preparing'},
            user_id=current_user.id,
            user_role=current_user.role,
            request=request
        )
        
        db.commit()
        db.refresh(order)
        
        # Broadcast kitchen order status update
        event_data = EventBuilder.build_event(
            EventType.MEAL_PREPARING,
            {
                'order_id': order_id,
                'status': 'preparing',
                'order': schemas.OrderResponse.model_validate(order).model_dump(mode='json', by_alias=True)
            }
        )
        
        await manager.broadcast_to_channel(EventChannel.KITCHEN, event_data)
        await manager.broadcast_to_channel(
            EventChannel.client(order.client_id),
            event_data
        )
        
        return order
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to start preparing order: {str(e)}")

@router.patch("/orders/{order_id}/mark-ready")
async def mark_order_ready(
    order_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Mark an order as ready for pickup with state machine validation and event logging"""
    try:
        # Lock the row to prevent concurrent updates
        order = db.query(models.Order).filter(models.Order.id == order_id).with_for_update().first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Validate state transition
        KitchenStatusStateMachine.validate_transition(order.kitchen_status, "ready")
        from api.state_machine import OrderStateMachine
        OrderStateMachine.validate_transition(order.status, "ready")
        
        old_status = order.status
        old_kitchen_status = order.kitchen_status
        
        order.status = "ready"
        order.kitchen_status = "ready"
        order.version += 1
        order.packed_at = datetime.now()
        
        # Log event
        EventStore.append_event(
            db=db,
            aggregate_id=order_id,
            aggregate_type='order',
            event_type=EventType.MEAL_PACKED,
            payload={
                'order_id': order_id,
                'client_id': order.client_id,
                'old_status': old_status,
                'new_status': 'ready',
                'old_kitchen_status': old_kitchen_status,
                'new_kitchen_status': 'ready',
                'meal_type': order.meal_type
            },
            metadata={
                'user_id': current_user.id,
                'user_role': current_user.role,
                'ip_address': request.client.host if request.client else None
            }
        )
        
        # Log to audit log
        AuditLogger.log_update(
            db=db,
            target_type='order',
            target_id=order_id,
            before_state={'status': old_status, 'kitchen_status': old_kitchen_status},
            after_state={'status': 'ready', 'kitchen_status': 'ready'},
            user_id=current_user.id,
            user_role=current_user.role,
            request=request
        )
        
        db.commit()
        db.refresh(order)
        
        # Broadcast kitchen order ready
        event_data = EventBuilder.build_event(
            EventType.MEAL_PACKED,
            {
                'order_id': order_id,
                'order': schemas.OrderResponse.model_validate(order).model_dump(mode='json', by_alias=True)
            }
        )
        
        await manager.broadcast_to_channel(EventChannel.KITCHEN, event_data)
        await manager.broadcast_to_channel(EventChannel.ALL_DELIVERY_AGENTS, event_data)
        await manager.broadcast_to_channel(
            EventChannel.client(order.client_id),
            event_data
        )
        
        return order
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to mark order ready: {str(e)}")

@router.patch("/orders/{order_id}/complete")
async def complete_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Mark an order as completed with optimistic locking"""
    try:
        # Lock the row to prevent concurrent updates
        order = db.query(models.Order).filter(models.Order.id == order_id).with_for_update().first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Check current status - prevent race conditions
        if order.status not in ["ready", "preparing"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Order is not ready to be completed. Current status: {order.status}"
            )
        
        order.status = "completed"
        db.commit()
        db.refresh(order)
        
        # Broadcast order completed
        await manager.broadcast({
            "type": "order_completed",
            "data": {
                "order_id": order_id,
                "order": schemas.OrderResponse.model_validate(order).model_dump(mode='json', by_alias=True)
            }
        })
        
        return order
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to complete order: {str(e)}")

@router.get("/stats")
async def get_kitchen_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Get kitchen statistics"""
    pending_count = db.query(models.Order).filter(models.Order.status == "pending").count()
    preparing_count = db.query(models.Order).filter(models.Order.status == "preparing").count()
    ready_count = db.query(models.Order).filter(models.Order.status == "ready").count()
    completed_today = db.query(models.Order).filter(
        models.Order.status == "completed",
        models.Order.created_at >= db.func.date('now')
    ).count()
    
    return {
        "pending_orders": pending_count,
        "preparing_orders": preparing_count,
        "ready_orders": ready_count,
        "completed_today": completed_today,
        "total_active": pending_count + preparing_count + ready_count
    }

@router.get("/orders/{order_id}/details", response_model=schemas.OrderResponse)
async def get_order_details(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Get detailed information about a specific order"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/today-schedule")
async def get_todays_schedule(
    meal_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Get today's meal schedule for kitchen preparation"""
    today = date.today()
    
    # Get today's daily meal schedules
    schedules = db.query(models.DailyMealSchedule).filter(
        models.DailyMealSchedule.date >= datetime.combine(today, datetime.min.time()),
        models.DailyMealSchedule.date < datetime.combine(today + timedelta(days=1), datetime.min.time())
    ).all()
    
    # Get corresponding orders
    orders = db.query(models.Order).filter(
        models.Order.daily_meal_schedule_id.in_([s.id for s in schedules])
    ).all()
    
    # Group by meal type and status
    result = {
        "date": today.isoformat(),
        "breakfast": [],
        "lunch": [],
        "dinner": []
    }
    
    for schedule in schedules:
        client = db.query(models.User).filter(models.User.id == schedule.client_id).first()
        client_name = client.name if client else "Unknown"
        
        # Get orders for this schedule
        schedule_orders = [o for o in orders if o.daily_meal_schedule_id == schedule.id]
        
        meal_data = {
            "schedule_id": schedule.id,
            "client_id": schedule.client_id,
            "client_name": client_name,
            "subscription_id": schedule.subscription_id,
            "orders": []
        }
        
        for order in schedule_orders:
            meal_data["orders"].append({
                "order_id": order.id,
                "meal_type": order.meal_type,
                "status": order.status,
                "kitchen_status": order.kitchen_status,
                "created_at": order.created_at.isoformat(),
                "prepared_at": order.prepared_at.isoformat() if order.prepared_at else None,
                "packed_at": order.packed_at.isoformat() if order.packed_at else None
            })
        
        # Add to appropriate meal type
        if meal_type is None or meal_type == "breakfast":
            if schedule.breakfast_item:
                result["breakfast"].append({
                    **meal_data,
                    "meal_item": schedule.breakfast_item,
                    "calories": schedule.breakfast_calories,
                    "status": schedule.breakfast_status
                })
        
        if meal_type is None or meal_type == "lunch":
            if schedule.lunch_item:
                result["lunch"].append({
                    **meal_data,
                    "meal_item": schedule.lunch_item,
                    "calories": schedule.lunch_calories,
                    "status": schedule.lunch_status
                })
        
        if meal_type is None or meal_type == "dinner":
            if schedule.dinner_item:
                result["dinner"].append({
                    **meal_data,
                    "meal_item": schedule.dinner_item,
                    "calories": schedule.dinner_calories,
                    "status": schedule.dinner_status
                })
    
    return result

@router.patch("/meal/{order_id}/start-preparation")
async def start_meal_preparation(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Start preparing a meal (kitchen workflow) with optimistic locking"""
    try:
        # Lock the row to prevent concurrent updates
        order = db.query(models.Order).filter(models.Order.id == order_id).with_for_update().first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Check current status - prevent race conditions
        if order.status != "pending":
            raise HTTPException(
                status_code=400, 
                detail=f"Order is not in pending status. Current status: {order.status}"
            )
        
        # Update order status
        order.status = "preparing"
        order.kitchen_status = "preparing"
        order.prepared_at = datetime.now()
        
        # Update daily meal schedule status
        if order.daily_meal_schedule_id:
            schedule = db.query(models.DailyMealSchedule).filter(
                models.DailyMealSchedule.id == order.daily_meal_schedule_id
            ).first()
            
            if schedule:
                if order.meal_type == "breakfast":
                    schedule.breakfast_status = "preparing"
                elif order.meal_type == "lunch":
                    schedule.lunch_status = "preparing"
                elif order.meal_type == "dinner":
                    schedule.dinner_status = "preparing"
        
        db.commit()
        db.refresh(order)
        
        # Broadcast meal preparing event
        event_data = EventBuilder.build_event(
            EventType.MEAL_PREPARING,
            {
                "order_id": order_id,
                "client_id": order.client_id,
                "meal_type": order.meal_type,
                "timestamp": datetime.now().isoformat()
            }
        )
        
        # Broadcast to client
        await manager.broadcast_to_channel(
            EventChannel.client(order.client_id),
            event_data
        )
        
        # Broadcast to kitchen
        await manager.broadcast_to_channel(EventChannel.KITCHEN, event_data)
        
        # Broadcast to admin
        await manager.broadcast_to_channel(EventChannel.ADMIN, event_data)
        
        return {
            "message": f"{order.meal_type} preparation started",
            "order_id": order_id,
            "status": "preparing"
        }
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to start preparation: {str(e)}")

@router.patch("/meal/{order_id}/mark-packed")
async def mark_meal_packed(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_required)
):
    """Mark meal as packed and ready for delivery assignment with optimistic locking"""
    try:
        # Lock the row to prevent concurrent updates
        order = db.query(models.Order).filter(models.Order.id == order_id).with_for_update().first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Check current status - prevent race conditions
        if order.status != "preparing":
            raise HTTPException(
                status_code=400, 
                detail=f"Order is not being prepared. Current status: {order.status}"
            )
        
        # Update order status
        order.status = "packed"
        order.kitchen_status = "packed"
        order.packed_at = datetime.now()
        
        # Update daily meal schedule status
        if order.daily_meal_schedule_id:
            schedule = db.query(models.DailyMealSchedule).filter(
                models.DailyMealSchedule.id == order.daily_meal_schedule_id
            ).first()
            
            if schedule:
                if order.meal_type == "breakfast":
                    schedule.breakfast_status = "packed"
                elif order.meal_type == "lunch":
                    schedule.lunch_status = "packed"
                elif order.meal_type == "dinner":
                    schedule.dinner_status = "packed"
        
        db.commit()
        db.refresh(order)
        
        # Broadcast meal packed event
        event_data = EventBuilder.build_event(
            EventType.MEAL_PACKED,
            {
                "order_id": order_id,
                "client_id": order.client_id,
                "meal_type": order.meal_type,
                "timestamp": datetime.now().isoformat()
            }
        )
        
        # Broadcast to client
        await manager.broadcast_to_channel(
            EventChannel.client(order.client_id),
            event_data
        )
        
        # Broadcast to kitchen
        await manager.broadcast_to_channel(EventChannel.KITCHEN, event_data)
        
        # Broadcast to all delivery agents
        await manager.broadcast_to_channel(EventChannel.ALL_DELIVERY_AGENTS, event_data)
        
        # Broadcast to admin
        await manager.broadcast_to_channel(EventChannel.ADMIN, event_data)
        
        # Auto-assign delivery agent
        await _auto_assign_delivery_agent(order, db)
        
        return {
            "message": f"{order.meal_type} marked as packed",
            "order_id": order_id,
            "status": "packed"
        }
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to mark as packed: {str(e)}")

async def _auto_assign_delivery_agent(order: models.Order, db: Session):
    """Auto-assign nearest available delivery agent"""
    try:
        # Find nearest available delivery agent
        available_agents = db.query(models.DeliveryAgent).filter(
            models.DeliveryAgent.is_available == True
        ).all()
        
        if not available_agents:
            # No available agents, keep order in packed status
            return
        
        # For now, assign the first available agent
        # In production, you'd calculate distance and assign nearest
        agent = available_agents[0]
        
        # Update order with delivery assignment
        order.delivery_agent_id = agent.id
        order.delivery_agent_name = agent.name
        order.status = "assigned"
        order.assigned_at = datetime.now()
        
        # Mark agent as unavailable
        agent.is_available = False
        
        db.commit()
        
        # Broadcast delivery assigned event
        event_data = EventBuilder.delivery_assigned(
            order_id=order.id,
            client_id=order.client_id,
            delivery_agent_id=agent.id,
            delivery_agent_name=agent.name
        )
        
        # Broadcast to client
        await manager.broadcast_to_channel(
            EventChannel.client(order.client_id),
            event_data
        )
        
        # Broadcast to delivery agent
        await manager.broadcast_to_channel(
            EventChannel.delivery_agent(agent.id),
            event_data
        )
        
        # Broadcast to kitchen and admin
        await manager.broadcast_to_channel(EventChannel.KITCHEN, event_data)
        await manager.broadcast_to_channel(EventChannel.ADMIN, event_data)
        
    except Exception as e:
        print(f"Failed to auto-assign delivery agent: {e}")
        # Don't raise exception as this is a background process
