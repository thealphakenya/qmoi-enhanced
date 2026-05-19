# QCity Command Center Dashboard Screen

## Overview
The QCity Command Center serves as a comprehensive operational dashboard for smart city management, providing real-time monitoring of infrastructure, services, and incident response. It displays key metrics, service statuses, and active incident reports with role-based access controls.

## Screen Layout Structure

### Main Container
- **Background**: Full-screen dark theme (`bg-slate-950`)
- **Padding**: 8 units on all sides (`p-8`)
- **Text Color**: White (`text-white`)
- **Minimum Height**: Full viewport height (`min-h-screen`)
- **Max Width**: 7xl (80rem) with auto horizontal margins for centering

### Header Section
**Container**: Rounded card with slate-900 background, padding-8, slate-700 border, shadow-xl
**Layout**: Responsive flex layout (column on mobile, row on medium+ screens)

#### Title Area
- **Heading**: "QCity Command Center" (text-4xl, font-bold)
- **Description**: Dynamic role-based summary explaining access level
  - Master: "Full enterprise control, deployment, and monitoring access."
  - Sister: "Personal insights, collaboration, and creative workspace access."
  - User: "General QMOI features, chat, help, and view-only dashboards."
  - Guest: "Guest access with limited AI and help support."
- **Styling**: Slate-400 text color, max-width-2xl

#### User Status Card
- **Container**: Rounded-3xl, slate-950/80 background, padding-x-5 padding-y-4, slate-700 border
- **Content**:
  - Label: "Current user" (uppercase, tracking-[0.24em], slate-400)
  - Display Name: User display name (text-3xl, font-semibold, emerald-300)
  - Role: "Role: {user.role}" (slate-400)

#### Action Buttons
**Container**: Flex wrap layout with gap-3
**Conditional Rendering**: Buttons shown based on user role and permissions

- **Master Role Switch Button**: "Switch to Master Role" (cyan-600 background, hover cyan-500)
  - **Condition**: Only shown when user.role !== "master"
  - **Action**: Calls login("master") function

- **QVillage Access Button**: "Open QVillage" (emerald-600 background, hover emerald-500)
  - **Condition**: Requires "qvillage_access" permission
  - **Action**: Link to "/qvillage"

- **QMOI Space Access Button**: "Open QMOI Space" (violet-600 background, hover violet-500)
  - **Condition**: Requires "qmoi_space_access" permission
  - **Action**: Link to "/qmoi-space.html"

### Metrics Dashboard Section
**Layout**: 4-column grid on large screens, responsive collapse
**Gap**: 6 units between metric cards

#### Metric Cards (4 total)
Each card has consistent styling: rounded-3xl, slate-900 background, padding-6, slate-700 border, shadow-sm

##### Connected Nodes
- **Label**: "Connected Nodes" (uppercase, tracking-[0.24em], slate-500)
- **Value**: "128" (text-4xl, font-semibold, white)
- **Delta**: "+4%" (text-sm, emerald-300 for "good" status)

##### Active Services
- **Label**: "Active Services" (uppercase, tracking-[0.24em], slate-500)
- **Value**: "34" (text-4xl, font-semibold, white)
- **Delta**: "+1%" (text-sm, emerald-300 for "good" status)

##### Open Alerts
- **Label**: "Open Alerts" (uppercase, tracking-[0.24em], slate-500)
- **Value**: "3" (text-4xl, font-semibold, white)
- **Delta**: "-18%" (text-sm, amber-300 for "warning" status)

##### Incident Response
- **Label**: "Incident Response" (uppercase, tracking-[0.24em], slate-500)
- **Value**: "2m 30s" (text-4xl, font-semibold, white)
- **Delta**: "-12%" (text-sm, emerald-300 for "good" status)

### Operations Section
**Layout**: 2-column grid on extra-large screens (1.3fr 0.7fr ratio)
**Gap**: 6 units between sections

#### Service Operations Panel
- **Container**: Rounded-3xl, slate-900 background, padding-6, slate-700 border, shadow-sm
- **Header Layout**: Flex with justify-between, items-center
- **Title**: "Service Operations" (text-2xl, font-semibold)
- **Description**: "Operational status for core city controls." (text-sm, slate-400)
- **Timestamp**: "Updated just now" (rounded-full, slate-800 background, text-xs, uppercase, tracking-[0.24em], slate-300)

##### Service Status List
**Layout**: Space-y-4 vertical stack
Each service item: flex items-center justify-between, rounded-2xl border slate-800, slate-950/50 background, padding-x-4 padding-y-4

