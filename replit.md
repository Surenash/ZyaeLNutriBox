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

### Client Portal - PDF-Based Design Implementation (October 2025)

**Complete Redesign Based on Official PDF:**
The entire client portal has been redesigned to match the exact specifications from the official ZyaeL NutriBox PDF document.

**Home Page Sections (Matching PDF):**

1. **Hero Banner**: "Home-Cooked Goodness, Inspired by Mom" with "Start Today →" CTA

2. **Diet Plans Section**: All 9 meal plans with exact pricing
   - Weight Loss (₹17,000 → ₹15,000/month) - 4.8★, 3200+ reviews - Bestseller
   - Muscle Gain (₹18,000 → ₹15,000/month) - 4.7★, 2800+ reviews - Popular
   - PCOS Friendly (₹16,500 → ₹15,000/month) - 4.6★, 2300+ reviews - Recommended
   - Vegan/Vegetarian (₹16,000 → ₹15,000/month) - 4.5★, 2100+ reviews - Healthy Choice
   - Postpartum Moms (₹17,000 → ₹15,000/month) - 4.8★, 1800+ reviews - Mom's Magic
   - Senior Citizens (₹16,500 → ₹15,000/month) - 4.9★, 1500+ reviews - Trusted by Families
   - Diabetic Friendly (₹16,500 → ₹15,000/month) - 4.9★, 1500+ reviews - Trusted by Families
   - Kids Nutrition (₹16,000 → ₹15,000/month) - 4.6★, 1200+ reviews - Coming Soon
   - Recovery Meals (₹16,500 → ₹15,000/month) - 4.7★, 1100+ reviews - Doctor Approved

3. **The Zyael Nutri Box Story**: Emotional narrative section with:
   - Story about mothers and home-cooked meals
   - Hindi phrases: "Beta, did you eat your breakfast?"
   - "Our Story" CTA button

4. **Nutritionists Section**: "Meet Our Team of Nutritionist in ZyaelNutriBox"

5. **Testimonials**: "Here What Our Customers Say About ZyaelNutribox"
   - Meera, 28 – Content Writer, Bengaluru
   - Nikhil, 35 – Sales Manager, Bengaluru

6. **Main CTA**: "Home-Cooked Goodness, Inspired by Mom & Perfected by Nutritionists"
   - "Subcribe Now" button (matches PDF typo exactly)

7. **News Section**: "News About Nutrition" with functional carousel
   - Carousel implementation using shadcn Carousel component
   - Working prev/next navigation arrows
   - Two articles: Daily Calorie Needs & Top 10 Superfoods

**Additional Pages:**
- **Cart Page**: Shopping cart with meal selections, quantity controls, and checkout
- **Orders Page**: Order history with status tracking
- **Track Page**: Daily meal tracking and nutrition progress
- **Profile Page**: User settings and account management

**Design Compliance:**
- Exact content matching PDF specifications
- Functional carousel for news section
- All pricing, ratings, and badges match PDF
- No emojis in UI (strict compliance)
- Proper shadcn component usage throughout

**Mobile Responsiveness (October 2025):**
Comprehensive mobile-first responsive design implemented across all client portal pages:

1. **Hero Banner Mobile Optimization:**
   - Reduced height: h-[400px] md:h-[500px] (100px smaller on mobile)
   - Responsive typography: text-3xl md:text-5xl (heading), text-base md:text-xl (subtitle)
   - Mobile padding: px-6 md:px-16, mb-3 md:mb-4

2. **Section Responsiveness:**
   - All headings: text-3xl md:text-5xl with px-4 mobile padding
   - Section spacing: mb-8 md:mb-12, gap-4 md:gap-6
   - Story section: p-6 md:p-12, text-base md:text-lg
   - CTA section: p-6 md:p-16, text-2xl md:text-5xl

3. **Carousel Mobile Features:**
   - Navigation arrows: !hidden md:!inline-flex (hidden on mobile)
   - Swipe navigation enabled for mobile users
   - Responsive card padding: p-4 md:p-6
   - Responsive text: text-lg md:text-xl (heading), text-sm md:text-base (body)

4. **Portal Pages Mobile:**
   - Cart: w-20 h-20 md:w-24 md:h-24 images, text-2xl md:text-3xl title
   - Orders: w-14 h-14 md:w-16 md:h-16 images, flex-wrap buttons
   - Track: text-3xl md:text-5xl heading
   - Profile: text-2xl md:text-3xl title

5. **Mobile Layout Techniques:**
   - Consistent breakpoint usage (md: 768px)
   - min-w-0 and truncate for text overflow
   - flex-wrap for button groups
   - Responsive image sizing across all pages

**Testing:**
- E2E tests passed for all pages and features
- Carousel navigation verified
- Mobile responsiveness tested on iPhone 12 Pro viewport (390x844)
- All interactive elements working correctly
- Architect review completed and approved

**Current Status:**
- PDF-based design fully implemented and approved
- Comprehensive mobile responsiveness complete
- All sections match official design specifications
- Using mock data for demonstration
- Ready for backend integration

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