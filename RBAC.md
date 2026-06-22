---
quantum-enabled: false
---

# RBAC.md — Role-Based Access Control System Reference

## Purpose

This document defines the comprehensive role-based access control (RBAC) system for the QMOI Enhanced application family. It covers user role hierarchy, feature matrices, styling conventions, and implementation patterns for role-aware UI rendering and API responses.

## Role Hierarchy

QMOI implements a four-tier role hierarchy with progressive access levels:

| Role | Level | Scope | Use Case |
|------|-------|-------|----------|
| **master** | 100 | System administration | Full access to all features, admin controls, financial management, user management, advanced AI tuning |
| **sister** | 65 | Collaborative/family | Trusted peer access, project collaboration, friendship management, memory sync, biometric enrollment |
| **user** | 30 | Standard authenticated | General chat, basic features, profile management, theme selection, dataset browsing |
| **guest** | 10 | Limited public | Read-only content, help/support, theme selection, limited chat context |

### Permission Propagation

Access levels propagate down the hierarchy:
- Master users automatically inherit all sister, user, and guest features
- Sister users inherit all user and guest features
- User role users inherit guest features
- Guest role has minimum permissions

## Feature Matrix

The centralized feature matrix in `lib/rbac/roleFeatures.ts` defines feature access for all roles across all app categories.

### QMOI AI Features

| Feature | Master | Sister | User | Guest | Notes |
|---------|--------|--------|------|-------|-------|
| `chat` | ✅ | ✅ | ✅ | ❌ | Basic chat interface |
| `chat_history` | ✅ | ✅ | ✅ | ❌ | Persisted conversation history |
| `chat_export` | ✅ | ✅ | ❌ | ❌ | Export to file/backup |
| `advanced_models` | ✅ | ❌ | ❌ | ❌ | Experimental and fine-tuned models |
| `api_integration` | ✅ | ❌ | ❌ | ❌ | Custom API integration |
| `model_fine_tuning` | ✅ | ❌ | ❌ | ❌ | Model customization |

### QMOI Space Features

| Feature | Master | Sister | User | Guest | Notes |
|---------|--------|--------|------|-------|-------|
| `view_projects` | ✅ | ✅ | ✅ | ❌ | View own and shared projects |
| `create_project` | ✅ | ✅ | ✅ | ❌ | Create new project |
| `edit_project` | ✅ | ✅ | ✅ | ❌ | Edit own project |
| `delete_project` | ✅ | ✅ | ❌ | ❌ | Delete own project |
| `upload_dataset` | ✅ | ✅ | ❌ | ❌ | Upload dataset to project |
| `manage_friendships` | ✅ | ✅ | ✅ | ❌ | Add/remove collaborators |
| `collaborative_editing` | ✅ | ✅ | ✅ | ❌ | Real-time collaboration |

### QCity Features (Master Only)

| Feature | Master | Sister | User | Guest | Notes |
|---------|--------|--------|------|-------|-------|
| `view_dashboard` | ✅ | ❌ | ❌ | ❌ | System dashboard |
| `view_devices` | ✅ | ❌ | ❌ | ❌ | View all devices |
| `manage_devices` | ✅ | ❌ | ❌ | ❌ | Add/configure devices |
| `view_metrics` | ✅ | ❌ | ❌ | ❌ | System metrics and KPIs |
| `schedule_tasks` | ✅ | ❌ | ❌ | ❌ | Schedule automated tasks |
| `master_controls` | ✅ | ❌ | ❌ | ❌ | Advanced system controls |

### QVillage Features

| Feature | Master | Sister | User | Guest | Notes |
|---------|--------|--------|------|-------|-------|
| `browse_datasets` | ✅ | ✅ | ✅ | ❌ | Search and browse community datasets |
| `purchase_dataset` | ✅ | ✅ | ✅ | ❌ | Purchase dataset access |
| `publish_dataset` | ✅ | ❌ | ❌ | ❌ | Publish dataset to marketplace |
| `deploy_model` | ✅ | ❌ | ❌ | ❌ | Deploy model to production |
| `view_community` | ✅ | ✅ | ✅ | ✅ | View public community content |
| `monetization` | ✅ | ❌ | ❌ | ❌ | Earn from dataset/model sales |

