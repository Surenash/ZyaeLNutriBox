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
**Startup**: Express server automatically spawns FastAPI as a child process during development.
**Data Layer**: SQLAlchemy models with Pydantic schemas for validation, direct PostgreSQL integration.

### Database & ORM

**Database**: Neon Serverless PostgreSQL (production-ready persistence).
**Primary ORM**: SQLAlchemy for Python FastAPI backend with declarative models.
**Schema**: Defined in `api/models.py` with SQLAlchemy models, validated with Pydantic schemas in `api/schemas.py`.
**Current Schema**: Production tables - `orders`, `kitchen_queue`, `delivery_agents`, `delivery_tracking`, `users` (all with VARCHAR UUID primary keys).
**Connection**: Environment-based `DATABASE_URL` via SQLAlchemy engine, automatic table creation on startup.
**Legacy**: Drizzle ORM schema exists in `shared/schema.ts` but not currently used.

### Authentication & Security

**Current**: Basic user schema, mock authentication for development, PostgreSQL session store (`connect-pg-simple`).
**Considerations**: Password hashing pending, CORS and credential handling configured.

### Multi-Portal Architecture

**Roles**: Client, Nutritionist, Delivery Agent, Administrator, and Cloud Kitchen.
**Access**: Role-based access with a central role selector.
**Shared Components**: Consistent UI elements (StatsCard, Progress indicators, BottomNavigation).

### Multi-Portal Delivery Tracking System

**Cloud Kitchen Portal**: 4-tab order queue (Pending, Preparing, Ready, Completed), meal prep workflow, delivery agent assignment, real-time updates via React Query.
**Delivery Agent Portal**: Live GPS tracking (Browser Geolocation API), WebSocket location broadcasting, interactive map navigation (MapPlaceholder), 3-tab interface (Available, Active, Completed deliveries), status management (Pick up → Mark delivered).
**Database Schema Additions**: `orders`, `kitchenQueue`, `deliveryAgents`, `deliveryTracking` for comprehensive tracking.
**WebSocket Infrastructure**: Server-side WebSocket on `/ws`, client-side reusable class with reconnection logic, real-time location and status updates with dual update strategy (WebSocket + API).

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