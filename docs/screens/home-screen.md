---
quantum-enabled: false
---

# Home Screen (Landing Page)

## Screen Information
- **Screen Name:** Home Screen / Feature Hub
- **File Path:** `app/page.tsx`
- **Route:** `/`
- **Purpose:** Main entry point and navigation hub for the QMOI Enhanced application. Provides access to all major features and serves as a central dashboard for exploring the application's capabilities.

## What the User Sees on Opening

### Layout Structure
- **Background:** Full-screen dark theme (slate-950 background color)
- **Container:** Centered content with maximum width of 7xl (1280px)
- **Padding:** 8 units (32px) on all sides
- **Minimum Height:** Full viewport height (min-h-screen)

### Header Section (Top)
- **Brand Label:** "QMOI Enhanced" (small text, uppercase, letter spacing, slate-400 color)
- **Main Title:** "Actual UI Feature Hub" (5xl font size, extra bold, white color, responsive sizing)
- **Subtitle:** Descriptive paragraph explaining the application's purpose and component inventory

### Feature Grid Section (Middle)
- **Layout:** Responsive grid (1 column on mobile, 2 on medium screens, 3 on large screens)
- **Gap:** 6 units (24px) between cards
- **Card Design:**
  - Rounded corners (3xl border radius)
  - Dark background (slate-900 with 90% opacity)
  - Border (slate-800 color)
  - Padding: 6 units (24px)
  - Hover effects: lift animation, border color change to blue-500, background darkening

### PRODUCTIONeloper Resources Section (Bottom)
- **Container:** Rounded corners (3xl), dark background, padding 8 units
- **Title:** "PRODUCTIONeloper & UI Inventory" (3xl font, bold, white)
- **Description:** Text explaining the documentation structure
- **Resource Cards:** 2-column grid on small screens and up
  - COMPONENTS.md card
  - UI_COMPONENTS.md card
  - TREE.md card (inferred from code structure)

## UI Elements

### Navigation Cards (8 total)
Each card contains:
- **Title:** Feature name (2xl font, semibold, white, hover changes to blue-400)
- **Description:** Feature purpose (slate-400 color)
- **Action Indicator:** "Open page →" text with arrow (blue-300 color)

#### Card 1: device Management
- **Link:** `/devices`
- **Title:** "device Management"
- **Description:** "Monitor and manage connected devices across the QMOI ecosystem."

#### Card 2: Admin Dashboard
- **Link:** `/admin`
- **Title:** "Admin Dashboard"
- **Description:** "Access administrative systems, health metrics, and monitoring tools."

#### Card 3: QCity Dashboard
- **Link:** `/qcity`
- **Title:** "QCity Dashboard"
- **Description:** "Explore QCity operations and spatial interfaces."

#### Card 4: QMOI AI
- **Link:** `/qmoi-ai`
- **Title:** "QMOI AI"
- **Description:** "Open the active QMOI AI assistant route in the Next.js application."

#### Card 5: QMOI Space
- **Link:** `/qmoi-space`
- **Title:** "QMOI Space"
- **Description:** "Open the active QMOI Space route in the Next.js application."

#### Card 6: Master Email Dashboard
- **Link:** `/master/email`
- **Title:** "Master Email Dashboard"
- **Description:** "Master-level communication dashboard for email and messaging."

#### Card 7: Master Links Dashboard
- **Link:** `/master/links`
- **Title:** "Master Links Dashboard"
- **Description:** "Manage and monitor master-level link operations."

#### Card 8: PRODUCTIONeloper Utilities
- **Link:** `/PRODUCTION`
- **Title:** "PRODUCTIONeloper Utilities"
- **Description:** "PRODUCTIONeloper tools, self-service pages, and automation utilities."

### Documentation Links (3 total)
- **COMPONENTS.md:** "React component inventory and feature categorization."
- **UI_COMPONENTS.md:** "Shared UI primitives inventory for the system."
- **TREE.md:** "Repository structure and PRODUCTIONeloper architecture guide."

## User Interactions

### Primary Actions
- **Click/Tap Feature Card:** Navigates to the linked route using Next.js Link component
- **Hover on Card:** Visual feedback (lift animation, color changes)
- **Click Documentation Link:** Opens the respective markdown file

### Visual Feedback
- **Hover State:** Cards lift up (-translate-y-1), border changes to blue-500, background darkens
- **Transition:** Smooth 200ms duration transitions for all hover effects

### Accessibility
- **Semantic HTML:** Uses proper heading hierarchy (h1, h2)
- **Color Contrast:** White text on dark backgrounds with appropriate contrast ratios
- **Focus States:** Link elements are focusable for keyboard navigation

## Responsive Behavior

### Mobile (< 768px)
- Single column grid for feature cards
- Smaller title sizing (text-5xl)
- Reduced padding and margins

### Tablet (768px - 1024px)
- 2-column grid for feature cards
- Medium title sizing

### Desktop (> 1024px)
- 3-column grid for feature cards
- Large title sizing (text-6xl)
- Full 7xl max-width container

## Loading States
- **Initial Load:** No loading state shown (static content)
- **Navigation:** Handled by Next.js routing (client-side navigation)

## Error States
- **Route Not Found:** Handled by Next.js 404 page (not defined in this component)
- **Network Issues:** No network-dependent content on this page

## Performance Considerations
- **Static Content:** All content is static, no API calls
- **Bundle Size:** Minimal imports (only Next.js Link)
- **SEO:** Proper heading structure and semantic HTML

## Related Components
- **None directly imported** - This is a pure page component using only HTML elements and Tailwind CSS classes

## Code Structure
```typescript
// Main component structure
<main className="min-h-screen bg-slate-950 text-slate-100 p-8">
  <div className="max-w-7xl mx-auto">
    {/* Header section */}
    <section className="mb-10">
      {/* Brand and title */}
    </section>

    {/* Feature grid */}
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Mapped feature cards */}
    </section>

    {/* PRODUCTIONeloper resources */}
    <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/90 p-8">
      {/* Documentation links */}
    </section>
  </div>
</main>
```

## Navigation Context
- **Entry Point:** This is the root route (`/`) - first screen users see
- **Exit Points:** Links to 8 different feature routes
- **Back Behavior:** N/A (this is the home screen)
- **Deep Linking:** Supports direct navigation to any feature route

## Testing Notes
- **Visual Regression:** Card hover states and responsive breakpoints
- **Accessibility:** Keyboard navigation and screen reader compatibility
- **Cross-browser:** Dark theme rendering consistency