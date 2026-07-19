---
quantum-enabled: false
---

# QMOI Space Spatial Collaboration Hub Screen

## Overview
The QMOI Space screen serves as a central navigation hub for the QMOI ecosystem, providing access to various system components including AI tools, city dashboards, community workspaces, and PRODUCTIONeloper utilities. It represents the active Next.js application interface replacing legacy static PWA launchers.

## Screen Layout Structure

### Main Container
- **Background**: Full-screen dark theme (`bg-slate-950`)
- **Padding**: 8 units on all sides (`p-8`)
- **Text Color**: White (`text-white`)
- **Minimum Height**: Full viewport height (`min-h-screen`)
- **Max Width**: 6xl (72rem) with auto horizontal margins for centering
- **Vertical Spacing**: Space-y-10 between major sections

### Header Section
**Container**: Rounded card with slate-900 background, padding-8, slate-700 border, shadow-xl
**Layout**: Responsive flex layout (column on mobile, row on medium+ screens)

#### Title Area
- **Badge**: "QMOI Space" (text-sm, uppercase, tracking-[0.3em], slate-400)
- **Heading**: "Spatial Collaboration Hub" (text-5xl on mobile, text-6xl on small+ screens, font-extrabold, white)
- **Description**: "This route now serves the active Next.js application page instead of the legacy static PWA launcher." (text-lg, slate-300, max-width-3xl)

#### Status Card
- **Container**: Rounded-3xl, slate-950/80 background, padding-x-5 padding-y-4, slate-700 border, right-aligned text
- **Content**:
  - Label: "Active UI" (text-xs, uppercase, tracking-[0.24em], slate-400)
  - Status: "Next.js App" (text-3xl, font-semibold, violet-300)

### Primary Navigation Section
**Layout**: 3-column grid on medium+ screens, single column on mobile
**Gap**: 6 units between navigation cards

#### Model & Dataset Access Card
- **Container**: Rounded-3xl, slate-900 background, padding-6, slate-700 border, shadow-sm
- **Title**: "Model & Dataset Access" (text-2xl, font-semibold, white)
- **Description**: "Access QMOI Space tools for AI model workflows, dataset collaboration, and next-generation analytics." (slate-400)
- **Note**: This is an informational card without interactive elements

#### QCity Dashboard Link Card
- **Container**: Rounded-3xl, slate-900 background, padding-6, slate-700 border
- **Interactive Styling**: Hover effects (border-cyan-500, bg-slate-950)
- **Title**: "QCity Dashboard" (text-xl, font-semibold)
- **Description**: "Switch to the city command center for system operations." (slate-400)
- **Link**: Next.js Link component to "/qcity"

#### QVillage Link Card
- **Container**: Same styling as QCity card
- **Interactive Styling**: Hover effects (border-emerald-500, bg-slate-950)
- **Title**: "QVillage" (text-xl, font-semibold)
- **Description**: "Open the collaborative dataset village and community workspace." (slate-400)
- **Link**: Next.js Link component to "/qvillage"

### Secondary Features Section
**Layout**: 2-column grid on medium+ screens, single column on mobile
**Gap**: 6 units between feature cards

#### Interactive Links Card
- **Container**: Rounded-3xl, slate-900 background, padding-6, slate-700 border, shadow-sm
- **Title**: "Interactive Links" (text-2xl, font-semibold, white)
- **Description**: "Follow the active route to access QMOI system pages and avoid the old static asset path." (slate-400)
- **Interactive Element**: "Open QMOI AI" button
  - **Styling**: Inline-flex, rounded-xl, cyan-600 background, padding-x-5 padding-y-3, text-sm font-semibold, white text
  - **Hover Effect**: Background changes to cyan-500
  - **Link**: Next.js Link component to "/qmoi-ai"

#### PRODUCTIONeloper Tools Card
- **Container**: Same styling as Interactive Links card
- **Title**: "PRODUCTIONeloper Tools" (text-2xl, font-semibold, white)
- **Description**: "Use the PRODUCTIONeloper utilities for tracing, diagnostics, and internal tooling in this workspace." (slate-400)
- **Interactive Element**: "Open PRODUCTION Tools" button
  - **Styling**: Inline-flex, rounded-xl, slate-700 background, padding-x-5 padding-y-3, text-sm font-semibold, white text
  - **Hover Effect**: Background changes to slate-600
  - **Link**: Next.js Link component to "/PRODUCTION"

## User Interactions

### Navigation Elements
- **Primary Links**: Three main navigation cards with hover effects
  - QCity Dashboard: Cyan border hover effect
  - QVillage: Emerald border hover effect
- **Secondary Links**: Two action buttons in feature cards
  - QMOI AI: Cyan button with hover background change
  - PRODUCTION Tools: Gray button with hover background change

### Interactive Behavior
- **Hover Effects**: Border color and background changes on navigation cards
- **Button Interactions**: Background color transitions on hover
- **Link Navigation**: Client-side routing using Next.js Link components

### Information Display
- **Status Indication**: Active UI status card showing Next.js App
- **Route Guidance**: Instructions to use active routes instead of legacy paths
- **Feature Descriptions**: Detailed explanations of each linked system

## Responsive Behavior

### Mobile (< 768px)
- Header: Stacked vertical layout with centered status card
- Navigation Grid: Single column layout
- Feature Grid: Single column layout
- Typography: Smaller heading size (text-5xl)

### Tablet/Desktop (≥ 768px)
- Header: Horizontal layout with title left, status card right
- Navigation Grid: 3-column layout
- Feature Grid: 2-column layout
- Typography: Larger heading size (text-6xl on small screens)

## Technical Implementation

### Dependencies
- **Next.js**: Link component for client-side navigation
- **React**: Functional component structure
- **Styling**: Tailwind CSS utility classes

### Navigation Architecture
- **Client-Side Routing**: All links use Next.js Link for SPA navigation
- **Route Structure**: Connects to various app routes (/qcity, /qvillage, /qmoi-ai, /PRODUCTION)
- **Legacy Migration**: Notes about replacing static PWA launcher

### Component Structure
- **Server Component**: No "use client" directive, renders on server
- **Static Content**: No dynamic state or effects
- **Pure Navigation**: Focus on routing between different application sections

## Navigation Context
- **Route**: `/qmoi-space`
- **Connected Routes**:
  - `/qcity` - City command center
  - `/qvillage` - Community workspace
  - `/qmoi-ai` - AI assistant interface
  - `/PRODUCTION` - PRODUCTIONeloper tools
- **System Integration**: Central hub for QMOI ecosystem navigation

## Accessibility Features
- **Semantic HTML**: Proper heading hierarchy (h1, h2, h3)
- **Link Descriptions**: Descriptive text for navigation elements
- **Color Contrast**: High contrast text on dark backgrounds
- **Keyboard Navigation**: Link elements support keyboard interaction
- **Screen Reader Support**: Descriptive link text and headings

## Performance Optimizations
- **Server-Side Rendering**: Static component renders on server
- **Minimal Bundle**: No client-side JavaScript or state management
- **Efficient Styling**: Utility-first CSS approach
- **Fast Navigation**: Client-side routing prevents full page reloads

## Migration Notes
- **Legacy System**: Previously served static PWA launcher
- **Current Implementation**: Active Next.js application page
- **Route Guidance**: Instructions to use new routes instead of old static paths
- **System Evolution**: Represents transition from static assets to dynamic application

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:47.219766Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 176
- words: 1035
- characters: 7902
- headings: 30
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
