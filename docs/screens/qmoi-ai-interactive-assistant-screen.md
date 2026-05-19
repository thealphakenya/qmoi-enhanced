# QMOI AI Interactive Assistant Screen

## Screen Information
- **Screen Name:** QMOI AI Interactive Assistant
- **File Path:** `app/qmoi-ai/page.tsx`
- **Route:** `/qmoi-ai`
- **Purpose:** Central hub for accessing QMOI AI features, connecting to various AI-powered dashboards, and providing navigation to related AI and collaboration tools within the QMOI ecosystem.

## What the User Sees on Opening

### Layout Structure
- **Background:** Full-screen dark theme (slate-950)
- **Container:** Centered content with maximum width of 6xl (1152px)
- **Padding:** 8 units (32px) on all sides
- **Spacing:** Vertical spacing of 10 units between major sections
- **Text Color:** White text throughout

### Hero Section (Top)
- **Container:** Rounded 3xl corners, dark background (slate-900), 8 units padding, slate-700 border, shadow-xl
- **Layout:** Responsive flex (column on mobile, row on medium+ screens)
- **Content:** Left-aligned text, right-aligned status card

### Feature Grid Section (Middle)
- **Layout:** Responsive grid (1 column mobile, 3 columns medium+)
- **Gap:** 6 units between cards
- **Card Design:** Rounded 3xl corners, slate-900 background, 6 units padding, slate-700 border

### Bottom Section
- **Layout:** 2-column responsive grid
- **Gap:** 6 units between cards
- **Card Design:** Consistent with feature grid

## UI Elements

### Hero Section Components

#### Brand Header
- **Label:** "QMOI AI" (small text, uppercase, letter spacing, slate-400)
- **Title:** "Interactive AI Assistant" (5xl font, extra bold, white, responsive sizing)
- **Description:** Multi-line paragraph explaining the AI assistant functionality

#### Status Card (Right Side)
- **Container:** Rounded 3xl corners, dark background (slate-950 with 80% opacity), padding 5x4, slate-700 border
- **Alignment:** Text right-aligned
- **Label:** "Active UI" (extra small, uppercase, letter spacing, slate-400)
- **Value:** "Next.js App" (3xl font, semibold, cyan-300 color)

### Feature Cards (3 cards in top grid)

#### Card 1: Ask QMOI (Non-interactive)
- **Title:** "Ask QMOI" (2xl font, semibold, white)
- **Description:** "Launch QMOI AI conversations, explore assistant workflows, and connect to the live dashboard network."
- **No Link:** Static informational card

#### Card 2: QCity Dashboard (Interactive Link)
- **Link:** `/qcity`
- **Title:** "QCity Dashboard" (xl font, semibold)
- **Description:** "Open the city operations dashboard and spatial command center."
- **Hover Effects:** Border changes to cyan-500, background to slate-950

#### Card 3: QMOI Space (Interactive Link)
- **Link:** `/qmoi-space`
- **Title:** "QMOI Space" (xl font, semibold)
- **Description:** "Open QMOI Space for collaboration, model access, and spatial tools."
- **Hover Effects:** Border changes to violet-500, background to slate-950

### Bottom Section Cards (2 cards)

#### Card 1: QVillage Access
- **Title:** "QVillage Access" (2xl font, semibold, white)
- **Description:** "Navigate to QVillage for community dataset coordination, model collaboration, and shared workflows."
- **Button:** "Open QVillage" link to `/qvillage`
- **Button Styling:** Emerald background (emerald-600), hover emerald-500, rounded-xl, padding 5x3, small text, semibold

#### Card 2: PRODUCTIONeloper & Support
- **Title:** "PRODUCTIONeloper & Support" (2xl font, semibold, white)
- **Description:** "If this page is reaching you from the Next.js app, the QMOI system is wired correctly and active routes are available."
- **Button:** "Open PRODUCTION Tools" link to `/PRODUCTION`
- **Button Styling:** Slate background (slate-700), hover slate-600, rounded-xl, padding 5x3, small text, semibold

## User Interactions

