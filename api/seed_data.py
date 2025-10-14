from sqlalchemy.orm import Session
from api.database import SessionLocal
from api import models
from datetime import datetime

def seed_database():
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(models.DeliveryTracking).delete()
        db.query(models.KitchenQueue).delete()
        db.query(models.Order).delete()
        db.query(models.DeliveryAgent).delete()
        db.commit()
        
        # Create delivery agents
        agent1 = models.DeliveryAgent(
            id="agent-1",
            name="Raj Kumar",
            phone="+91 98765 43210",
            vehicle_type="Bike",
            vehicle_number="KA-01-AB-1234",
            current_latitude="12.9716",
            current_longitude="77.5946",
            is_available=True,
            total_deliveries=156,
            rating=4.8
        )
        
        agent2 = models.DeliveryAgent(
            id="agent-2",
            name="Priya Singh",
            phone="+91 98765 43211",
            vehicle_type="Scooter",
            vehicle_number="KA-01-CD-5678",
            current_latitude="12.9352",
            current_longitude="77.6245",
            is_available=True,
            total_deliveries=203,
            rating=4.9
        )
        
        db.add_all([agent1, agent2])
        
        # Create sample orders
        order1 = models.Order(
            id="order-1",
            client_name="Ananya Sharma",
            client_email="ananya@example.com",
            client_phone="+91 98765 11111",
            client_address="123 MG Road, Bengaluru, Karnataka 560001",
            diet_plan="Weight Loss",
            meal_type="Breakfast",
            price=299.00,
            status="pending",
            kitchen_status="pending"
        )
        
        order2 = models.Order(
            id="order-2",
            client_name="Rohan Mehta",
            client_email="rohan@example.com",
            client_phone="+91 98765 22222",
            client_address="456 Koramangala, Bengaluru, Karnataka 560034",
            diet_plan="Muscle Gain",
            meal_type="Lunch",
            price=399.00,
            status="pending",
            kitchen_status="pending"
        )
        
        db.add_all([order1, order2])
        
        # Create kitchen queue items
        queue1 = models.KitchenQueue(
            id="queue-1",
            order_id="order-1",
            meal_name="Oats Porridge with Fruits",
            meal_type="Breakfast",
            diet_plan="Weight Loss",
            special_instructions="No sugar",
            status="pending",
            prep_time_minutes=15
        )
        
        queue2 = models.KitchenQueue(
            id="queue-2",
            order_id="order-2",
            meal_name="Grilled Chicken with Quinoa",
            meal_type="Lunch",
            diet_plan="Muscle Gain",
            special_instructions="Extra protein",
            status="pending",
            prep_time_minutes=25
        )
        
        db.add_all([queue1, queue2])
        
        db.commit()
        print("✅ Database seeded successfully!")
        print(f"  - Created {db.query(models.DeliveryAgent).count()} delivery agents")
        print(f"  - Created {db.query(models.Order).count()} orders")
        print(f"  - Created {db.query(models.KitchenQueue).count()} kitchen queue items")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
