# Universals - Shared Features Across All QMOI Apps

**Purpose:** Document all universal/shared features that should be available in every QMOI app (qmoi-ai, qmoi-space, qcity, qvillage, qalpha).

**Last Updated:** 2026-06-22  
**Status:** Active - Implementation tracking in progress

---

## Table of Contents

1. [Universal Features](#universal-features)
2. [Authentication & Authorization](#authentication--authorization)
3. [Navigation & Routing](#navigation--routing)
4. [Data Management](#data-management)
5. [Hardware Integration](#hardware-integration)
6. [Permissions & Security](#permissions--security)
7. [User Preferences](#user-preferences)
8. [Notifications & Alerts](#notifications--alerts)
9. [Analytics & Telemetry](#analytics--telemetry)
10. [Implementation Checklist](#implementation-checklist)

---

## Universal Features

All apps must support these core features:

### 1. Authentication System
- **Single Sign-On (SSO)** - One login for all apps
- **Session Management** - Persistent sessions across all apps
- **Multi-device Support** - Log in on multiple devices
- **Session Termination** - End sessions from any device
- **Password Reset** - Secure password recovery
- **Email Verification** - Confirm user email
- **Biometric Authentication** - Face/fingerprint login
- **Two-Factor Authentication** - Additional security layer

**Shared Files:**
```
lib/auth/
├── useAuth.ts               # Main auth hook
├── AuthContext.tsx          # Auth provider
├── AuthService.ts           # API service
├── sessionManager.ts        # Session handling
├── biometric.ts             # Biometric feature
└── mfa.ts                   # 2FA implementation
```

**Entry Points:**
```
/login          - Shared login page
/register       - Shared registration
/verify-email   - Email verification
/reset-password - Password reset
/forgot-password - Password recovery
/profile        - User profile management
```

### 2. Navigation System
- **Universal Sidebar** - Consistent navigation across apps
- **App Switcher** - Quick switch between apps
- **Breadcrumb Navigation** - Hierarchical path display
- **Search Functionality** - Global search across features
- **Command Palette** - Quick action access (⌘+K)

**Shared Files:**
```
lib/components/navigation/
├── Sidebar.tsx          # Main navigation
├── AppSwitcher.tsx      # App switcher component
├── Breadcrumb.tsx       # Breadcrumb display
├── CommandPalette.tsx   # Command/search interface
└── MobileNav.tsx        # Mobile navigation
```

### 3. Universal Portal (`/universal`)
- **App Discovery** - Find and access all apps
- **Recent Items** - Recently accessed features
- **Favorites** - Bookmarked features
- **Quick Links** - Shortcuts to common tasks
- **Status Dashboard** - System status at a glance
- **Unified Search** - Search across all apps

**Location:**
```
app/universal/
├── page.tsx             # Main universal portal
├── layout.tsx           # Universal layout
├── components/
│   ├── AppGrid.tsx      # App discovery
│   ├── RecentItems.tsx  # Recent activity
│   ├── Favorites.tsx    # Bookmarked items
│   └── StatusBoard.tsx  # System status
└── api/
    ├── apps/route.ts    # Get available apps
    ├── search/route.ts  # Global search
    └── status/route.ts  # System status
```

### 4. Theme System
- **Dark/Light Mode** - User preference
- **Auto Theme** - System theme sync
- **Custom Colors** - User-selectable accent colors
- **Font Size** - Accessibility text sizing
- **Reduced Motion** - Accessibility animation toggle

**Shared Files:**
```
lib/theme/
├── useTheme.ts          # Theme hook
├── ThemeContext.tsx     # Theme provider
├── themes/
│   ├── light.ts         # Light theme tokens
│   └── dark.ts          # Dark theme tokens
└── storage.ts           # Theme persistence
```

### 5. Accessibility Features
- **WCAG 2.1 AA Compliance** - Web accessibility standards
- **Screen Reader Support** - Aria labels and roles
- **Keyboard Navigation** - Full keyboard support
- **High Contrast Mode** - For low vision users
- **Text Scaling** - Configurable font sizes
- **Motion Preferences** - Reduced motion support

---

## Authentication & Authorization

### Unified Auth Context

**Provider location:** `lib/auth/AuthContext.tsx`

**Features:**
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login(email: string, password: string): Promise<void>;
  register(data: RegisterData): Promise<void>;
  logout(): Promise<void>;
  refreshSession(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  enableBiometric(): Promise<void>;
  disableBiometric(): Promise<void>;
  getTwoFAStatus(): Promise<boolean>;
  setupTwoFA(): Promise<QRCode>;
  verifyTwoFA(code: string): Promise<void>;
}
```

**Usage in all apps:**
```typescript
import { useAuth } from '@/lib/auth/useAuth';

function MyApp() {
  const { user, login, logout } = useAuth();
  
  // Use auth features...
}
```

### Role-Based Access Control (RBAC)

**Roles defined:**
- **admin** - Full system access
- **moderator** - Content moderation access
- **user** - Standard user access
- **guest** - Limited guest access
- **developer** - Development/debug access

**Usage:**
```typescript
const { user, hasPermission } = useAuth();

if (hasPermission('admin')) {
  // Show admin panel
}
```

---

## Navigation & Routing

### App Navigation Structure

**All apps follow same pattern:**
```
/[app-name]/
├── /dashboard           # App dashboard
├── /settings            # App settings
├── /profile             # User profile
├── /help                # Help/documentation
└── /search              # App-specific search
```

### Sidebar Configuration

**App-specific sidebar config:**
```typescript
// lib/config/sidebarConfig.ts
interface SidebarConfig {
  app: string;
  items: NavItem[];
  contextMenu?: MenuAction[];
  footer?: ComponentType;
}

export const qmoiAiSidebar: SidebarConfig = {
  app: 'qmoi-ai',
  items: [
    { label: 'Dashboard', href: '/qmoi-ai', icon: 'Dashboard' },
    { label: 'Chat', href: '/qmoi-ai/chat', icon: 'MessageCircle' },
    // ...
  ]
};
```

---

## Data Management

### Unified State Management

**Using React Context + Zustand:**
```
lib/store/
├── auth.store.ts        # Auth state
├── theme.store.ts       # Theme state
├── user.store.ts        # User data state
├── notifications.store.ts # Notification state
└── app.store.ts         # App-specific state
```

### API Service Layer

**Centralized API client:**
```typescript
// lib/api/client.ts
export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  interceptors: {
    request: authInterceptor,
    response: errorInterceptor,
  }
});
```

### Caching Strategy

**Universal caching rules:**
- User data: 5 minutes
- App metadata: 1 hour
- Static resources: 24 hours
- Session data: Real-time (no cache)

---

## Hardware Integration

### Camera Access (QCamera)

**Shared camera hook:**
```typescript
// lib/hooks/useCamera.ts
const useCamera = () => {
  const { hasPermission, requestPermission } = usePermissions('camera');
  
  return {
    hasPermission,
    requestPermission,
    capturePhoto,
    captureVideo,
    switchCamera,
    startLiveStream,
  };
};
```

**Available in all apps:**
- `/[app]/camera` - Camera interface
- `/[app]/gallery` - Photo/video gallery
- QCamera component for embedding in features

### Microphone Access

**Audio recording support:**
```typescript
// lib/hooks/useMicrophone.ts
const useMicrophone = () => {
  return {
    hasPermission,
    requestPermission,
    startRecording,
    stopRecording,
    playback,
  };
};
```

### Location Access

**Geolocation support:**
```typescript
// lib/hooks/useLocation.ts
const useLocation = () => {
  return {
    location,
    hasPermission,
    requestPermission,
    watchPosition,
    startTracking,
  };
};
```

---

## Permissions & Security

### Permission System

**Universal permission model:**
```typescript
interface Permission {
  type: 'camera' | 'microphone' | 'location' | 'storage' | 'biometric';
  status: 'granted' | 'denied' | 'prompt';
  requestedAt?: string;
  grantedAt?: string;
}

// Usage
const { permissions, requestPermission } = usePermissions();
if (permissions.camera?.status !== 'granted') {
  await requestPermission('camera');
}
```

### Privacy Controls

**User privacy features:**
- Privacy mask (blur video/photos)
- Data encryption at rest
- Secure local storage
- Session timeout
- Automatic logout
- Delete all data option

---

## User Preferences

### Settings Schema

**Unified user settings:**
```typescript
interface UserSettings {
  // Display
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  reducedMotion: boolean;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  
  // Privacy
  dataCollection: 'minimal' | 'standard' | 'full';
  biometricEnabled: boolean;
  sessionTimeout: number;
  
  // Accessibility
  highContrast: boolean;
  screenReaderMode: boolean;
  keyboardShortcuts: boolean;
}
```

**Stored in:** `lib/storage/userSettings.ts`

---

## Notifications & Alerts

### Notification System

**Universal notification service:**
```typescript
// lib/notifications/useNotifications.ts
const useNotifications = () => {
  return {
    showSuccess(message: string),
    showError(message: string),
    showWarning(message: string),
    showInfo(message: string),
    showNotification(type: string, message: string, duration?: number),
  };
};
```

### Alert Management

**Centralized alerts:**
- System alerts (maintenance, outages)
- User alerts (actions needed)
- Debug alerts (dev mode only)

---

## Analytics & Telemetry

### Event Tracking

**Universal event tracking:**
```typescript
// lib/analytics/useAnalytics.ts
const useAnalytics = () => {
  return {
    trackEvent(eventName: string, properties?: object),
    trackPageView(pageName: string),
    trackError(error: Error),
    trackPerformance(metric: PerformanceMetric),
  };
};
```

### User Behavior Tracking

**Events captured:**
- Page views
- User interactions
- Feature usage
- Performance metrics
- Error events
- Custom business events

---

## Implementation Checklist

### Per App (qmoi-ai, qmoi-space, qcity, qvillage, qalpha)

- [ ] Authentication system fully implemented
- [ ] Session management working
- [ ] Biometric login available
- [ ] Password reset flow working
- [ ] Email verification implemented
- [ ] Universal sidebar integrated
- [ ] App switcher functional
- [ ] Theme system working (dark/light/auto)
- [ ] Accessibility features enabled
- [ ] Camera access available
- [ ] Microphone access available
- [ ] Permissions system implemented
- [ ] User settings page available
- [ ] Notifications working
- [ ] Analytics tracking enabled
- [ ] All universal routes accessible
- [ ] Help/documentation accessible
- [ ] Profile management working

### Documentation Requirements

- [ ] UNIVERSALS.md updated (this file)
- [ ] STYLES.md includes universal components
- [ ] COMPONENTS.md lists all shared components
- [ ] API.md includes universal endpoints
- [ ] ROUTES.md includes universal routes
- [ ] README per app points to universal features

---

## Verification Commands

```bash
# Check all apps have universal features
npm run test -- --testPathPattern="universal"

# Verify universal routes exist
npm run build && npm run test:e2e -- --testPathPattern="universal"

# Check authentication works across apps
npm run test -- --testNamePattern="auth.*unified"

# Verify permission handling
npm run test -- --testNamePattern="permissions"
```

---

**Last Updated:** 2026-06-22 19:36:54Z  
**Status:** Comprehensive specification  
**Next Step:** Begin implementation per app

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:19.814928Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 520
- words: 1559
- characters: 12441
- headings: 42
- links: 10
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
