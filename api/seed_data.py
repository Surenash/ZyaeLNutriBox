from sqlalchemy.orm import Session
from api.database import SessionLocal
from api import models
from datetime import datetime, timedelta

def seed_database():
    db = SessionLocal()
    
    try:
        # Clear existing data (in correct order due to dependencies)
        print("🧹 Clearing existing data...")
        db.query(models.ProgressLog).delete()
        db.query(models.Session).delete()
        db.query(models.Client).delete()
        db.query(models.Subscription).delete()
        db.query(models.DeliveryTracking).delete()
        db.query(models.KitchenQueue).delete()
        db.query(models.Order).delete()
        db.query(models.DeliveryAgent).delete()
        db.query(models.Nutritionist).delete()
        db.query(models.MealPlan).delete()
        db.commit()
        
        # Seed Meal Plans
        print("\n📋 Seeding Meal Plans...")
        meal_plans = [
            models.MealPlan(
                title="Weight Loss",
                description="Balanced meals to help shed fat effectively",
                category="weight_management",
                original_price=17000,
                current_price=15000,
                rating=4.8,
                review_count=3200,
                badge="Bestseller",
                features="Low calorie, High fiber, Portion controlled",
                is_active=True
            ),
            models.MealPlan(
                title="Muscle Gain",
                description="Protein-rich meals for lean muscle development",
                category="fitness",
                original_price=18000,
                current_price=15000,
                rating=4.7,
                review_count=2800,
                badge="Popular",
                features="High protein, Balanced macros, Post-workout meals",
                is_active=True
            ),
            models.MealPlan(
                title="PCOS Friendly",
                description="Low glycemic meals for health management",
                category="health",
                original_price=16500,
                current_price=15000,
                rating=4.6,
                review_count=2300,
                badge="Recommended",
                features="Low GI, Anti-inflammatory, Hormone balanced",
                is_active=True
            ),
            models.MealPlan(
                title="Vegan / Vegetarian",
                description="Plant-based nourishment for every lifestyle",
                category="dietary_preference",
                original_price=16000,
                current_price=15000,
                rating=4.5,
                review_count=2100,
                badge="Healthy Choice",
                features="100% Plant-based, Protein-rich, Nutrient-dense",
                is_active=True
            ),
            models.MealPlan(
                title="Postpartum Moms",
                description="Meals crafted for new mothers' recovery",
                category="special",
                original_price=17000,
                current_price=15000,
                rating=4.8,
                review_count=1800,
                badge="Mom's Magic",
                features="Lactation support, Iron-rich, Energy boosting",
                is_active=True
            ),
            models.MealPlan(
                title="Senior Citizens",
                description="Gentle, nutritious meals for healthy aging",
                category="age_specific",
                original_price=16500,
                current_price=15000,
                rating=4.9,
                review_count=1500,
                badge="Trusted by Families",
                features="Easy to digest, Heart healthy, Bone strengthening",
                is_active=True
            ),
            models.MealPlan(
                title="Diabetic Friendly Meals",
                description="Gentle, nutritious meals for health management",
                category="health",
                original_price=16500,
                current_price=15000,
                rating=4.9,
                review_count=1500,
                badge="Trusted by Families",
                features="Low sugar, Controlled carbs, Blood sugar friendly",
                is_active=True
            ),
            models.MealPlan(
                title="Kids Nutrition",
                description="Tasty & healthy meals for growing kids",
                category="age_specific",
                original_price=16000,
                current_price=15000,
                rating=4.6,
                review_count=1200,
                badge="Coming Soon",
                features="Fun & nutritious, Growth focused, Picky-eater approved",
                is_active=True
            ),
            models.MealPlan(
                title="Recovery Meals",
                description="Special diet meals for patients during recovery",
                category="health",
                original_price=16500,
                current_price=15000,
                rating=4.7,
                review_count=1100,
                badge="Doctor Approved",
                features="Nutrient-dense, Immune boosting, Easy digestion",
                is_active=True
            )
        ]
        db.add_all(meal_plans)
        db.commit()
        
        # Seed Nutritionists
        print("👨‍⚕️ Seeding Nutritionists...")
        nutritionists = [
            models.Nutritionist(
                name="Dr. Priya Sharma",
                email="priya.sharma@zyael.com",
                phone="+91-9876543210",
                specialization="Weight Management & Sports Nutrition",
                bio="15+ years of experience helping athletes and individuals achieve their health goals.",
                experience_years=15,
                rating=4.9,
                total_clients=247,
                is_available=True
            ),
            models.Nutritionist(
                name="Rahul Menon",
                email="rahul.menon@zyael.com",
                phone="+91-9876543211",
                specialization="Clinical Nutrition & Diabetes Management",
                bio="Certified clinical nutritionist specializing in managing chronic conditions.",
                experience_years=12,
                rating=4.8,
                total_clients=189,
                is_available=True
            ),
            models.Nutritionist(
                name="Ananya Patel",
                email="ananya.patel@zyael.com",
                phone="+91-9876543212",
                specialization="PCOS & Hormonal Health",
                bio="Expert in women's health nutrition with focus on PCOS and hormonal balance.",
                experience_years=10,
                rating=4.9,
                total_clients=156,
                is_available=True
            ),
            models.Nutritionist(
                name="Vikram Singh",
                email="vikram.singh@zyael.com",
                phone="+91-9876543213",
                specialization="Pediatric Nutrition",
                bio="Dedicated to helping children develop healthy eating habits.",
                experience_years=8,
                rating=4.7,
                total_clients=123,
                is_available=True
            )
        ]
        db.add_all(nutritionists)
        db.commit()
        
        # Seed Clients
        print("👤 Seeding Clients...")
        clients = [
            models.Client(
                user_id="user-001",
                nutritionist_id=nutritionists[0].id,
                weight_start=85.0,
                weight_current=82.0,
                weight_goal=75.0,
                height=175.0,
                age=32,
                gender="Male",
                health_conditions="None",
                dietary_preferences="Non-vegetarian"
            ),
            models.Client(
                user_id="user-002",
                nutritionist_id=nutritionists[0].id,
                weight_start=72.0,
                weight_current=68.0,
                weight_goal=65.0,
                height=162.0,
                age=28,
                gender="Female",
                health_conditions="PCOS",
                dietary_preferences="Vegetarian"
            ),
            models.Client(
                user_id="user-003",
                nutritionist_id=nutritionists[1].id,
                weight_start=92.0,
                weight_current=88.0,
                weight_goal=78.0,
                height=180.0,
                age=35,
                gender="Male",
                health_conditions="Type 2 Diabetes",
                dietary_preferences="Non-vegetarian"
            ),
            models.Client(
                user_id="user-004",
                nutritionist_id=nutritionists[2].id,
                weight_start=68.0,
                weight_current=66.0,
                weight_goal=62.0,
                height=165.0,
                age=26,
                gender="Female",
                health_conditions="PCOS, Thyroid",
                dietary_preferences="Vegetarian"
            )
        ]
        db.add_all(clients)
        db.commit()
        
        # Seed Sessions
        print("📅 Seeding Sessions...")
        now = datetime.now()
        sessions = [
            # Upcoming sessions
            models.Session(
                client_id=clients[0].id,
                nutritionist_id=nutritionists[0].id,
                session_date=now + timedelta(days=1, hours=10),
                duration_minutes=30,
                status="scheduled",
                meeting_link=f"https://meet.zyael.com/session-{clients[0].id[-6:]}"
            ),
            models.Session(
                client_id=clients[1].id,
                nutritionist_id=nutritionists[0].id,
                session_date=now + timedelta(days=2, hours=14),
                duration_minutes=30,
                status="scheduled",
                meeting_link=f"https://meet.zyael.com/session-{clients[1].id[-6:]}"
            ),
            # Past sessions
            models.Session(
                client_id=clients[0].id,
                nutritionist_id=nutritionists[0].id,
                session_date=now - timedelta(days=7),
                duration_minutes=30,
                status="completed",
                notes="Progress reviewed. Client showing good adherence to meal plan.",
                meeting_link=f"https://meet.zyael.com/session-{clients[0].id[-6:]}"
            ),
        ]
        db.add_all(sessions)
        db.commit()
        
        # Seed Progress Logs
        print("📊 Seeding Progress Logs...")
        progress_logs = []
        for i, client in enumerate(clients[:3]):
            for week in range(4):
                log_date = now - timedelta(weeks=week)
                weight_progress = client.weight_start - (week * 0.8)
                
                progress_logs.append(
                    models.ProgressLog(
                        client_id=client.id,
                        log_date=log_date,
                        weight=round(weight_progress, 1),
                        calories_consumed=1450 + (week * 10),
                        protein_intake=82.0 + (week * 2),
                        water_intake_liters=2.5,
                        meal_completion_percent=90 + (week % 10),
                        notes=f"Week {5-week} progress"
                    )
                )
        db.add_all(progress_logs)
        db.commit()
        
        # Seed Delivery Agents (existing)
        print("\n🚚 Seeding Delivery Agents...")
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
        
        # Seed Orders (existing)
        print("📦 Seeding Orders...")
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
        
        # Seed Kitchen Queue (existing)
        print("🍳 Seeding Kitchen Queue...")
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
        
        print("\n" + "=" * 50)
        print("✅ Database seeded successfully!")
        print(f"   - Meal Plans: {db.query(models.MealPlan).count()}")
        print(f"   - Nutritionists: {db.query(models.Nutritionist).count()}")
        print(f"   - Clients: {db.query(models.Client).count()}")
        print(f"   - Sessions: {db.query(models.Session).count()}")
        print(f"   - Progress Logs: {db.query(models.ProgressLog).count()}")
        print(f"   - Delivery Agents: {db.query(models.DeliveryAgent).count()}")
        print(f"   - Orders: {db.query(models.Order).count()}")
        print(f"   - Kitchen Queue: {db.query(models.KitchenQueue).count()}")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
