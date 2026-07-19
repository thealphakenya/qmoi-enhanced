---
quantum-enabled: false
---

# device Management Dashboard Screen

## Screen Information
- **Screen Name:** device Management Dashboard
- **File Path:** `app/devices/page.tsx`
- **Route:** `/devices`
- **Purpose:** Comprehensive device monitoring and management interface for the QMOI ecosystem. Allows users to view, filter, and control all connected devices across different platforms and types.

## What the User Sees on Opening

### Layout Structure
- **Background:** Light gray background (gray-50)
- **Container:** Centered content with responsive padding (max-width 7xl)
- **Padding:** Responsive (4 units on mobile, 6 on small screens, 8 on large screens)
- **Vertical Padding:** 8 units top/bottom

### Header Section
- **Title:** "device Management Dashboard" (3xl font, bold, gray-900)
- **Subtitle:** "Monitor and manage all connected devices across your QMOI ecosystem" (gray-600)
- **Margin:** 8 units bottom margin

### Filter Controls Section
- **Position:** Below header, 6 units bottom margin
- **Layout:** Horizontal flex with wrapping, 2 units gap between buttons

### Statistics Grid
- **Layout:** Responsive grid (1 column mobile, 4 columns medium+)
- **Gap:** 6 units between cards
- **Bottom Margin:** 8 units

### device Cards Grid
- **Layout:** Responsive grid (1 column mobile, 2 columns medium, 3 columns large)
- **Gap:** 6 units between cards

## UI Elements

### Filter Buttons (Dynamic count based on device types)
- **Design:** Rounded corners (lg), padding 4x2 units, small text, medium font weight
- **States:**
  - **Active:** Blue background (blue-600), white text
  - **Inactive:** White background, gray text (gray-700), gray border (gray-300)
  - **Hover:** Light gray background (gray-50) for inactive buttons
- **Labels:** "All devices", "Mobile", "Laptop", "Smart Tv", "Wearable", "Smart Speaker", "Tablet"

### Statistics Cards (4 fixed cards)
Each card contains:
- **Container:** White background, rounded corners (lg), shadow, padding 6 units
- **Value:** Large number (2xl font, bold, colored)
- **Label:** Description text (gray-600)

#### Card 1: Total devices
- **Value:** Dynamic count (blue-600 color)
- **Label:** "Total devices"

#### Card 2: Online devices
- **Value:** Count of online devices (green-600 color)
- **Label:** "Online"

#### Card 3: Syncing devices
- **Value:** Count of syncing devices (yellow-600 color)
- **Label:** "Syncing"

#### Card 4: Offline devices
- **Value:** Count of offline devices (red-600 color)
- **Label:** "Offline"

### device Cards (Dynamic based on devices)
Each device card contains:
- **Container:** White background, rounded corners (lg), shadow, padding 6 units
- **Header:** device name (lg font, semibold, gray-900) + status badge
- **Content:** device details in vertical spacing
- **Actions:** Two buttons at bottom

#### Status Badge
- **Position:** Top-right of card header
- **Design:** Small padding, rounded full, extra small text, medium font
- **Colors:**
  - Online: Green background/text (green-100/green-600)
  - Offline: Red background/text (red-100/red-600)
  - Syncing: Yellow background/text (yellow-100/yellow-600)

#### device Information Fields
- **Type:** device category (mobile, laptop, smart-tv, etc.)
- **Platform:** Operating system (iOS, macOS, webOS, etc.)
- **Last Sync:** Formatted timestamp
- **Location:** Optional, shows if available
- **Battery:** Optional progress bar with percentage

#### Battery Indicator (when available)
- **Layout:** Flex container with label, progress bar, and percentage
- **Progress Bar:** Gray background (gray-200), green fill (green-600), 2 units height, rounded
- **Width:** Dynamic based on battery percentage

#### Action Buttons (2 per card)
- **Manage Button:** Blue background (blue-600), white text, hover darker (blue-700)
- **Sync Button:** Gray background (gray-600), white text, hover darker (gray-700)
- **Layout:** Equal width (flex-1), horizontal spacing, small text, padding 3x2