### QAlpha Features

| Feature | Master | Sister | User | Guest | Notes |
|---------|--------|--------|------|-------|-------|
| `learning_paths` | ✅ | ✅ | ✅ | ❌ | Access structured learning paths |
| `research_contribution` | ✅ | ✅ | ❌ | ❌ | Contribute to research projects |
| `model_evaluation` | ✅ | ✅ | ✅ | ❌ | Evaluate AI models |
| `publish_research` | ✅ | ✅ | ❌ | ❌ | Publish research findings |

### Universal Features

| Feature | Master | Sister | User | Guest | Notes |
|---------|--------|--------|------|-------|-------|
| `privacy_mask` | ✅ | ✅ | ❌ | ❌ | Enable privacy masking |
| `parallel_sessions` | ✅ | ❌ | ❌ | ❌ | Run parallel session contexts |
| `biometric_auth` | ✅ | ✅ | ❌ | ❌ | Biometric login/enrollment |
| `session_management` | ✅ | ✅ | ✅ | ❌ | Manage active sessions |
| `theme_selection` | ✅ | ✅ | ✅ | ✅ | Switch between themes |
| `help_support` | ✅ | ✅ | ✅ | ✅ | Access help and support |

## Implementation Architecture

### Core RBAC Files

1. **lib/rbac/roleFeatures.ts** — Centralized feature matrix and access helpers
2. **lib/rbac/roleStyles.ts** — Role-specific styling and response formatting
3. **src/components/auth/RoleGate.tsx** — React component for conditional feature rendering
4. **app/hooks/useAuth.ts** — Authentication hook with role and permission data

### Database Schema

User objects include:

```typescript
interface User {
  id: string;
  email: string;
  displayName?: string;
  role: "master" | "sister" | "user" | "guest";
  accessLevel: number; // 100, 65, 30, or 10
  permissions: string[]; // Array of feature names user can access
  hasAccess(feature: string, category: string): boolean;
}
```

## Feature Access Helpers

### hasFeatureAccess(feature, category, role)

Returns boolean indicating if a role has access to a specific feature in a category:

```typescript
import { hasFeatureAccess } from "@/lib/rbac/roleFeatures";

hasFeatureAccess("advanced_models", "qmoiAI", "master"); // true
hasFeatureAccess("advanced_models", "qmoiAI", "user"); // false
```

### getAccessibleFeatures(category, role)

Returns array of feature names available to a role:

```typescript
import { getAccessibleFeatures } from "@/lib/rbac/roleFeatures";

const features = getAccessibleFeatures("qmoiAI", "master");
// Returns: ["chat", "chat_history", "chat_export", "advanced_models", "api_integration", "model_fine_tuning"]
```

## Role-Specific Styling

### getRoleStyles(role)

Returns an object with role-specific CSS classes:

```typescript
import { getRoleStyles } from "@/lib/rbac/roleStyles";

const styles = getRoleStyles("master");
// Returns:
// {
//   headerClass: "from-red-900 to-red-800 bg-gradient-to-br",
//   accentClass: "text-red-400",
//   borderClass: "border-red-600/40",
//   badgeClass: "bg-red-600/20 text-red-200"
// }
```

### Role Color Mapping

- **Master**: Red/Crimson (`from-red-900 to-red-800`, `text-red-400`)
- **Sister**: Purple (`from-purple-900 to-purple-800`, `text-purple-400`)
- **User**: Blue (`from-blue-900 to-blue-800`, `text-blue-400`)
- **Guest**: Slate (`from-slate-900 to-slate-800`, `text-slate-300`)

### getRoleButtonStyle(role, type)

Returns button styling for different action types:

