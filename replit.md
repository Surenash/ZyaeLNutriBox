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

**Client Portal**: Fetches meal plans and nutritionists from API with loading states, displays dynamic content from database. Features comprehensive redesign with hero banner slider, health goals categories, nutritionist consultation slider, promotional banners, enhanced tracking with graphs, smart notification system, and professional footer. All UI elements follow no-emoji policy with comprehensive data-testid attributes for testing.
**Nutritionist Portal**: Fetches clients, sessions, and progress logs from API, calculates real-time stats (active clients, sessions today, average response time).
**Admin Portal**: Fetches meal plans, clients, and orders from API, displays statistics and recent activity with loading states.
**Data Mapping**: All API responses use camelCase for seamless TypeScript integration, arrays cloned before sorting to prevent cache mutation.
**Error Handling**: Loading skeletons during data fetch, empty state messages for zero results.

### Multi-Portal Delivery Tracking System

**Cloud Kitchen Portal**: 4-tab order queue (Pending, Preparing, Ready, Completed), meal prep workflow, delivery agent assignment, real-time updates via React Query.
**Delivery Agent Portal**: Live GPS tracking (Browser Geolocation API), WebSocket location broadcasting, interactive map navigation (MapPlaceholder), 3-tab interface (Available, Active, Completed deliveries), status management (Pick up → Mark delivered).
**Database Schema Additions**: `orders`, `kitchenQueue`, `deliveryAgents`, `deliveryTracking` for comprehensive tracking.
**WebSocket Infrastructure**: Server-side WebSocket on `/ws` (FastAPI endpoint), Express proxy with http-proxy-middleware forwards upgrade requests, client-side reusable class with reconnection logic, real-time location and status updates with dual update strategy (WebSocket + API). WebSocket connections automatically established on delivery portal load.

### Universal Real-Time System

**Backend WebSocket Broadcasts**: All CRUD operations broadcast events - `meal_plan_created/updated/deleted`, `client_created/updated`, `session_created/updated`, `progress_log_created`, `order_created/updated`, `kitchen_queue_updated`, `nutritionist_created/updated`, `location_update`. ConnectionManager handles broadcast distribution and auto-removes dead connections.
**JSON Serialization**: All broadcasts use `.model_dump(mode='json', by_alias=True)` to properly serialize datetime objects to ISO strings for WebSocket transmission.
**Frontend Hook**: `useRealtime` hook provides portal-specific event subscriptions, automatic React Query cache invalidation, and toast notifications for all data changes.
**Portal Integration**: Client Portal listens for meal plan and nutritionist updates, Nutritionist Portal for client/session/progress changes, Admin Portal for all entity updates. UI updates instantly without page refresh.
**Connection Management**: WebSocket auto-reconnects on disconnect, removes failed connections during broadcast to prevent backlog, logs connection events for debugging.

### Client Portal Redesign (Comprehensive Feature-Rich Layout)

**Hero Banner Slider**: Auto-rotating carousel with 3 slides (5-second intervals), navigation arrows, dot indicators, smooth transitions via Framer Motion. Displays personalized nutrition messaging and CTAs.
**Health Goals Categories**: Compact horizontal card layout with small thumbnail images (96px) on left, content on right. Features title, description, pricing (original/discounted), star ratings, review counts, optional badges ("Most Popular", "High Protein", "Doctor Approved"), and "Subscribe Now" buttons. Grid layout: grid-cols-1 md:grid-cols-2 for responsive 2-column design. Plans include Weight Loss (₹15,000/month, 4.9★), Muscle Gain (₹17,000/month, 4.8★), Balanced Nutrition (₹13,500/month, 4.7★), and Diabetic Friendly (₹14,500/month, 4.9★).
**Nutritionist Consultation Slider**: Horizontal Embla carousel with nutritionist profile cards, "Consult Now" buttons, specializations, experience display. Carousel navigation with prev/next arrows. "Book Your Free Consultation" CTA.
**Nutrition Products Grid**: Enhanced meal plan cards with images, pricing, discount tags, macros display, "View More" buttons. Real-time data from API with loading skeletons.
**Promotional Banner**: Auto-rotating promotional slider (5-second intervals) with 3 marketing messages, dot indicators, gradient backgrounds. Highlights offers and testimonials.
**Enhanced Tracking Section**: Multi-tab interface (Daily/Weekly/Monthly) with calorie progress bars, macros breakdown (Protein/Carbs/Fats), water intake tracker with "Add Glass" functionality, weight logging dialog with input validation. Progress visualization with circular indicators.
**Smart Notification System**: Timed pop-up appearing after 2 minutes of browsing, prompts nutritionist chat with "Chat Now" and "Later" options. Auto-dismisses on interaction.
**Location Search Bar**: Sticky header with location selector showing current delivery area (e.g., "Delivering to Bangalore"), integrated search input for meal plans and content discovery.
**Professional Footer**: Quick navigation links (Meal Plans, Nutritionists, Blog, Contact Us), contact information display (email, phone), app version indicator, branding tagline. Responsive grid layout.
**Blog & News Carousel**: Existing article carousel maintained with thumbnails, titles, descriptions, "Read More" links. Integrated into comprehensive layout.
**Design Compliance**: NO emojis anywhere in UI (replaced with Lucide icons), comprehensive data-testid attributes on all interactive elements following naming convention (e.g., `button-hero-indicator-{index}`, `tab-trigger-daily`, `button-consult-nutritionist-{id}`). Smooth animations via Framer Motion, responsive design for mobile/tablet/desktop.
**Component Architecture**: Modular components (HeroSlider.tsx, HealthGoalsCategory.tsx, NutritionistSlider.tsx, PromotionalBanner.tsx, EnhancedTracking.tsx, SmartNotification.tsx, LocationSearch.tsx, ClientFooter.tsx) integrated into ClientPortal.tsx with proper state management and real-time updates.

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