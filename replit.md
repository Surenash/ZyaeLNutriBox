# ZyaeL NutriBox - Multi-Portal Nutrition Management System

## Overview

ZyaeL NutriBox is a comprehensive nutrition and meal delivery ecosystem built as a React application with multiple user portals. The system serves four distinct user roles: Clients (end-users), Nutritionists, Delivery Agents, and Administrators. The platform focuses on personalized nutrition tracking, meal planning, and delivery management with a strong emphasis on home-cooked, nutritionist-approved meals.

The application emphasizes a warm, trustworthy aesthetic inspired by the comfort of home cooking, using a deep teal green (#006442) as the primary brand color. All portals share a unified design language while providing role-specific functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using functional components and hooks exclusively

**Routing**: Wouter for client-side routing, with a role-based navigation system that allows users to switch between different portal views

**State Management**: 
- React hooks (useState, useEffect) for local component state
- TanStack React Query for server state management and data fetching
- Context API for role selection state

**UI Component Library**: 
- Radix UI primitives for accessible, headless components
- shadcn/ui design system (New York variant) for styled components
- Custom component architecture with reusable cards, stats, and progress indicators

**Styling Approach**:
- Tailwind CSS for utility-first styling
- CSS custom properties for theming (light/dark mode support)
- Design tokens defined in index.css for colors, spacing, and effects
- Framer Motion for animations and transitions
- Specific brand color palette: Primary (#006442), accent colors for status (green, orange), and neutral grays

**Build System**:
- Vite as the build tool and dev server
- TypeScript for type safety
- Path aliases (@/, @shared/, @assets/) for clean imports
- Separate client and server build outputs

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Structure**: 
- RESTful API endpoints prefixed with /api
- Route registration system in server/routes.ts
- Custom error handling middleware
- Request/response logging for debugging

**Development Features**:
- Vite middleware integration for HMR in development
- Runtime error overlay for better debugging
- Development banners and cartographer integration (Replit-specific)

**Data Layer**:
- Storage interface pattern (IStorage) for data operations
- In-memory storage implementation (MemStorage) for development
- CRUD operations for user management
- Designed to be swappable with database implementations

### Database & ORM

**ORM**: Drizzle ORM with PostgreSQL dialect

**Database Provider**: Neon Serverless PostgreSQL (@neondatabase/serverless)

**Schema Management**:
- Schema definitions in shared/schema.ts using Drizzle's pgTable
- Zod integration for runtime validation (drizzle-zod)
- Migration files generated in /migrations directory
- Type-safe queries with TypeScript inference

**Current Schema**:
- Users table with UUID primary keys
- Username/password authentication fields
- Extensible design for adding nutrition, meal, and delivery-related tables

**Connection**:
- Environment-based DATABASE_URL configuration
- Connection pooling via Neon serverless driver
- Shared schema accessible to both client and server

### Authentication & Security

**Current Implementation**:
- Basic user schema with username/password fields
- Mock authentication in role selector for development
- Session management infrastructure using connect-pg-simple (PostgreSQL session store)

**Security Considerations**:
- Password hashing not yet implemented (development stage)
- CORS and credential handling configured
- Ring offset background for focus states (accessibility)

### Multi-Portal Architecture

**Role-Based Access**:
- **Client Portal**: Meal tracking, nutrition progress, nutritionist consultation
- **Nutritionist Portal**: Client management, progress monitoring, meal plan adjustments
- **Delivery Portal**: Order management, delivery tracking, route optimization
- **Admin Portal**: User management, menu configuration, system analytics

**Portal Switching**:
- Centralized role selector component
- Persistent "Back to Roles" button across all portals
- Each portal has independent state and navigation
- Shared component library across portals (stats cards, progress bars, etc.)

**Shared Components**:
- BottomNavigation: Mobile-first tab navigation
- StatsCard: Metric display with trends
- Progress indicators: Nutrition tracking, meal completion
- Role-specific cards: Client progress, delivery orders, diet plans

### Asset Management

**Image Storage**: Static assets stored in attached_assets/ directory with generated images for:
- Hero banners and meal photography
- Nutritionist and customer profile images
- Diet plan and meal type visuals

**Asset Resolution**: Vite alias (@assets) for clean asset imports

### Design System

**Component Organization**:
- Base UI components in client/src/components/ui/
- Composite components in client/src/components/
- Example implementations in client/src/components/examples/
- Page-level components in client/src/pages/

**Animation System**:
- Framer Motion variants in lib/animations.ts
- Consistent transitions: fadeIn, slideUp, scaleIn
- Stagger animations for list items
- Hover effects with elevation classes (hover-elevate, active-elevate-2)

**Theming**:
- CSS custom properties for color tokens
- Light/dark mode support with .dark class selector
- Elevation system using rgba overlays
- Button and badge border calculations based on opacity

## Recent Changes

### Client Portal - Complete Implementation (October 2025)

**New Pages Implemented:**
1. **Cart Page**: Full shopping cart with meal selection, quantity controls, price summary, and checkout CTA
2. **Orders Page**: Order history with status tracking, reorder functionality, and order details
3. **Profile Page**: User profile management with dietary preferences, subscription details, and settings menu

**Design Enhancements:**
- Enhanced Home Page: Larger typography (text-4xl/5xl), centered section headers, improved visual hierarchy
- Improved CTA Section: Gradient background, dual-button layout, trust indicators
- Better Tracking Page: Two-column layout, weekly streak widget, enhanced nutrition metrics
- Consistent spacing and padding across all portal sections

**Animation System:**
- All pages use shared animation utilities from lib/animations.ts
- Consistent pageTransitionVariants for smooth page transitions
- Staggered list animations for diet plans, nutritionists, and testimonials
- Motion effects on all interactive elements

**Design Compliance:**
- Removed all emoji usage from UI (strict adherence to design guidelines)
- Proper shadcn Button component usage without manual padding overrides
- Consistent use of hover-elevate and active-elevate-2 utility classes
- Brand-aligned color scheme with deep green (#006442) primary color

**Testing:**
- E2E tests passed for all 5 client portal tabs (Home, Cart, Orders, Track, Profile)
- Navigation verified between all pages
- All mock data displays correctly
- Architect review completed and approved

**Current Status:**
- Client portal complete with all planned pages
- Using mock data for demonstration (marked with //todo comments)
- Ready for backend integration when storage layer is implemented
- All design guidelines and component usage rules followed

## External Dependencies

### Core Framework Dependencies
- **React 18**: UI framework with concurrent features
- **Vite**: Build tool and dev server with HMR
- **TypeScript**: Static typing across the stack
- **Express**: Node.js web framework for API server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component primitives (20+ component packages)
- **shadcn/ui**: Pre-styled component system
- **Framer Motion**: Animation library
- **Embla Carousel**: Carousel component for content sliders
- **Lucide React**: Icon library

### Data & State Management
- **TanStack React Query**: Server state management
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation
- **date-fns**: Date manipulation utilities

### Database & ORM
- **Drizzle ORM**: Type-safe SQL ORM
- **Neon Serverless**: PostgreSQL database provider
- **drizzle-kit**: Migration and schema management tools
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/* packages**: Replit-specific development tools (cartographer, dev banner, runtime error overlay)

### Utility Libraries
- **clsx & tailwind-merge**: Conditional class name utilities
- **class-variance-authority**: Component variant management
- **cmdk**: Command palette component
- **vaul**: Drawer component primitives
- **wouter**: Minimal routing library
- **nanoid**: Unique ID generation

### Build & Configuration
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **autoprefixer**: Vendor prefix automation