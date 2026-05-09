# QMOI Enhanced Navigation & User Flows

## Application Navigation Architecture

The QMOI Enhanced application uses a Next.js App Router-based navigation system organized around major user journeys and role-based access patterns.

## Primary Navigation Structure

### Home Screen (`/`)
**Role Access**: All users (Guest, User, Sister, Master)
**Purpose**: Main application hub with feature navigation

#### Navigation Destinations
- **Admin Dashboard** → `/admin` (Master/Admin users)
- **PRODUCTIONices** → `/PRODUCTIONices` (All authenticated users)
- **QMOI AI** → `/qmoi-ai` (All authenticated users)
- **QCity** → `/qcity` (All authenticated users)
- **QVillage** → `/qvillage` (All authenticated users)
- **QMOI Space** → `/qmoi-space` (All authenticated users)
- **Friendship** → `/friendship` (All authenticated users)

### Master Administration Hub
**Role Access**: Master role required
**Parent Route**: Accessible from multiple screens

#### Master Email Configuration (`/master/email`)
- **Purpose**: SMTP/email server configuration
- **Access**: Master role exclusive
- **Previous Navigation**: From Master Portal or Admin Dashboard
- **Related Routes**: `/master/links`, `/master/tracks`

#### Master Links Management (`/master/links`)
- **Purpose**: Global link and routing management
- **Access**: Master role exclusive
- **Placeholder**: Empty state (no links configured)
- **Future**: Link creation and editing UI

#### Master Tracks Management (`/master/tracks`)
- **Purpose**: System operations tracking
- **Access**: Master role exclusive
- **Placeholder**: Empty state (no active tracks)
- **Future**: Track monitoring and management UI

### System Management Routes

#### Admin Dashboard (`/admin`)
- **Role Access**: Admin/Master role
- **Metrics Displayed**: System health, PRODUCTIONices, users, activities
- **Actions Available**:
  - View system metrics
  - Monitor performance
  - Access master controls
- **Previous Navigation**: Home screen, QMOI Space hub
- **Next Navigation**: PRODUCTIONice Management, QCity, Master Email

#### PRODUCTIONice Management (`/PRODUCTIONices`)
- **Role Access**: All authenticated users
- **Purpose**: Monitor and manage connected PRODUCTIONices
- **Features**:
  - PRODUCTIONice filtering and search
  - Real-time status monitoring
  - PRODUCTIONice-specific settings
- **Previous Navigation**: Home, Admin Dashboard, QCity
- **Next Navigation**: PRODUCTIONice settings, QCity

### Ecosystem Hub Routes

#### QMOI AI Hub (`/qmoi-ai`)
- **Role Access**: All authenticated users
- **Purpose**: AI assistant interface and navigation
- **Layout**: Hero section with navigation to AI features
- **Components**: Status card, feature grid, navigation buttons
- **Quick Links**: QCity, QVillage, other related systems

#### QCity Command Center (`/qcity`)
- **Role Access**: All authenticated users
- **Purpose**: Smart city operations control
- **Role-Based Features**:
  - Master: Full enterprise control
  - Sister: Personal insights and collaboration
  - User: View-only dashboards
- **Components**: Metrics, service operations, incident reports
- **Navigation**: To QVillage, QMOI Space, role switching

#### QVillage Community Hub (`/qvillage`)
- **Role Access**: All authenticated users
- **Purpose**: Community dataset and model management
- **Role-Based Access**:
  - Master: Dataset management and editing
  - Sister/User: Dataset browsing and access
- **Features**:
  - Dataset management
  - Model deployment
  - Community automation
- **Navigation**: To QCity, QMOI Space

#### QMOI Space Hub (`/qmoi-space`)
- **Role Access**: All authenticated users
- **Purpose**: Central navigation hub for ecosystem
- **Components**: Navigation cards to other systems
- **Quick Links**:
  - Model & Dataset Access (Info card)
  - QCity Dashboard (Link to `/qcity`)
  - QVillage (Link to `/qvillage`)
  - QMOI AI (Button to `/qmoi-ai`)
  - PRODUCTIONeloper Tools (Button to `/PRODUCTION`)
