import uuid
from datetime import datetime
from db import SessionLocal
import models
from passlib.context import CryptContext

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_media_admin():
    db = SessionLocal()
    
    # 1. Define the Media Team credentials
    username = "media_team"
    email = "media@nutribox.com"
    plain_password = "NutriMedia"
    
    hashed_password = pwd_context.hash(plain_password)
    # Generate ID starting with ADMN- to pass the article.py security check
    media_id = f"MEDI-{str(uuid.uuid4()).split('-')[0].upper()}"

    # 2. Check if this account already exists to prevent duplicates
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        print(f"An account with email {email} already exists in the database!")
        db.close()
        return

    # 3. Create the User record
    media_user = models.User(
        id=media_id,
        username=username,
        email=email,
        passwordHash=hashed_password,
        role=models.RoleEnum.ADMIN, # Reusing the ADMIN role for media access
        createdAt=datetime.utcnow()
    )

    # 4. Save to Database
    try:
        db.add(media_user)
        db.commit()
        print(f"✅ SUCCESS! Media Team account created.")
        print(f"ID:       {media_id}")
        print(f"Username: {username}")
        print(f"Email:    {email}")
        print(f"Password: {plain_password}")
        print(f"Role:     ADMIN")
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating account: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_media_admin()