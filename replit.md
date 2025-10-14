# ZyaeL NutriBox - Multi-Portal Nutrition Management System

## Overview

ZyaeL NutriBox is a comprehensive nutrition and meal delivery ecosystem built as a React application with multiple user portals for Clients, Nutritionists, Delivery Agents, and Administrators. The platform focuses on personalized nutrition tracking, meal planning with nutritionist-approved home-cooked meals, and efficient delivery management. The project aims to provide a warm, trustworthy user experience with a unified design language centered around a deep teal green (primary brand color). The client portal has been fully redesigned to match official specifications, including detailed diet plans, testimonials, and a functional news carousel, with comprehensive mobile responsiveness. A multi-portal delivery tracking system has also been implemented, featuring real-time GPS tracking for delivery agents, a Cloud Kitchen portal for order management, and WebSocket-based location broadcasting for live updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

**Framework**: React with TypeScript (functional components and hooks).
**Routing**: Wouter for client-side routing with role-based navigation.
**State Management**: React hooks for local state, TanStack React Query for server state, Context API for role selection.
**UI/Styling**: Radix UI and shadcn/ui (New York variant) for components, Tailwind CSS for styling, CSS custom properties for theming, Framer Motion for animations. Brand color: deep teal green (#006442).
**Build**: Vite for development and build, TypeScript for type safety.

### Backend

**Primary API Server**: FastAPI (Python 3.11) with SQLAlchemy ORM and Pydantic validation.
**Proxy Server**: Express.js with TypeScript proxies frontend requests to FastAPI backend.
**API Architecture**: FastAPI runs on port 3001, Express proxies `/api/*` and `/ws` to FastAPI, serves frontend on port 5000.
**WebSocket Proxy**: http-proxy-middleware forwards WebSocket upgrade requests from `/ws` to FastAPI backend, with server-level upgrade handler for proper connection establishment.
**Startup**: Express server automatically spawns FastAPI as a child process in ALL environments (development and production) via `run_api.py` wrapper script. Production uses 5-second startup delay vs 2 seconds in development to accommodate database initialization.
**Data Layer**: SQLAlchemy models with Pydantic schemas for validation, direct PostgreSQL integration.
**Response Format**: All API endpoints return camelCase JSON via Pydantic's `to_camel` alias generator and `response_model_by_alias=True` configuration for seamless frontend integration.

### Database & ORM

**Database**: Neon Serverless PostgreSQL (production-ready persistence).
**Primary ORM**: SQLAlchemy for Python FastAPI backend with declarative models.
**Schema**: Defined in `api/models.py` with SQLAlchemy models, validated with Pydantic schemas in `api/schemas.py`.
**Current Schema**: Production tables - `orders`, `kitchen_queue`, `delivery_agents`, `delivery_tracking`, `users`, `meal_plans`, `subscriptions`, `nutritionists`, `clients`, `sessions`, `progress_logs` (all with VARCHAR UUID primary keys).
**Connection**: Environment-based `DATABASE_URL` via SQLAlchemy engine with connection pooling (pool_pre_ping, pool_size=5, max_overflow=10, pool_recycle=3600) for stability, automatic table creation on startup.
**Legacy**: Drizzle ORM schema exists in `shared/schema.ts` but not currently used.
**Seeded Data**: Database contains 9 meal plans, 4 nutritionists, 4 clients, 3 sessions, and 12 progress logs for development and testing.
**Auto-Seeding**: Production database automatically seeds on first startup via FastAPI `@app.on_event("startup")` - checks if `meal_plans` table is empty and runs `seed_database()` if true. Ensures published app always has data without manual intervention.
**Production Safety**: 8-retry initialization with 5-second delays for Neon cold starts, masked database credentials in logs (postgresql://*****:*****@host/db), health check endpoint at `/api/` shows connection status and record counts.

### Authentication & Security

**Current**: Basic user schema, mock authentication for development, PostgreSQL session store (`connect-pg-simple`).
**Considerations**: Password hashing pending, CORS and credential handling configured.

### Multi-Portal Architecture

**Roles**: Client, Nutritionist, Delivery Agent, Administrator, and Cloud Kitchen.
**Access**: Role-based access with a central role selector at `/` that navigates to dedicated routes (`/client`, `/nutritionist`, `/admin`, `/kitchen`, `/delivery`).
**Shared Components**: Consistent UI elements (StatsCard, Progress indicators, BottomNavigation).

### API Endpoints

**Meal Plans**: GET, POST, GET by ID, PUT, DELETE - Manage meal plans with macros, prices, and descriptions.
**Subscriptions**: GET, POST, GET by ID, GET by client, PUT, DELETE - Track client meal plan subscriptions.
**Nutritionists**: GET, POST, GET by ID, PUT, DELETE - Manage nutritionist profiles with specializations.
**Clients**: GET, POST, GET by ID, PUT, DELETE - Track client health data and diet preferences.
**Sessions**: GET, POST, GET by ID, PUT, DELETE - Schedule and manage nutritionist-client sessions.
**Progress Logs**: GET, POST, GET by client - Track client weight and measurement progress over time.
**Orders**: GET - Retrieve meal delivery orders with status and client details.

### Frontend-Backend Integration

**Client Portal**: Fetches meal plans and nutritionists from API with loading states, displays dynamic content from database.
**Nutritionist Portal**: Fetches clients, sessions, and progress logs from API, calculates real-time stats (active clients, sessions today, average response time).
**Admin Portal**: Fetches meal plans, clients, and orders from API, displays statistics and recent activity with loading states.
**Data Mapping**: All API responses use camelCase for seamless TypeScript integration, arrays cloned before sorting to prevent cache mutation.
**Error Handling**: Loading skeletons during data fetch, empty state messages for zero results.

### Multi-Portal Delivery Tracking System

**Cloud Kitchen Portal**: 4-tab order queue (Pending, Preparing, Ready, Completed), meal prep workflow, delivery agent assignment, real-time updates via React Query.
**Delivery Agent Portal**: Live GPS tracking (Browser Geolocation API), WebSocket location broadcasting, interactive map navigation (MapPlaceholder), 3-tab interface (Available, Active, Completed deliveries), status management (Pick up → Mark delivered).
**Database Schema Additions**: `orders`, `kitchenQueue`, `deliveryAgents`, `deliveryTracking` for comprehensive tracking.
**WebSocket Infrastructure**: Server-side WebSocket on `/ws` (FastAPI endpoint), Express proxy with http-proxy-middleware forwards upgrade requests, client-side reusable class with reconnection logic, real-time location and status updates with dual update strategy (WebSocket + API). WebSocket connections automatically established on delivery portal load.

### Design System & Assets

**Component Organization**: Base UI components, composite components, page-level components.
**Animation**: Framer Motion variants for consistent transitions and effects.
**Theming**: CSS custom properties, light/dark mode support, elevation system.
**Assets**: Static assets in `attached_assets/`, Vite alias for imports.

## External Dependencies

### Core Framework
- **React 18**: UI framework.
- **Vite**: Build tool.
- **TypeScript**: Static typing.
- **Express**: Node.js server framework.

### UI & Styling
- **Tailwind CSS**: Utility-first CSS.
- **Radix UI**: Headless component primitives.
- **shadcn/ui**: Pre-styled components.
- **Framer Motion**: Animations.
- **Embla Carousel**: Carousel component.
- **Lucide React**: Icons.

### Data & State Management
- **TanStack React Query**: Server state.
- **Zod**: Schema validation.
- **date-fns**: Date utilities.

### Database & ORM
- **Drizzle ORM**: Type-safe SQL ORM.
- **Neon Serverless**: PostgreSQL database.
- **drizzle-kit**: Migration tools.
- **connect-pg-simple**: PostgreSQL session store.

### Development Tools
- **tsx**: TypeScript execution.
- **@replit/* packages**: Replit-specific development tools.

### Utility Libraries
- **clsx & tailwind-merge**: Class name utilities.
- **wouter**: Routing library.
- **nanoid**: Unique ID generation.