- **Styling**: Replacement for legacy static PWA launcher

### Engagement & Communication

#### Friendship Interface (`/friendship`)
- **Role Access**: All authenticated users
- **Purpose**: Interactive AI companion chat
- **Features**:
  - Conversational AI
  - Emotional state tracking
  - Health monitoring
  - System control through chat
- **Context**: Maintains emotional bonding metrics
- **Navigation**: Sidebar or command access

### PRODUCTIONelopment & Testing

#### PRODUCTIONeloper Utilities (`/PRODUCTION`)
- **Role Access**: PRODUCTIONelopers/Admin
- **Purpose**: Internal PRODUCTIONelopment tools
- **Components**:
  - API Endpoint Tester
  - Debug Console
- **Access**: From QMOI Space or direct URL
- **Safety**: Isolated from production systems

#### Test Page (`/test`)
- **Role Access**: Public/testing
- **Purpose**: Deployment verification
- **Content**: Minimal test heading
- **Use Case**: Verify application routing and rendering

## User Journey Flows

### Guest User Journey
```
Guest User
    ↓
Home Screen (view-only)
    ↓
Login/Register Challenge
    ↓
Authentication Route
```

### New User Journey (After Auth)
```
Authenticated User
    ↓
Home Screen (full features)
    ↓
Choose System:
├─ PRODUCTIONices (/PRODUCTIONices) - Manage PRODUCTIONices
├─ QMOI AI (/qmoi-ai) - AI assistant
├─ QCity (/qcity) - City operations
├─ QVillage (/qvillage) - Community
└─ Friendship (/friendship) - AI companion
```

### Master User Journey
```
Master User
    ↓
Home Screen
    ↓
Admin Dashboard (/admin)
    ↓
Choose Admin Function:
├─ Master Email (/master/email)
├─ Master Links (/master/links)
├─ Master Tracks (/master/tracks)
└─ System Management
    ↓
PRODUCTIONice/User/System Management
```

### System Operator Journey
```
System Operator
    ↓
QCity Command Center (/qcity)
    ↓
Monitor Services & Incidents
    ↓
Action: Escalate/Resolve/Investigate
    ↓
Optional: Switch to QVillage (/qvillage)
```

### Data Scientist Journey
```
Data Scientist/Sister
    ↓
QVillage (/qvillage)
    ↓
Dataset Management
    ↓
Model Deployment
    ↓
Training & Testing
    ↓
Optional: PRODUCTIONice Management (/PRODUCTIONices)
```

## Role-Based Navigation Restrictions

### Master Role Permissions
- ✅ Admin Dashboard
- ✅ Master Email Configuration
- ✅ Master Links Management
- ✅ Master Tracks Management
- ✅ All public routes
- ✅ Role switching capability

### Sister Role Permissions
- ✅ All public routes
- ✅ Dataset management (limited)
- ✅ Model deployment
- ✅ PRODUCTIONice access
- ✅ Friendship/AI companion
- ❌ Admin functions
- ❌ Master configuration

### User Role Permissions
- ✅ All public routes
- ✅ View-only dashboards
- ✅ PRODUCTIONice monitoring
- ✅ AI assistant access
- ✅ Friendship/AI companion
- ❌ Admin functions
- ❌ Dataset editing
- ❌ Master controls

### Guest Role Permissions
- ✅ Limited public pages
- ✅ Help guide
- ✅ Onboarding flows
- ❌ Authenticated routes
- ❌ System management
- ❌ PRODUCTIONice access

## Navigation Components & Patterns

### Cross-Platform Navigation
- **Next.js Link Component**: Client-side navigation throughout
- **Route Parameters**: Support for dynamic routes
- **Query Parameters**: Support for filtering and state

### Navigation UI Elements

#### Navigation Cards
- Used in: Home, QMOI Space, QCity, QVillage, QMOI AI
- Pattern: Grid or flex layout with hover effects
- Interaction: Click to navigate to related system
- Color Coding: Unique colors per system (cyan, emerald, violet)

#### Header Navigation
- Route breadcrumb information
- User role status display
- Quick access buttons based on permissions

