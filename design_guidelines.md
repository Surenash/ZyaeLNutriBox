# ZyaeL NutriBox Design Guidelines

## Design Approach
**Reference-Based Approach:** The design directly references the existing ZyaeL NutriBox website aesthetic, maintaining brand consistency across the ecosystem. The visual language emphasizes warmth, health, and accessibility - evoking the comfort of home-cooked meals combined with professional nutrition expertise.

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- **Brand Green:** 195 100% 20% (Deep teal green #006442) - Primary brand color for headers, CTAs, navigation
- **Pure White:** 0 0% 100% - Main background color for clean, airy feel
- **Light Gray:** 0 0% 97% - Card backgrounds and subtle section dividers

**Accent Colors:**
- **Coral Orange:** 15 85% 55% - Pricing highlights, strikethrough original prices, urgent notifications
- **Success Green:** 142 76% 36% - Delivery status, progress indicators, completion badges
- **Warning Orange:** 36 100% 50% - "Bestseller", "Popular" badges on meal cards
- **Gold Star:** 45 100% 51% - Rating stars

**Text Colors:**
- Primary text: 0 0% 15% (near black)
- Secondary text: 0 0% 45% (medium gray)
- Muted text: 0 0% 65% (light gray)

### B. Typography

**Font Families:**
- Primary: 'Inter' or 'Poppins' (Google Fonts) - Clean, modern sans-serif for body and UI
- Headings: Same family with increased weight for hierarchy

**Type Scale:**
- Hero Headlines: text-4xl md:text-5xl font-bold (48-60px)
- Section Headings: text-3xl md:text-4xl font-semibold (36-48px)
- Card Titles: text-xl font-semibold (20px)
- Body Text: text-base (16px)
- Small Text/Captions: text-sm (14px)
- Micro Text: text-xs (12px) for labels and tags

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24, 32 for consistent rhythm
- Card padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Component gaps: gap-4 to gap-8
- Grid gutters: gap-6

**Container Structure:**
- Max width: max-w-7xl for full-width sections
- Content width: max-w-6xl for text-heavy content
- Centered: mx-auto px-4 sm:px-6 lg:px-8

**Grid Systems:**
- Meal Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Feature Sections: 2-column layouts on desktop
- Nutritionist Cards: Horizontal scrolling carousel on mobile, grid on desktop

### D. Component Library

**Cards - Meal Plan Cards:**
- White background with rounded-2xl corners
- Subtle shadow: shadow-md hover:shadow-xl transition
- Content structure: Image placeholder area → Title → Pricing (original crossed out in coral, new price in green) → Rating stars with count → Badge label → CTA button
- Badge positioning: Absolute top-right with rounded-full px-3 py-1

**Nutritionist Profile Cards:**
- Horizontal card layout on desktop
- Profile photo: rounded-full, w-20 h-20
- Content: Name (font-semibold), Specialization (text-sm text-gray-600), Experience, Rating
- CTA: "Consult Now" button in brand green

**Progress Tracking Components:**
- Circular or linear progress bars in brand green
- Percentage labels with bold numbers
- Nutrition metrics in card format with icon, label, current/target values
- Weekly chart with subtle grid lines and green fill

**Buttons:**
- Primary: bg-[#006442] text-white rounded-full px-8 py-3 hover:opacity-90
- Secondary: bg-white text-[#006442] border-2 border-[#006442] rounded-full
- On images: backdrop-blur-md bg-white/30 border border-white/50

**Navigation:**
- Bottom tab bar for mobile with 5 icons (Home, Cart, Orders, Track, Profile)
- Active state: brand green icon with label
- Top header: Brand logo left, user avatar/menu right

**Form Elements:**
- Input fields: rounded-lg border-gray-300 focus:border-[#006442] focus:ring-2 focus:ring-[#006442]/20
- Multi-step wizard: Progress indicators as numbered circles connected by lines
- Dropdown selects: Custom styled with green accent
- Checkboxes/Radio: Green fill when selected

**Testimonial Cards:**
- White card with rounded-xl
- Customer photo: rounded-full, w-16 h-16
- Quote in italic text-gray-700
- Name and role in small text below
- 5-star rating display

**Status Badges:**
- Pill-shaped with rounded-full
- Color-coded: Green (Delivered/Completed), Orange (In Transit), Gray (Pending)
- Small text with icon prefix

### E. Animations

**Minimal Motion:**
- Hover effects: subtle scale (scale-105) and shadow changes
- Page transitions: None - instant switches between portals
- Loading states: Simple spinner in brand green
- Card hover: transform transition-transform duration-200

## Images

**Hero Section Images:**
- Large, high-quality photos of fresh, appetizing meals in home-style bowls/plates
- Warm, natural lighting emphasizing freshness
- Placement: Full-width hero section at top of Client portal home
- Overlay: Dark gradient overlay (from black/40% to transparent) for text readability

**Meal Card Images:**
- Top portion of each meal plan card
- Square aspect ratio (aspect-square) with rounded-t-2xl
- Bright, colorful food photography showing meal variety

**Nutritionist Photos:**
- Professional headshots with warm, approachable expressions
- Circular cropping (rounded-full)
- Consistent size across profile cards

**Testimonial Images:**
- Candid customer photos or professional portraits
- Smaller circular images (w-16 h-16)
- Optional: Before/after comparison images for success stories

**Background Patterns:**
- Subtle geometric patterns or food illustrations in very light green (opacity 5-10%) as section backgrounds
- Keep minimal to maintain clean aesthetic

## Portal-Specific Design Notes

**Client Portal:** Bright, welcoming, food-forward design with large images and clear CTAs
**Nutritionist Portal:** Professional, data-focused with charts, progress metrics, clean tables
**Delivery Agent Portal:** Functional, map-centric, large status buttons, minimal decoration
**Admin Panel:** Dense information architecture, data tables, sidebar navigation, compact cards

## Accessibility & Dark Mode
Maintain consistent design with NO dark mode - the health and food-focused brand works best with bright, clean white backgrounds that showcase food photography and maintain a fresh, positive aesthetic.