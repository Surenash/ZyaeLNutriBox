from api.database import SessionLocal
from api import models
from api.simple_auth import get_password_hash
import sys

def seed_users():
    db = SessionLocal()
    try:
        print("👤 Seeding Users...")
        
        # 1. Management (Admin) User
        admin_user = db.query(models.User).filter(models.User.username == "admin").first()
        if not admin_user:
            admin_user = models.User(
                username="admin",
                email="admin@zyael.com",
                password=get_password_hash("adminpassword"),
                name="System Administrator",
                phone="+91-1234567890",
                role="admin"
            )
            db.add(admin_user)
            print("   ✅ Created admin user: admin / adminpassword")
        else:
            admin_user.password = get_password_hash("adminpassword")
            print("   ✅ Updated admin user password")

        # 2. Customer (Client) User
        customer_user = db.query(models.User).filter(models.User.username == "customer").first()
        if not customer_user:
            customer_user = models.User(
                username="customer",
                email="customer@zyael.com",
                password=get_password_hash("password123"),
                name="John Doe",
                phone="+91-9876543210",
                role="client"
            )
            db.add(customer_user)
            print("   ✅ Created customer user: customer / password123")
        else:
            customer_user.password = get_password_hash("password123")
            print("   ✅ Updated customer user password")
            
        # 3. Kitchen User
        kitchen_user = db.query(models.User).filter(models.User.username == "kitchen").first()
        if not kitchen_user:
            kitchen_user = models.User(
                username="kitchen",
                email="kitchen@zyael.com",
                password=get_password_hash("kitchenpassword"),
                name="Head Chef",
                phone="+91-1111111111",
                role="kitchen"
            )
            db.add(kitchen_user)
            print("   ✅ Created kitchen user: kitchen / kitchenpassword")
            
        # 4. Nutritionist User
        nutri_user = db.query(models.User).filter(models.User.username == "nutritionist").first()
        if not nutri_user:
            nutri_user = models.User(
                username="nutritionist",
                email="nutritionist@zyael.com",
                password=get_password_hash("nutritionistpassword"),
                name="Dr. Sarah",
                phone="+91-2222222222",
                role="nutritionist"
            )
            db.add(nutri_user)
            print("   ✅ Created nutritionist user: nutritionist / nutritionistpassword")
            
        # 5. Delivery User
        delivery_user = db.query(models.User).filter(models.User.username == "delivery").first()
        if not delivery_user:
            delivery_user = models.User(
                username="delivery",
                email="delivery@zyael.com",
                password=get_password_hash("deliverypassword"),
                name="Rider One",
                phone="+91-3333333333",
                role="delivery"
            )
            db.add(delivery_user)
            print("   ✅ Created delivery user: delivery / deliverypassword")
            
        db.commit()
        print("✨ User seeding complete!")
        
    except Exception as e:
        print(f"❌ Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
