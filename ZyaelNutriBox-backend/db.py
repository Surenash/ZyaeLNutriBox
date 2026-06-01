# db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Notice the capital 'N' in Nutribox to match your SQL script
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://super_admin:NutriBox2026@zyaelnutribox-catalog.cjqmyc4c6hoi.ap-south-1.rds.amazonaws.com:3306/NutriBoxDatabase"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()