## User Interactions

### Primary Actions
- **Filter Selection:** Click filter buttons to show/hide device types
- **device Management:** Click "Manage" button on device cards
- **device Sync:** Click "Sync" button on device cards
- **View device Details:** Passive viewing of device information

### Interactive Elements
- **Filter Buttons:** Toggle active state, change displayed devices
- **Manage Buttons:** Trigger device management actions (not implemented)
- **Sync Buttons:** Trigger synchronization actions (not implemented)

### Visual Feedback
- **Button Hover:** Background color changes for all buttons
- **Active Filter:** Blue background with white text
- **Loading State:** Spinner animation during initial load
- **Empty State:** Message when no devices match filter

## Data Structure

### device Object Properties
```typescript
interface device {
  id: string;           // Unique identifier
  name: string;         // Display name
  type: string;         // Category (mobile, laptop, smart-tv, etc.)
  platform: string;     // OS (iOS, macOS, webOS, etc.)
  status: 'online' | 'offline' | 'syncing';
  lastSync: string;     // ISO timestamp
  location?: string;    // Optional location
  battery?: number;     // Optional battery percentage
}
```

### Mock Data (6 sample devices)
1. **iPhone 15 Pro** - Mobile, iOS, Online, Nairobi, 85% battery
2. **MacBook Pro M3** - Laptop, macOS, Online, 92% battery
3. **Smart TV LG** - Smart TV, webOS, Online
4. **Apple Watch Ultra** - Wearable, watchOS, Syncing, 78% battery
5. **HomePod Mini** - Smart Speaker, iOS, Online
6. **iPad Pro** - Tablet, iPadOS, Offline, 45% battery

## Loading States

### Initial Load Screen
- **Background:** Gray-50 (light gray)
- **Layout:** Centered content with flexbox
- **Spinner:** Animated blue spinner (12x12 units, blue-600 border)
- **Text:** "Loading device management dashboard..." (gray-600)

## Error States

### Empty State
- **Trigger:** When filtered devices array is empty
- **Display:** Centered text "No devices found matching the selected filter." (gray-500)
- **Position:** Center of device grid area

## Responsive Behavior

### Mobile (< 768px)
- Single column grids for stats and devices
- Filter buttons wrap to multiple rows
- Full width cards and buttons

### Tablet (768px - 1024px)
- 2-column device grid
- 4-column stats grid
- Filter buttons in single row (may wrap)

### Desktop (> 1024px)
- 3-column device grid
- 4-column stats grid
- All filter buttons in single row

## Performance Considerations
- **Client-side Filtering:** No API calls for filtering (client-side only)
- **Static Mock Data:** No network requests for device data
- **Efficient Rendering:** Uses React keys for list rendering

## Navigation Context
- **Entry Point:** "device Management" card on home screen
- **Exit Points:** No direct navigation links (dashboard only)
- **Back Behavior:** Browser back button or home navigation
- **Filter State:** Persists during session (not saved to URL)

## Code Structure
```typescript
// Main component with hooks
'use client';
export default function deviceManagementDashboard() {
  const [devices, setdevices] = useState<device[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Data fetching and filtering logic
  // Loading state handling
  // Status color mapping
  // Responsive grid layouts
  // device card rendering
}
```

## Future Enhancements
- **Real API Integration:** Replace mock data with actual device API
- **Real-time Updates:** WebSocket connections for live device status
- **device Actions:** Implement Manage and Sync button functionality
- **Bulk Operations:** Select multiple devices for batch actions
- **device Details:** Expandable cards with more information
- **Search Functionality:** Text search across device names
- **Sorting Options:** Sort by name, status, last sync, etc.

## Testing Notes
- **Data Loading:** Mock data simulation and loading states
- **Filtering:** All filter combinations and edge cases
- **Responsive Design:** Grid layouts across all breakpoints
- **Accessibility:** Keyboard navigation and screen reader support
- **Performance:** Large device lists and filtering speed

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:24.068616Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 238
- words: 1233
- characters: 8657
- headings: 41
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