```typescript
import { getRoleButtonStyle } from "@/lib/rbac/roleStyles";

const primary = getRoleButtonStyle("master", "primary");
// Returns: "rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500 transition"

const secondary = getRoleButtonStyle("sister", "secondary");
// Returns: "rounded-xl border border-purple-500 bg-purple-600/10 px-5 py-3 text-sm font-semibold text-purple-400 hover:bg-purple-600/20 transition"

const danger = getRoleButtonStyle("user", "danger");
// Returns: "rounded-xl bg-red-600/50 px-5 py-3 text-sm font-semibold text-red-200 hover:bg-red-600 transition"
```

## RoleGate Component

The `RoleGate` component conditionally renders UI based on user role and feature access:

### Usage Pattern

```tsx
import { RoleGate } from "@/src/components/auth/RoleGate";
import { useAuth } from "@/app/hooks/useAuth";

export function MyFeature() {
  const { user } = useAuth();

  return (
    <RoleGate
      feature="advanced_models"
      category="qmoiAI"
      role={user.role}
      fallback={<div>Advanced models are not available for your role</div>}
    >
      <AdvancedModelsPanel />
    </RoleGate>
  );
}
```

### RoleGate Props

- `feature` (required): Feature name from feature matrix
- `category` (required): App category (qmoiAI, qmoiSpace, qcity, qvillage, qalpha, universal)
- `role` (required): User role
- `children` (required): Content to render if access is granted
- `fallback` (optional): Content to render if access is denied
- `showRestrictionMessage` (optional): Show restriction message instead of fallback

### Related Components

**RoleBasedContent**: Render different content by role

```tsx
import { RoleBasedContent } from "@/src/components/auth/RoleGate";

<RoleBasedContent
  master={<AdminPanel />}
  sister={<CollaborativePanel />}
  user={<StandardPanel />}
  guest={<LimitedPanel />}
/>
```

**RoleRestricted**: Hierarchical access control

```tsx
import { RoleRestricted } from "@/src/components/auth/RoleGate";

<RoleRestricted minRole="sister">
  <BiometricEnrollment /> {/* Only available for sister and master */}
</RoleRestricted>
```

## Role-Aware Responses

### formatRoleAwareResponse(data, role)

Adds role context to API responses:

```typescript
import { formatRoleAwareResponse } from "@/lib/rbac/roleStyles";

const response = formatRoleAwareResponse({
  message: "Chat completed successfully",
  data: { conversation: [...] }
}, "user");

// Returns:
// {
//   message: "Chat completed successfully",
//   data: { conversation: [...] },
//   roleContext: {
//     role: "user",
//     accessLevel: 30,
//     colorScheme: "blue"
//   }
// }
```

### filterDataByRole(data, role, sensitivity)

Filters sensitive data based on role and sensitivity level:

```typescript
import { filterDataByRole } from "@/lib/rbac/roleStyles";

const userData = filterDataByRole(
  { email: "user@example.com", apiKey: "sk_123abc", theme: "dark" },
  "user",
  "high"
);

// For "high" sensitivity with "user" role, returns:
// { email: "***", apiKey: "***", theme: "dark" }
```

Sensitivity levels:
- **low**: No data is masked
- **medium**: Sensitive identifiers are masked
- **high**: Secrets and personal info are masked

## Implementation Checklist

### New Shell Integration

When adding a new app shell, ensure:

1. ✅ Add shell to `getAccessibleFeatures` feature list in `lib/rbac/roleFeatures.ts`
2. ✅ Define feature matrix for all roles in feature object
3. ✅ Import `RoleGate` component in shell
4. ✅ Wrap feature sections in `<RoleGate>` with fallback UI
5. ✅ Use `getRoleStyles(user.role)` for consistent styling
6. ✅ Apply `getRoleButtonStyle(user.role)` to action buttons
7. ✅ Add role badge to welcome card
8. ✅ Test role switching with different user roles
9. ✅ Validate API responses include role context
10. ✅ Update shell-specific UI documentation

### Backend API Integration

When integrating RBAC with backend APIs:

1. ✅ Validate user role on every endpoint
2. ✅ Filter response data using `filterDataByRole`
3. ✅ Include role context in response headers/body
4. ✅ Return HTTP 403 for features user lacks access to
5. ✅ Log access denied incidents for audit trail
6. ✅ Provide clear restriction messages to client

