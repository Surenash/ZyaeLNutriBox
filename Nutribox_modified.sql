CREATE TABLE Users (
    id VARCHAR(36) PRIMARY KEY, -- e.g., 'CUST-1234'
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'NUTRITIONIST', 'DRIVER', 'KITCHEN_ADMIN', 'ADMIN') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLoginDate TIMESTAMP NULL
    
);

CREATE TABLE CustomerProfile (
    userId VARCHAR(36) PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    fullName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(50),
    addressText TEXT,
    latitude DECIMAL(10, 8), -- For driver maps
    longitude DECIMAL(11, 8), -- For driver maps
    dietaryTags JSON, -- e.g., ["Vegan", "Gluten-Free"]
    assignedNutritionistId VARCHAR(36) NULL REFERENCES Users(id) ON DELETE SET NULL,
    profilePictureUrl VARCHAR(512) NULL
);

CREATE TABLE NutritionistProfile (
    userId VARCHAR(36) PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    fullName VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    profilePictureUrl VARCHAR(512) NULL,
    phoneNumber VARCHAR(50) NULL,
    isApproved BOOLEAN DEFAULT FALSE
);

CREATE TABLE DriverProfile (
    userId VARCHAR(36) PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    fullName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(50) NOT NULL,
    vehicleNumber VARCHAR(100),
    isActive BOOLEAN DEFAULT FALSE,
    totalEarnings DECIMAL(10, 2) DEFAULT 0.00,
    profilePictureUrl VARCHAR(512) NULL
);

CREATE TABLE MealPlanCatalog (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., "Weight Loss", "Muscle Gain"
    description TEXT,
    monthlyPrice DECIMAL(10, 2) NOT NULL
);

CREATE TABLE CustomerSubscription (
    id VARCHAR(36) PRIMARY KEY,
    customerId VARCHAR(36) NOT NULL REFERENCES CustomerProfile(userId),
    planId BIGINT UNSIGNED NOT NULL REFERENCES MealPlanCatalog(id),
    startDate TIMESTAMP NOT NULL,
    expiryDate TIMESTAMP NOT NULL, -- Automatically set to startDate + 30 days
    isActive BOOLEAN DEFAULT TRUE
);

CREATE TABLE DailyMenu (
    id VARCHAR(36) PRIMARY KEY,
    targetDate DATE NOT NULL,
    mealType ENUM('BREAKFAST', 'LUNCH', 'DINNER') NOT NULL,
    defaultMealName VARCHAR(255) NOT NULL,
    proteinGrams INT DEFAULT 0,
    carbsGrams INT DEFAULT 0,
    fatGrams INT DEFAULT 0
);

CREATE TABLE OrderTicket (
    id VARCHAR(36) PRIMARY KEY,
    customerId VARCHAR(36) NOT NULL REFERENCES CustomerProfile(userId),
    menuId VARCHAR(36) NOT NULL REFERENCES DailyMenu(id),
    
    -- Customization for the specific customer
    customMealName VARCHAR(255), 
    customInstructions TEXT, -- e.g., "No nuts, extra spicy"
    
    -- Status & Dispatch
    status ENUM('PENDING', 'COOKING', 'READY', 'IN_TRANSIT', 'DELIVERED') DEFAULT 'PENDING',
    priority ENUM('NORMAL', 'HIGH') DEFAULT 'NORMAL',
    
    -- Handoff Logistics
    assignedDriverId VARCHAR(36) NULL REFERENCES DriverProfile(userId),
    pickupOtp VARCHAR(6) NULL,
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deliveredAt TIMESTAMP NULL
);

CREATE TABLE Consultation (
    id VARCHAR(36) PRIMARY KEY,
    customerId VARCHAR(36) NOT NULL REFERENCES CustomerProfile(userId),
    nutritionistId VARCHAR(36) NOT NULL REFERENCES NutritionistProfile(userId),
    
    scheduledTime TIMESTAMP NOT NULL,
    status ENUM('REQUESTED', 'ACCEPTED', 'REJECTED', 'RESCHEDULED', 'COMPLETED') DEFAULT 'REQUESTED',
    meetingLink VARCHAR(512) NULL,
    notes TEXT NULL
);

USE NutriBoxDatabase;

CREATE TABLE Review (
    id VARCHAR(36) PRIMARY KEY,
    customerId VARCHAR(36) NOT NULL,
    planId BIGINT UNSIGNED NOT NULL,
    rating INT NOT NULL,
    reviewText TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES CustomerProfile(userId) ON DELETE CASCADE,
    FOREIGN KEY (planId) REFERENCES MealPlanCatalog(id) ON DELETE CASCADE
);


CREATE TABLE Article (
    id VARCHAR(36) PRIMARY KEY,
    headline VARCHAR(255) NOT NULL,
    content TEXT,
    source VARCHAR(255),
    link VARCHAR(512),
    imageUrl VARCHAR(512),
    publishedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);