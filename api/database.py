import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine without immediate connection test
# Connection will be tested when first used
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=5,  # Maximum number of connections to keep in pool
    max_overflow=10,  # Maximum number of connections to create beyond pool_size
    pool_recycle=3600,  # Recycle connections after 1 hour
    connect_args={
        "connect_timeout": 30,  # Longer timeout for Neon
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