## Testing Strategies

### Unit Testing

Test role helpers directly:

```typescript
import { hasFeatureAccess, getAccessibleFeatures } from "@/lib/rbac/roleFeatures";

describe("RBAC", () => {
  it("master has access to advanced_models", () => {
    expect(hasFeatureAccess("advanced_models", "qmoiAI", "master")).toBe(true);
  });

  it("user lacks access to advanced_models", () => {
    expect(hasFeatureAccess("advanced_models", "qmoiAI", "user")).toBe(false);
  });

  it("master gets all QMOI AI features", () => {
    const features = getAccessibleFeatures("qmoiAI", "master");
    expect(features.length).toBeGreaterThan(0);
  });
});
```

### Integration Testing

Test RoleGate component rendering:

```typescript
import { render, screen } from "@testing-library/react";
import { RoleGate } from "@/src/components/auth/RoleGate";

describe("RoleGate", () => {
  it("renders content for master role", () => {
    render(
      <RoleGate feature="advanced_models" category="qmoiAI" role="master">
        <div>Advanced Models</div>
      </RoleGate>
    );
    expect(screen.getByText("Advanced Models")).toBeInTheDocument();
  });

  it("renders fallback for user role", () => {
    render(
      <RoleGate feature="advanced_models" category="qmoiAI" role="user" fallback={<div>Not available</div>}>
        <div>Advanced Models</div>
      </RoleGate>
    );
    expect(screen.getByText("Not available")).toBeInTheDocument();
  });
});
```

## API Endpoint Examples

### Protected Endpoint Pattern

```typescript
import { validateUserRole } from "@/app/lib/auth/rbac";

export async function GET(request: Request) {
  const user = await getSessionUser(request);

  // Check role access
  if (!validateUserRole(user.role, ["master"])) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Return role-aware data
  return Response.json(
    formatRoleAwareResponse(
      { data: getSystemMetrics() },
      user.role
    )
  );
}
```

### Role-Filtered Data Pattern

```typescript
export async function GET(request: Request) {
  const user = await getSessionUser(request);
  const allData = await fetchAllUserData(user.id);

  // Filter by role and sensitivity
  const safeData = filterDataByRole(
    allData,
    user.role,
    "high" // high sensitivity
  );

  return Response.json(formatRoleAwareResponse(safeData, user.role));
}
```

## Cross-References

- [UNIVERSAL.md](UNIVERSAL.md) — Universal auth and role-based feature descriptions
- [STYLES.md](STYLES.md) — Style system and theme documentation
- [lib/rbac/roleFeatures.ts](lib/rbac/roleFeatures.ts) — Feature matrix implementation
- [lib/rbac/roleStyles.ts](lib/rbac/roleStyles.ts) — Styling helpers implementation
- [src/components/auth/RoleGate.tsx](src/components/auth/RoleGate.tsx) — Component implementation
- [QMOIAIUI.md](QMOIAIUI.md) — QMOI AI shell role-aware UI
- [QMOISPACEUI.md](QMOISPACEUI.md) — QMOI Space shell role-aware UI
- [QCITYUI.md](QCITYUI.md) — QCity shell master-only controls
- [QVILLAGEUI.md](QVILLAGEUI.md) — QVillage shell role-gated features
- [QALPHAUI.md](QALPHAUI.md) — QAlpha shell role-aware learning paths

## Change History

- 2026-06-10: Created comprehensive RBAC documentation with feature matrices and implementation patterns
- 2026-06-10: Added role color mapping, styling helpers, and component usage examples
- 2026-06-10: Documented backend API integration patterns and testing strategies
- 2026-06-10: Added testing examples and implementation checklist for new shells

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T22:55:29.585993Z
- production status: ✅ production-ready
- status tags: production, production-ready
- lines: 460
- words: 2055
- characters: 15013
- headings: 40
- links: 10
- images: 0
- tables: 53
- lion validation block: present
<!-- LION_VALIDATION_END -->
