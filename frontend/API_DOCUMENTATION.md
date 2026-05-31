# API Documentation

This document outlines the Application Programming Interfaces (APIs) required to support all functionality across the platform, including the Customer, Nutritionist, Kitchen, Delivery, and Admin portals.

## 1. Authentication & Users
- `POST /api/auth/register`: Register a new user (customer, driver, nutritionist, admin).
- `POST /api/auth/login`: Authenticate and receive a token.
- `POST /api/auth/logout`: Invalidate the current session.
- `GET /api/auth/me`: Get current authenticated user details.

## 2. Customer Portal 
### Profile & Account Settings
- `GET /api/customer/profile`: Get customer profile and settings (including goals and allergies).
- `PUT /api/customer/profile`: Update personal info, goals, or preferences.
- `PUT /api/customer/address`: Add or edit delivery address.
- `PUT /api/customer/billing`: Edit payment method references.

### Daily Tracking (Weight & Hydration)
- `GET /api/customer/tracking/weight`: Get historical weight logs.
- `POST /api/customer/tracking/weight`: Log a new daily weight entry.
- `GET /api/customer/tracking/hydration`: Get daily water intake.
- `PUT /api/customer/tracking/hydration`: Update (increment/decrement) daily water glasses.

### Subscriptions & Diet Plan
- `GET /api/customer/subscription`: Get active subscription details and meal plan.
- `POST /api/customer/subscription`: Subscribe to a new meal plan.
- `PUT /api/customer/subscription/status`: Toggle subscription status (Pause / Resume).
- `PUT /api/customer/subscription/cancel`: Cancel subscription completely.

### Consultations & Medical Documents
- `GET /api/customer/consultations`: Get upcoming and past consultations.
- `POST /api/customer/consultations`: Book a new consultation slot with a selected doctor.
- `GET /api/customer/documents`: Fetch all uploaded medical/lab documents or diet plan notes.
- `POST /api/customer/documents`: Upload a new PDF/image document.
- `DELETE /api/customer/documents/:docId`: Delete an uploaded document.

## 3. Nutritionist Portal
### Patient Management
- `GET /api/nutritionist/patients`: List of assigned patients and their status.
- `GET /api/nutritionist/patients/:patientId/protocol`: Get active diet protocol details (Macros, Name).
- `PUT /api/nutritionist/patients/:patientId/protocol`: Update patient macros (Calories, Protein, Fat, Carbs) and plan details.
- `GET /api/nutritionist/patients/:patientId/documents`: Get patient lab reports, notes, and files.
- `POST /api/nutritionist/patients/:patientId/documents`: Upload notes or diagnostic reports for a patient.
- `DELETE /api/nutritionist/documents/:docId`: Delete a patient note or document.

### Scheduling
- `GET /api/nutritionist/schedule`: Get daily consultation schedule and zoom links.

## 4. Kitchen Portal (KDS)
- `GET /api/kitchen/orders`: Get active incoming orders for the kitchen queue.
- `PUT /api/kitchen/orders/:orderId/items/:itemIndex`: Toggle completion status of a specific dish inside an order.
- `PUT /api/kitchen/orders/:orderId/bump`: Move an order to the back of the preparation queue.
- `PUT /api/kitchen/orders/:orderId/ready`: Mark an entire order as ready for driver pickup.
- `WS /api/kitchen/stream`: WebSocket connection for real-time incoming orders and queue synchronization.

## 5. Delivery Portal
- `GET /api/delivery/route`: Get the active delivery route/list of stops for the authenticated driver.
- `PUT /api/delivery/stops/:stopId/delivered`: Mark a specific stop/order as delivered successfully.
- `PUT /api/delivery/status`: Update driver active status (Online / Offline).
- `WS /api/delivery/stream`: WebSocket connection for real-time dispatch updates and geo-location tracking.

## 6. Admin Portal
### System Dashboard
- `GET /api/admin/metrics`: Get system metrics (Weekly Revenue, Deliveries, User Churn, Ticket Counts).

### Meal Plan Catalog Management
- `GET /api/admin/plans`: List all meal plans in the system.
- `POST /api/admin/plans`: Create a new meal plan.
- `PUT /api/admin/plans/:planId`: Update generic meal plan details (price, description).
- `DELETE /api/admin/plans/:planId`: Delete meal plan entirely.
- `PUT /api/admin/plans/:planId/promote`: Toggle the promotional flag to highlight it on the public landing page.

### KDS Daily Planning
- `POST /api/admin/kds/menu`: Push a specific meal string string (e.g., Breakfast/Lunch/Dinner) for a specific plan variant into the Kitchen sequence tracker.

### Fleet & Staff Management
- `GET /api/admin/drivers`: List all drivers and their active statuses.
- `POST /api/admin/drivers`: Add a new driver account.
- `PUT /api/admin/drivers/:driverId`: Edit driver account details.
- `DELETE /api/admin/drivers/:driverId`: Remove a driver.
- `GET /api/admin/nutritionists`: List all nutritionists and their patient loads.
- `POST /api/admin/nutritionists`: Add a new nutritionist account.
- `PUT /api/admin/nutritionists/:id`: Edit nutritionist account details and specializations.
- `DELETE /api/admin/nutritionists/:id`: Disconnect/remove a nutritionist.

### User Subscriptions Management
- `GET /api/admin/users`: List all customers with their subscription status and associated plans.
- `PUT /api/admin/users/:userId/subscription/toggle`: Force toggle a user's subscription (Active/Paused).
- `PUT /api/admin/users/:userId/subscription/refund`: Cancel a user's subscription and process a refund flow.

## 7. Public Application (News/Blog)
- `GET /api/news`: List all published news articles for the public site.
- `GET /api/news/:id`: Get full contents of a specific news article.
