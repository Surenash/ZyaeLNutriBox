# Data Structures & Schema Design

This document outlines the data structures (e.g., JSON schemas or relational entity definitions) necessary to fully power all functionality in the application's front end.

## 1. Core Users Collection
Stores system root accounts and governs Role-Based Access Control (RBAC).

```json
{
  "id": "string (UUID)",
  "email": "string",
  "passwordHash": "string",
  "role": "'CUSTOMER' | 'ADMIN' | 'NUTRITIONIST' | 'DRIVER'",
  "createdAt": "timestamp",
  "lastLoginDate": "timestamp"
}
```

## 2. Profile Documents
Separate descriptive profiles isolated by roles to allow scaling field data accurately without clogging the base user schema.

### Customer Profile
```json
{
  "userId": "string (ref -> Users.id)",
  "fullName": "string",
  "phoneNumber": "string",
  "fitnessGoals": ["string"],
  "deliveryAddress": {
    "street": "string",
    "aptLabel": "string",
    "city": "string",
    "zipCode": "string",
    "deliveryInstructions": "string"
  },
  "billingReference": {
    "cardLast4": "string",
    "stripeCustomerId": "string"
  },
  "allergies": ["string"],
  "assignedNutritionistId": "string (nullable ref -> Nutritionist Profile)",
  "notificationPreferences": {
    "smsEnabled": "boolean",
    "emailEnabled": "boolean",
    "pushEnabled": "boolean"
  }
}
```

### Nutritionist Profile
```json
{
  "userId": "string (ref -> Users.id)",
  "displayName": "string",
  "specialty": "string",
  "assignedPatientsList": ["string (ref -> Customer.userId)"],
  "pendingRequests": "number"
}
```

### Driver Profile
```json
{
  "userId": "string (ref -> Users.id)",
  "fullName": "string",
  "mobileNumber": "string",
  "activeStatus": "'ONLINE' | 'OFFLINE'",
  "vehicleDescription": "string"
}
```

## 3. Catalog & Subscription Management

### Meal Plan Variant (Catalog Configuration)
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "weeklyPrice": "number",
  "isPromotedOnLanding": "boolean",
  "defaultMacros": {
    "caloriesKcal": "number",
    "proteinGrams": "number",
    "carbsGrams": "number",
    "fatGrams": "number"
  }
}
```

### Customer Subscription Ledger
```json
{
  "id": "string",
  "customerId": "string (ref -> Customer Profile)",
  "catalogPlanId": "string (ref -> Meal Plan Variant)",
  "lifecycleStatus": "'ACTIVE' | 'PAUSED' | 'CANCELLED'",
  "isAutoRenewEnabled": "boolean",
  "nextBillingDate": "timestamp",
  "customNutritionProtocolName": "string",
  "customMacros": {
    "caloriesKcal": "number",
    "proteinGrams": "number",
    "carbsGrams": "number",
    "fatGrams": "number"
  }
}
```

### Daily Health Tracking (Weight & Hydration)
```json
{
  "id": "string",
  "customerId": "string",
  "dateRecord": "YYYY-MM-DD",
  "weightKg": "number (nullable)",
  "waterGlasses": "number",
  "lastUpdated": "timestamp"
}
```

## 4. Kitchen Display System (KDS) & Operations

### Daily KDS Menu Plan
```json
{
  "id": "string",
  "targetDate": "YYYY-MM-DD",
  "catalogPlanId": "string",
  "courses": {
    "breakfastMealName": "string",
    "lunchMealName": "string",
    "dinnerMealName": "string"
  }
}
```

### KDS Order Ticket
```json
{
  "id": "string (Order/Invoice Number)",
  "customerId": "string",
  "catalogPlanId": "string",
  "creationTime": "timestamp",
  "preparationStatus": "'PENDING' | 'PREPARING' | 'READY'",
  "dispatchPriority": "'NORMAL' | 'HIGH'",
  "bumpQueueIndex": "number",
  "lineItems": [
    {
      "dishName": "string",
      "isPrepared": "boolean"
    }
  ]
}
```

## 5. Fulfillment & Logistics

### Driver Delivery Route (Run)
```json
{
  "id": "string",
  "driverId": "string",
  "dispatchDate": "YYYY-MM-DD",
  "runStatus": "'ACTIVE' | 'COMPLETED'",
  "routeStops": [
    {
      "stopSequenceId": "number",
      "associatedOrderId": "string",
      "customerName": "string",
      "dropoffAddress": "string",
      "dropoffInstructions": "string",
      "isDelivered": "boolean",
      "deliveredTimestamp": "timestamp (nullable)"
    }
  ]
}
```

## 6. Medical Services & Records

### Telehealth Consultation
```json
{
  "id": "string",
  "customerId": "string",
  "nutritionistId": "string",
  "scheduledStartTime": "timestamp",
  "zoomMeetingUrl": "string",
  "sessionStatus": "'SCHEDULED' | 'COMPLETED' | 'CANCELLED'"
}
```

### Health Document / Lab Report
```json
{
  "id": "string",
  "customerId": "string",
  "uploadedByUserId": "string (Tracks if patient or doc uploaded)",
  "originalFileName": "string",
  "assetStorageUrl": "string",
  "internalNotes": "string",
  "uploadTimestamp": "timestamp"
}
```

## 7. Content & Marketing

### News Article Entry
```json
{
  "id": "string",
  "headline": "string",
  "shortDescription": "string",
  "markdownContent": "string",
  "heroImageUrl": "string",
  "publishDate": "timestamp",
  "authorName": "string"
}
```
