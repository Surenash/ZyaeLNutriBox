from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime
import os
import sys
import traceback

from api.database import engine, get_db, Base
from api import models, schemas
import time

app = FastAPI(
    title="ZyaeL NutriBox API",
    json_encoders={}, 
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to track database initialization status
db_initialized = False
db_init_error = None

# Database initialization and auto-seed on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables and seed if empty (with robust retry logic for production)"""
    global db_initialized, db_init_error
    
    # Production-safe settings (longer timeouts for Neon cold starts)
    max_retries = 8  # More retries for production
    retry_delay = 5  # Longer delay between retries
    is_production = os.getenv("NODE_ENV") == "production" or os.getenv("REPL_DEPLOYMENT") == "1"
    
    print("\n" + "="*60)
    print("🚀 ZyaeL NutriBox API Starting Up")
    print(f"   Environment: {'PRODUCTION' if is_production else 'DEVELOPMENT'}")
    print(f"   Database URL: {os.getenv('DATABASE_URL', 'Not Set')[:50]}...")
    print("="*60 + "\n")
    
    for attempt in range(max_retries):
        try:
            print(f"🔄 Database initialization attempt {attempt + 1}/{max_retries}...")
            
            # Step 1: Create tables if they don't exist
            print("   📋 Creating/verifying database tables...")
            Base.metadata.create_all(bind=engine)
            print("   ✅ Database tables created/verified successfully")
            
            # Step 2: Check and seed if empty
            print("   🔍 Checking if database needs seeding...")
            db = next(get_db())
            try:
                meal_plan_count = db.query(models.MealPlan).count()
                print(f"   📊 Found {meal_plan_count} meal plans in database")
                
                if meal_plan_count == 0:
                    print("\n   📦 Database is EMPTY - Starting auto-seed process...")
                    print("   " + "-"*50)
                    from api.seed_data import seed_database
                    seed_database()
                    print("   " + "-"*50)
                    print("   ✅ AUTO-SEED COMPLETED SUCCESSFULLY!\n")
                    
                    # Verify seeding worked
                    final_count = db.query(models.MealPlan).count()
                    print(f"   ✓ Verification: Database now has {final_count} meal plans")
                else:
                    print(f"   ✓ Database already initialized with {meal_plan_count} meal plans")
            finally:
                db.close()
            
            # Success!
            db_initialized = True
            print("\n" + "="*60)
            print("✅ DATABASE INITIALIZATION COMPLETE")
            print("="*60 + "\n")
            break
            
        except Exception as e:
            error_msg = str(e)
            error_trace = traceback.format_exc()
            
            if attempt < max_retries - 1:
                print(f"\n⚠️  Attempt {attempt + 1} failed: {error_msg}")
                print(f"   Retrying in {retry_delay} seconds...\n")
                time.sleep(retry_delay)
            else:
                db_init_error = error_msg
                print("\n" + "="*60)
                print(f"❌ DATABASE INITIALIZATION FAILED AFTER {max_retries} ATTEMPTS")
                print("="*60)
                print(f"Error: {error_msg}")
                print("\nFull traceback:")
                print(error_trace)
                print("="*60)
                print("⚠️  API will start but database operations WILL FAIL")
                print("   Please check database connection and try manual seeding")
                print("="*60 + "\n")
                sys.stdout.flush()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

# Orders endpoints
@app.post("/orders", response_model=schemas.OrderResponse, response_model_by_alias=True)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(**order.model_dump())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders", response_model=List[schemas.OrderResponse], response_model_by_alias=True)
def get_orders(
    status: Optional[str] = None, 
    kitchen_status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Order)
    if status:
        query = query.filter(models.Order.status == status)
    if kitchen_status:
        query = query.filter(models.Order.kitchen_status == kitchen_status)
    return query.all()

@app.get("/orders/{order_id}", response_model=schemas.OrderResponse, response_model_by_alias=True)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.patch("/orders/{order_id}", response_model=schemas.OrderResponse, response_model_by_alias=True)
def update_order(order_id: str, updates: schemas.OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(order, key, value)
    
    db.commit()
    db.refresh(order)
    return order

# Kitchen queue endpoints
@app.post("/kitchen/queue", response_model=schemas.KitchenQueueResponse, response_model_by_alias=True)
def create_kitchen_queue(item: schemas.KitchenQueueCreate, db: Session = Depends(get_db)):
    db_item = models.KitchenQueue(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/kitchen/queue", response_model=List[schemas.KitchenQueueResponse], response_model_by_alias=True)
def get_kitchen_queue(db: Session = Depends(get_db)):
    return db.query(models.KitchenQueue).all()

@app.patch("/kitchen/queue/{queue_id}", response_model=schemas.KitchenQueueResponse, response_model_by_alias=True)
def update_kitchen_queue(queue_id: str, updates: schemas.KitchenQueueUpdate, db: Session = Depends(get_db)):
    item = db.query(models.KitchenQueue).filter(models.KitchenQueue.id == queue_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    return item

# Delivery agents endpoints
@app.post("/delivery-agents", response_model=schemas.DeliveryAgentResponse, response_model_by_alias=True)
def create_delivery_agent(agent: schemas.DeliveryAgentCreate, db: Session = Depends(get_db)):
    db_agent = models.DeliveryAgent(**agent.model_dump())
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@app.get("/delivery-agents", response_model=List[schemas.DeliveryAgentResponse], response_model_by_alias=True)
def get_delivery_agents(db: Session = Depends(get_db)):
    return db.query(models.DeliveryAgent).all()

@app.get("/delivery-agents/available", response_model=List[schemas.DeliveryAgentResponse], response_model_by_alias=True)
def get_available_agents(db: Session = Depends(get_db)):
    return db.query(models.DeliveryAgent).filter(models.DeliveryAgent.is_available == True).all()

@app.patch("/delivery-agents/{agent_id}", response_model=schemas.DeliveryAgentResponse, response_model_by_alias=True)
def update_delivery_agent(agent_id: str, updates: schemas.DeliveryAgentUpdate, db: Session = Depends(get_db)):
    agent = db.query(models.DeliveryAgent).filter(models.DeliveryAgent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(agent, key, value)
    
    db.commit()
    db.refresh(agent)
    return agent

# Delivery tracking endpoints
@app.post("/delivery-tracking", response_model=schemas.DeliveryTrackingResponse, response_model_by_alias=True)
def create_delivery_tracking(tracking: schemas.DeliveryTrackingCreate, db: Session = Depends(get_db)):
    db_tracking = models.DeliveryTracking(**tracking.model_dump())
    db.add(db_tracking)
    db.commit()
    db.refresh(db_tracking)
    return db_tracking

@app.get("/delivery-tracking", response_model=List[schemas.DeliveryTrackingResponse], response_model_by_alias=True)
def get_delivery_tracking(order_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.DeliveryTracking)
    if order_id:
        query = query.filter(models.DeliveryTracking.order_id == order_id)
    return query.all()

@app.patch("/delivery-tracking/{tracking_id}", response_model=schemas.DeliveryTrackingResponse, response_model_by_alias=True)
async def update_delivery_tracking(tracking_id: str, updates: schemas.DeliveryTrackingUpdate, db: Session = Depends(get_db)):
    tracking = db.query(models.DeliveryTracking).filter(models.DeliveryTracking.id == tracking_id).first()
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tracking, key, value)
    
    db.commit()
    db.refresh(tracking)
    
    # Broadcast location update via WebSocket
    await manager.broadcast({
        "type": "location_update",
        "trackingId": tracking_id,
        "orderId": tracking.order_id,
        "lat": tracking.current_latitude,
        "lng": tracking.current_longitude,
        "timestamp": datetime.now().isoformat()
    })
    
    return tracking

# Meal Plan endpoints
@app.post("/meal-plans", response_model=schemas.MealPlanResponse, response_model_by_alias=True)
def create_meal_plan(meal_plan: schemas.MealPlanCreate, db: Session = Depends(get_db)):
    db_meal_plan = models.MealPlan(**meal_plan.model_dump())
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    return db_meal_plan

@app.get("/meal-plans", response_model=List[schemas.MealPlanResponse], response_model_by_alias=True)
def get_meal_plans(is_active: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(models.MealPlan)
    if is_active is not None:
        query = query.filter(models.MealPlan.is_active == is_active)
    return query.all()

@app.get("/meal-plans/{meal_plan_id}", response_model=schemas.MealPlanResponse, response_model_by_alias=True)
def get_meal_plan(meal_plan_id: str, db: Session = Depends(get_db)):
    meal_plan = db.query(models.MealPlan).filter(models.MealPlan.id == meal_plan_id).first()
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return meal_plan

@app.patch("/meal-plans/{meal_plan_id}", response_model=schemas.MealPlanResponse, response_model_by_alias=True)
def update_meal_plan(meal_plan_id: str, updates: schemas.MealPlanUpdate, db: Session = Depends(get_db)):
    meal_plan = db.query(models.MealPlan).filter(models.MealPlan.id == meal_plan_id).first()
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(meal_plan, key, value)
    
    db.commit()
    db.refresh(meal_plan)
    return meal_plan

@app.delete("/meal-plans/{meal_plan_id}")
def delete_meal_plan(meal_plan_id: str, db: Session = Depends(get_db)):
    meal_plan = db.query(models.MealPlan).filter(models.MealPlan.id == meal_plan_id).first()
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    db.delete(meal_plan)
    db.commit()
    return {"message": "Meal plan deleted successfully"}

# Subscription endpoints
@app.post("/subscriptions", response_model=schemas.SubscriptionResponse, response_model_by_alias=True)
def create_subscription(subscription: schemas.SubscriptionCreate, db: Session = Depends(get_db)):
    db_subscription = models.Subscription(**subscription.model_dump())
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription

@app.get("/subscriptions", response_model=List[schemas.SubscriptionResponse], response_model_by_alias=True)
def get_subscriptions(user_id: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Subscription)
    if user_id:
        query = query.filter(models.Subscription.user_id == user_id)
    if status:
        query = query.filter(models.Subscription.status == status)
    return query.all()

@app.patch("/subscriptions/{subscription_id}", response_model=schemas.SubscriptionResponse, response_model_by_alias=True)
def update_subscription(subscription_id: str, updates: schemas.SubscriptionUpdate, db: Session = Depends(get_db)):
    subscription = db.query(models.Subscription).filter(models.Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(subscription, key, value)
    
    db.commit()
    db.refresh(subscription)
    return subscription

# Nutritionist endpoints
@app.post("/nutritionists", response_model=schemas.NutritionistResponse, response_model_by_alias=True)
def create_nutritionist(nutritionist: schemas.NutritionistCreate, db: Session = Depends(get_db)):
    db_nutritionist = models.Nutritionist(**nutritionist.model_dump())
    db.add(db_nutritionist)
    db.commit()
    db.refresh(db_nutritionist)
    return db_nutritionist

@app.get("/nutritionists", response_model=List[schemas.NutritionistResponse], response_model_by_alias=True)
def get_nutritionists(is_available: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(models.Nutritionist)
    if is_available is not None:
        query = query.filter(models.Nutritionist.is_available == is_available)
    return query.all()

@app.get("/nutritionists/{nutritionist_id}", response_model=schemas.NutritionistResponse, response_model_by_alias=True)
def get_nutritionist(nutritionist_id: str, db: Session = Depends(get_db)):
    nutritionist = db.query(models.Nutritionist).filter(models.Nutritionist.id == nutritionist_id).first()
    if not nutritionist:
        raise HTTPException(status_code=404, detail="Nutritionist not found")
    return nutritionist

@app.patch("/nutritionists/{nutritionist_id}", response_model=schemas.NutritionistResponse, response_model_by_alias=True)
def update_nutritionist(nutritionist_id: str, updates: schemas.NutritionistUpdate, db: Session = Depends(get_db)):
    nutritionist = db.query(models.Nutritionist).filter(models.Nutritionist.id == nutritionist_id).first()
    if not nutritionist:
        raise HTTPException(status_code=404, detail="Nutritionist not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(nutritionist, key, value)
    
    db.commit()
    db.refresh(nutritionist)
    return nutritionist

# Client endpoints
@app.post("/clients", response_model=schemas.ClientResponse, response_model_by_alias=True)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = models.Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/clients", response_model=List[schemas.ClientResponse], response_model_by_alias=True)
def get_clients(nutritionist_id: Optional[str] = None, user_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Client)
    if nutritionist_id:
        query = query.filter(models.Client.nutritionist_id == nutritionist_id)
    if user_id:
        query = query.filter(models.Client.user_id == user_id)
    return query.all()

@app.get("/clients/{client_id}", response_model=schemas.ClientResponse, response_model_by_alias=True)
def get_client(client_id: str, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@app.patch("/clients/{client_id}", response_model=schemas.ClientResponse, response_model_by_alias=True)
def update_client(client_id: str, updates: schemas.ClientUpdate, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(client, key, value)
    
    db.commit()
    db.refresh(client)
    return client

# Session endpoints
@app.post("/sessions", response_model=schemas.SessionResponse, response_model_by_alias=True)
def create_session(session: schemas.SessionCreate, db: Session = Depends(get_db)):
    db_session = models.Session(**session.model_dump())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@app.get("/sessions", response_model=List[schemas.SessionResponse], response_model_by_alias=True)
def get_sessions(
    client_id: Optional[str] = None, 
    nutritionist_id: Optional[str] = None, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Session)
    if client_id:
        query = query.filter(models.Session.client_id == client_id)
    if nutritionist_id:
        query = query.filter(models.Session.nutritionist_id == nutritionist_id)
    if status:
        query = query.filter(models.Session.status == status)
    return query.all()

@app.patch("/sessions/{session_id}", response_model=schemas.SessionResponse, response_model_by_alias=True)
def update_session(session_id: str, updates: schemas.SessionUpdate, db: Session = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(session, key, value)
    
    db.commit()
    db.refresh(session)
    return session

# Progress Log endpoints
@app.post("/progress-logs", response_model=schemas.ProgressLogResponse, response_model_by_alias=True)
def create_progress_log(log: schemas.ProgressLogCreate, db: Session = Depends(get_db)):
    db_log = models.ProgressLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@app.get("/progress-logs", response_model=List[schemas.ProgressLogResponse], response_model_by_alias=True)
def get_progress_logs(client_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.ProgressLog)
    if client_id:
        query = query.filter(models.ProgressLog.client_id == client_id)
    return query.order_by(models.ProgressLog.log_date.desc()).all()

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast to all connected clients
            await manager.broadcast(message)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/admin/seed-database")
def seed_database_endpoint(db: Session = Depends(get_db)):
    """
    Seed the database with sample data. 
    Warning: This will clear all existing data first!
    """
    try:
        from api.seed_data import seed_database
        seed_database()
        return {
            "message": "Database seeded successfully", 
            "status": "success",
            "data": {
                "meal_plans": 9,
                "nutritionists": 4,
                "clients": 4,
                "sessions": 3,
                "progress_logs": 12
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")

@app.get("/")
def root(db: Session = Depends(get_db)):
    """
    API Health Check with Database Status
    """
    try:
        # Check database connection and count records
        meal_plan_count = db.query(models.MealPlan).count()
        nutritionist_count = db.query(models.Nutritionist).count()
        
        return {
            "message": "ZyaeL NutriBox API",
            "status": "running",
            "database": {
                "initialized": db_initialized,
                "connected": True,
                "error": db_init_error,
                "meal_plans": meal_plan_count,
                "nutritionists": nutritionist_count
            },
            "environment": os.getenv("NODE_ENV", "development")
        }
    except Exception as e:
        return {
            "message": "ZyaeL NutriBox API",
            "status": "running",
            "database": {
                "initialized": db_initialized,
                "connected": False,
                "error": str(e),
                "meal_plans": 0,
                "nutritionists": 0
            },
            "environment": os.getenv("NODE_ENV", "development")
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