### Primary Actions
- **Navigate to QCity:** Click "QCity Dashboard" card
- **Navigate to QMOI Space:** Click "QMOI Space" card
- **Navigate to QVillage:** Click "Open QVillage" button
- **Navigate to PRODUCTION Tools:** Click "Open PRODUCTION Tools" button
- **View Information:** Read static content about AI features

### Interactive Elements
- **Navigation Cards:** Hover effects with border and background color changes
- **Action Buttons:** Hover effects with background color changes
- **All Links:** Use Next.js Link component for client-side navigation

### Visual Feedback
- **Card Hover States:**
  - QCity: Border cyan-500, background slate-950
  - QMOI Space: Border violet-500, background slate-950
- **Button Hover States:**
  - QVillage: emerald-600 to emerald-500
  - PRODUCTION Tools: slate-700 to slate-600
- **Transitions:** Smooth transitions for all hover effects

## Navigation Flow

### Entry Points
- **Home Screen:** "QMOI AI" feature card
- **Direct URL:** `/qmoi-ai`

### Exit Points
- **QCity Dashboard:** `/qcity`
- **QMOI Space:** `/qmoi-space`
- **QVillage:** `/qvillage`
- **PRODUCTION Tools:** `/PRODUCTION`

### Navigation Pattern
```
Home Screen
    ↓
QMOI AI Hub (/qmoi-ai)
    ├── QCity Dashboard (/qcity)
    ├── QMOI Space (/qmoi-space)
    ├── QVillage (/qvillage)
    └── PRODUCTION Tools (/PRODUCTION)
```

## Responsive Behavior

### Mobile (< 768px)
- Hero section stacks vertically (flex-col)
- Single column grids for all card sections
- Smaller title sizing (text-5xl)
- Status card appears below main content

### Tablet/Desktop (≥ 768px)
- Hero section horizontal layout (flex-row)
- Multi-column grids (3 columns top, 2 columns bottom)
- Larger title sizing (text-6xl)
- Status card positioned on the right

## Performance Considerations
- **Static Content:** No dynamic data fetching
- **Client-side Navigation:** All links use Next.js Link for fast transitions
- **Bundle Size:** Minimal imports (React, Next.js Link)
- **No API Calls:** Purely navigational page

## Related Components
- **None directly imported** - Page component using HTML elements and Next.js Link

## Code Structure
```typescript
export default function QMoiAIPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Hero Section */}
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          {/* Header content and status card */}
        </section>

        {/* Feature Grid - 3 cards */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Ask QMOI card (static) */}
          {/* QCity link card */}
          {/* QMOI Space link card */}
        </section>

        {/* Bottom Section - 2 cards */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* QVillage access card */}
          {/* PRODUCTIONeloper support card */}
        </section>

      </div>
    </main>
  );
}
```

## Color Scheme
- **Primary Background:** slate-950 (very dark)
- **Card Backgrounds:** slate-900 (dark)
- **Text:** white (primary), slate-300 (secondary), slate-400 (muted)
- **Accent Colors:**
  - Cyan: cyan-300 (status), cyan-500 (hover)
  - Violet: violet-500 (hover)
  - Emerald: emerald-600/emerald-500 (QVillage button)
  - Slate: slate-700/slate-600 (PRODUCTION button)

## Accessibility Features
- **Semantic HTML:** Proper heading hierarchy (h1, h2, h3)
- **Link Accessibility:** All navigation links are properly structured
- **Color Contrast:** High contrast between text and backgrounds
- **Focus States:** Default browser focus indicators for interactive elements

## Future Enhancements
- **AI Integration:** Connect to actual AI assistant functionality
- **Dynamic Content:** Load AI conversation history or recent interactions
- **Interactive Demo:** Live AI chat interface on the page
- **Feature Status:** Show which AI features are currently active
- **User Preferences:** Remember navigation preferences
- **Analytics:** Track which features users access most

## Testing Notes
- **Navigation Testing:** All link destinations and hover states
- **Responsive Design:** Layout changes across breakpoints
- **Visual Design:** Dark theme consistency and color scheme
- **Accessibility:** Screen reader compatibility and keyboard navigation
- **Performance:** Page load speed and navigation transitions