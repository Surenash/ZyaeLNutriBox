from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your database engine and models to auto-create tables
from db import engine
import models

# Import your routers
from routers import auth, customer, kitchen, delivery, reviews, nutritionist, article, admin, mealplan
models.Base.metadata.create_all(bind=engine)

# --- RUN DYNAMIC SCHEMA MIGRATIONS ---
def run_migrations():
    from sqlalchemy import inspect, text
    inspector = inspect(engine)
    
    # 1. MealPlanCatalog
    if 'MealPlanCatalog' in inspector.get_table_names():
        cols = [c['name'] for c in inspector.get_columns('MealPlanCatalog')]
        with engine.begin() as conn:
            if 'isPromoted' not in cols:
                conn.execute(text("ALTER TABLE MealPlanCatalog ADD COLUMN isPromoted BOOLEAN DEFAULT 0"))
            if 'benefits' not in cols:
                is_mysql = 'mysql' in engine.name
                col_type = "JSON" if is_mysql else "TEXT"
                conn.execute(text(f"ALTER TABLE MealPlanCatalog ADD COLUMN benefits {col_type} NULL"))
            if 'calories' not in cols:
                conn.execute(text("ALTER TABLE MealPlanCatalog ADD COLUMN calories INTEGER DEFAULT 0"))
            if 'protein' not in cols:
                conn.execute(text("ALTER TABLE MealPlanCatalog ADD COLUMN protein INTEGER DEFAULT 0"))
            if 'carbs' not in cols:
                conn.execute(text("ALTER TABLE MealPlanCatalog ADD COLUMN carbs INTEGER DEFAULT 0"))
            if 'fats' not in cols:
                conn.execute(text("ALTER TABLE MealPlanCatalog ADD COLUMN fats INTEGER DEFAULT 0"))
            if 'sampleMeals' not in cols:
                is_mysql = 'mysql' in engine.name
                col_type = "JSON" if is_mysql else "TEXT"
                conn.execute(text(f"ALTER TABLE MealPlanCatalog ADD COLUMN sampleMeals {col_type} NULL"))
                
    # 2. NutritionistProfile
    if 'NutritionistProfile' in inspector.get_table_names():
        cols = [c['name'] for c in inspector.get_columns('NutritionistProfile')]
        with engine.begin() as conn:
            if 'isPromoted' not in cols:
                conn.execute(text("ALTER TABLE NutritionistProfile ADD COLUMN isPromoted BOOLEAN DEFAULT 0"))

try:
    run_migrations()
except Exception as err:
    print(f"Skipped/Failed to run auto-migrations: {err}")

app = FastAPI(
    title="Zyael NutriBox API",
    description="Eat Healthy",
    version="1.0.0"
)

# Configure CORS so the React frontend can make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to ["http://localhost:5173"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the routers
app.include_router(auth.router)
app.include_router(customer.router)
app.include_router(kitchen.router)
app.include_router(delivery.router)
app.include_router(reviews.router)
app.include_router(nutritionist.router)
app.include_router(article.router)
app.include_router(admin.router)
app.include_router(mealplan.router)
# Simple health-check endpoint
# --- Bottom of main.py ---

# Simple health-check endpoint
@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Zyael NutriBox API is running smoothly!",
        "database_connected": True 
    }

# NEW: Run the server on port 8080 directly from this file
if __name__ == "__main__":
    import uvicorn
    # Make sure you include reload=True so it auto-updates when you save!
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)