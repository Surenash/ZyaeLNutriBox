# db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Notice the capital 'N' in Nutribox to match your SQL script
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://db_admin:SecurePassword123!@localhost:3306/Nutribox"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()