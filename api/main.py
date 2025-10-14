from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime

from api.database import engine, get_db, Base
from api import models, schemas

# Create database tables
Base.metadata.create_all(bind=engine)

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
@app.post("/orders", response_model=schemas.OrderResponse)
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

@app.get("/orders/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.patch("/orders/{order_id}", response_model=schemas.OrderResponse)
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
@app.post("/kitchen/queue", response_model=schemas.KitchenQueueResponse)
def create_kitchen_queue(item: schemas.KitchenQueueCreate, db: Session = Depends(get_db)):
    db_item = models.KitchenQueue(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/kitchen/queue", response_model=List[schemas.KitchenQueueResponse], response_model_by_alias=True)
def get_kitchen_queue(db: Session = Depends(get_db)):
    return db.query(models.KitchenQueue).all()

@app.patch("/kitchen/queue/{queue_id}", response_model=schemas.KitchenQueueResponse)
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
@app.post("/delivery-agents", response_model=schemas.DeliveryAgentResponse)
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

@app.patch("/delivery-agents/{agent_id}", response_model=schemas.DeliveryAgentResponse)
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
@app.post("/delivery-tracking", response_model=schemas.DeliveryTrackingResponse)
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

@app.patch("/delivery-tracking/{tracking_id}", response_model=schemas.DeliveryTrackingResponse)
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

@app.get("/")
def root():
    return {"message": "ZyaeL NutriBox API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