- **Water Supply Control**: Status badge "operational" (emerald-600/15 background, emerald-300 text, emerald-500/40 border)
- **Transit Management**: Status badge "operational" (same emerald styling)
- **Energy Grid Monitoring**: Status badge "degraded" (amber-600/15 background, amber-300 text, amber-500/40 border)
- **Public Safety Sensors**: Status badge "operational" (same emerald styling)

#### Active Incident Reports Panel
- **Container**: Same styling as Service Operations panel
- **Title**: "Active Incident Reports" (text-2xl, font-semibold)
- **Description**: "Immediate issues requiring coordination." (text-sm, slate-400)

##### Incident List
**Layout**: Space-y-3 vertical stack
Each incident: rounded-2xl border slate-800, slate-950/60 background, padding-4

###### Incident IQ-921 (High Severity)
- **Category**: "Grid Load" (font-semibold, white)
- **Severity Badge**: "high" (rounded-full, rose-600/15 background, text-xs, rose-300)
- **Summary**: "Power surge detected in sector 7" (text-sm, slate-400)
- **Report ID**: "IQ-921" (text-xs, uppercase, tracking-[0.24em], slate-500)

###### Incident IQ-913 (Medium Severity)
- **Category**: "Traffic" (font-semibold, white)
- **Severity Badge**: "medium" (rounded-full, rose-600/15 background, text-xs, rose-300)
- **Summary**: "Signal sync disruption on 5th Avenue" (text-sm, slate-400)
- **Report ID**: "IQ-913" (text-xs, uppercase, tracking-[0.24em], slate-500)

## User Interactions

### Authentication & Role Management
- **Role Switching**: Button to switch to Master role (calls login function)
- **Permission-Based Navigation**: Conditional display of QVillage and QMOI Space access buttons
- **Dynamic Content**: Role-based descriptions and feature availability

### Interactive Elements
- **Action Buttons**: Hover effects with background color changes
- **Navigation Links**: External links to related applications
- **Status Indicators**: Color-coded badges for service and incident status

### Data Display
- **Real-time Metrics**: Static values with delta indicators
- **Service Monitoring**: Status badges with color coding
- **Incident Tracking**: Severity-based highlighting and categorization

## Responsive Behavior

### Mobile (< 768px)
- Header: Stacked vertical layout
- Metrics Grid: Single column
- Operations Grid: Single column
- Action Buttons: Wrapped flex layout

### Tablet (≥ 768px)
- Header: Horizontal layout with title left, user card right
- Metrics Grid: 2-3 columns depending on screen width

### Desktop (≥ 1024px)
- Metrics Grid: 4-column layout
- Operations Grid: 2-column layout (main content + sidebar)

### Extra Large (≥ 1280px)
- Operations Grid: Custom ratio (1.3fr main, 0.7fr sidebar)
- Enhanced spacing and typography

## Technical Implementation

### Dependencies
- **React**: useMemo for role-based content optimization
- **Custom Hook**: useAuth for authentication, permissions, and login functionality
- **Styling**: Tailwind CSS utility classes with custom color schemes

### Data Structures
- **Metrics Array**: Static data with label, value, delta, and status
- **Services Array**: Service names with operational status
- **Incident Reports Array**: Incident details with ID, category, summary, and severity

### Status Badge System
- **Operational**: Emerald color scheme (green)
- **Degraded**: Amber color scheme (yellow)
- **Offline**: Rose color scheme (red)
- **Default**: Slate color scheme (gray)

### State Management
- **User State**: Retrieved from useAuth hook
- **Role-Based Logic**: Computed permissions and conditional rendering
- **Memoized Content**: Role summary cached with useMemo

## Navigation Context
- **Route**: `/qcity`
- **External Links**: QVillage (/qvillage), QMOI Space (/qmoi-space.html)
- **Role Switching**: Internal authentication state change
- **Integration**: Part of QMOI ecosystem with cross-application navigation

## Accessibility Features
- **Semantic HTML**: Proper heading hierarchy (h1, h2)
- **Color Contrast**: High contrast text and status indicators
- **Keyboard Navigation**: Button and link elements support keyboard interaction
- **Screen Reader Support**: Descriptive labels and status text

## Performance Optimizations
- **Static Data**: Pre-defined arrays prevent API calls
- **Memoized Computations**: Role summary cached to prevent re-renders
- **Conditional Rendering**: Only renders accessible features and buttons
- **Efficient Styling**: Utility-first CSS approach minimizes bundle size