#### Sidebar Navigation
- Secondary navigation within systems
- Collapsible menu items
- Mobile-responsive (hidden on mobile)

### Responsive Navigation Patterns

#### Mobile (< 768px)
- Hamburger menu for main navigation
- Bottom tab bar for quick access
- Stack-based navigation (no horizontal menus)
- Touch-friendly button sizing

#### Tablet (768px - 1024px)
- Vertical sidebar with expanded menu
- Horizontal quick-access bar
- Balance between space and usability

#### Desktop (> 1024px)
- Full navigation sidebar
- Persistent top bar
- Multiple navigation options visible

## Between-System Navigation

### Common Cross-System Paths

#### Admin Dashboard → Master Email
- Path: `/admin` → `/master/email`
- Trigger: "Email Configuration" button
- Returns: Back to Admin Dashboard

#### QCity → QVillage
- Path: `/qcity` → `/qvillage`
- Trigger: "Open QVillage" link
- Context: Maintains user role and session

#### QMOI Space (Hub) → Any System
- Path: `/qmoi-space` → `/qcity`, `/qvillage`, `/qmoi-ai`, `/PRODUCTION`
- Trigger: Card/button click on hub
- Purpose: Central navigation distribution

#### QMOI AI → PRODUCTIONice Management
- Path: `/qmoi-ai` → `/PRODUCTIONices`
- Trigger: AI suggestion or user command
- Context: AI-mediated system navigation

## Authentication & Access Control

### Route Middleware
- Checks authentication state before rendering
- Verifies role-based permissions
- Redirects unauthorized access to login/error

### Permission Checking
```
Routes by Access Level:
├─ Public: `/test`, `/` (guest view)
├─ Authenticated: `/PRODUCTIONices`, `/qmoi-ai`, `/friendship`
├─ Admin: `/admin`, `/qcity`, `/qvillage`, `/qmoi-space`
└─ Master: `/master/**` (all master routes)
```

### Session Management
- User context maintained globally
- Role information passed through context
- Permission caching for performance

## State Persistence Across Navigation

### URL State
- Route parameters preserve navigation context
- Query parameters maintain filter state
- Bookmarkable URLs for key views

### Local Storage
- User preferences (theme, language, settings)
- Recent route history
- UI state (collapsed menus, etc.)

### Session Context
- Current user information
- Active role/permissions
- Communication channels
- Emotional AI state

## Error Handling & Fallbacks

### 404 Pages
- Route not found
- Redirect to nearest parent route
- Return to home option

### 403 Unauthorized
- Insufficient permissions
- Suggest upgrade or contact admin
- Redirect to accessible route

### 500 Server Errors
- System error display
- Fallback to cached content
- Retry navigation option

## Navigation Best Practices

### For Users
1. Use main hub (Home or QMOI Space) as entry point
2. Bookmark frequently accessed systems
3. Use role-appropriate features
4. Contact admin for permission issues

### For PRODUCTIONelopers
1. Use Next.js Link for internal navigation
2. Implement proper error boundaries
3. Validate user permissions before rendering
4. Maintain consistent navigation patterns
5. Test responsive navigation on all breakpoints

### For Administrators
1. Configure role permissions clearly
2. Monitor navigation analytics
3. Optimize frequently used paths
4. Maintain updated documentation
5. Test new route additions

## Dynamic Navigation Features

### AI-Suggested Navigation
- Friendship component suggests next steps
- Based on user activity and preferences
- Contextual recommendations

### Breadcrumb Trails
- Show user current location
- Enable quick backtracking
- Support multi-level navigation

### Search Navigation
- Global search across systems
- Quick jump to specific features
- Keyword-based route matching

## Future Navigation Enhancements

### Planned Features
- Advanced search with filters
- Customizable navigation shortcuts
- Voice command navigation
- Gesture-based navigation
- Predictive route suggestions
- Navigation history with forward/back
- Favorites/bookmarks system
- Customizable sidebar organization

### Performance Optimizations
- Route prefetching for common paths
- Lazy loading of navigation UI
- Cached route metadata
- Optimized permission checking