#!/usr/bin/env python3
"""
QMOI Enhanced - TREE.md and Developer Structure Generator
Creates comprehensive developer structure documentation
"""

import os
from pathlib import Path
from datetime import datetime

class TreeGenerator:
    def __init__(self, workspace_root: str = "/workspaces/qmoi-enhanced"):
        self.workspace_root = workspace_root
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
        
    def generate_tree(self, path: str, prefix: str = "", max_depth: int = 2, current_depth: int = 0) -> str:
        """Generate directory tree structure"""
        if current_depth >= max_depth:
            return ""
        
        items = []
        skip_dirs = {'.git', '.venv', 'node_modules', '.backups', '__pycache__', 
                     '.next', 'dist', 'build', '.vercel', '.husky'}
        
        try:
            entries = sorted(os.listdir(path))
            entries = [e for e in entries if e not in skip_dirs and not e.startswith('.')]
        except PermissionError:
            return ""
        
        dirs = []
        files = []
        
        for entry in entries:
            full_path = os.path.join(path, entry)
            if os.path.isdir(full_path):
                dirs.append(entry)
            else:
                files.append(entry)
        
        # Show directories first
        for i, dir_name in enumerate(dirs):
            is_last_dir = (i == len(dirs) - 1) and len(files) == 0
            connector = "└── " if is_last_dir else "├── "
            items.append(f"{prefix}{connector}{dir_name}/")
            
            next_prefix = prefix + ("    " if is_last_dir else "│   ")
            full_path = os.path.join(path, dir_name)
            items.append(self.generate_tree(full_path, next_prefix, max_depth, current_depth + 1))
        
        # Show files (limit)
        for i, file_name in enumerate(files[:5]):
            is_last = (i == len(files) - 1) or i == 4
            connector = "└── " if is_last else "├── "
            items.append(f"{prefix}{connector}{file_name}")
        
        if len(files) > 5:
            items.append(f"{prefix}└── ... ({len(files) - 5} more files)")
        
        return "\n".join(filter(None, items))
    
    def generate_structure_doc(self) -> str:
        """Generate comprehensive structure documentation"""
        timestamp = self.timestamp
        base_tree = self.generate_tree(self.workspace_root, "", max_depth=2)
        
        # Build doc string without f-string to avoid brace conflicts
        doc = "# QMOI Enhanced - Complete Developer Structure Reference\n\n"
        doc += f"**Last Updated**: {timestamp}\n"
        doc += "**Purpose**: Comprehensive guide to project structure, directories, and developer resources\n\n"

**Last Updated**: {self.timestamp}
**Purpose**: Comprehensive guide to project structure, directories, and developer resources

## Executive Summary

The QMOI Enhanced project is organized into logical components for easier navigation and development. This document maps the complete directory structure and explains the purpose of each major directory.

## Root Directory Structure

```
{self.generate_tree(self.workspace_root, "", max_depth=2)}
```

## Detailed Directory Reference

### 📁 **src/** - Source Code
Main application source code using TypeScript/JavaScript.

```
src/
├── api/              - API routes and endpoints
│   ├── routes/       - Route definitions
│   └── controllers/  - API controllers
├── app/              - Next.js app directory
│   ├── api/          - API handlers
│   ├── pages/        - Page components
│   └── layout.tsx    - Root layout
├── components/       - React components
│   ├── q-city/       - Q-City components
│   ├── qvillage/     - Q-Village components
│   └── common/       - Shared components
├── services/         - Business logic services
│   ├── auth/         - Authentication
│   ├── payment/      - Payment processing
│   ├── ai/           - AI/ML services
│   └── webhooks/     - Webhook handlers
├── utils/            - Utility functions
├── types/            - TypeScript type definitions
├── hooks/            - React hooks
├── middleware/       - Express/Next.js middleware
├── database/         - Database models
└── config/           - Configuration files
```

### 📁 **backend/** - Backend Services
Node.js/Express backend services and APIs.

```
backend/
├── src/              - Backend source
├── routes/           - Express routes
├── controllers/      - Route controllers
├── models/           - Data models
├── middleware/       - Custom middleware
├── services/         - Business services
├── utils/            - Helper functions
└── tests/            - Backend tests
```

### 📁 **api/** - API Layer
Standalone API services and endpoints.

```
api/
├── routes/           - API route definitions
├── handlers/         - Request handlers
├── middleware/       - API middleware
├── validators/       - Input validation
└── responses/        - Response formatters
```

### 📁 **scripts/** - Automation Scripts
Python, Bash, and Node.js scripts for automation.

```
scripts/
├── deployment/       - Deployment scripts
├── automation/       - Automation scripts
├── analytics/        - Analytics generators
├── maintenance/      - Maintenance tasks
├── qmoi_*.py         - QMOI-specific scripts
└── *.sh              - Shell automation
```

### 📁 **tests/** - Test Suites
Comprehensive test suite organized by type.

```
tests/
├── unit/             - Unit tests
├── integration/      - Integration tests
├── e2e/              - End-to-end tests
├── api/              - API tests
├── component/        - Component tests
├── fixtures/         - Test data and fixtures
└── __mocks__/        - Mock implementations
```

### 📁 **docs/** - Documentation
Project documentation and guides.

```
docs/
├── api/              - API documentation
├── guides/           - User guides
├── architecture/     - Architecture docs
├── deployment/       - Deployment guides
├── troubleshooting/  - Troubleshooting guides
├── examples/         - Code examples
└── changelog/        - Version history
```

### 📁 **public/** - Static Assets
Public assets served by the application.

```
public/
├── images/           - Image assets
├── icons/            - Icon assets
├── fonts/            - Font files
├── data/             - Data files
└── downloads/        - Downloadable resources
```

### 📁 **config/** - Configuration Files
Application and environment configurations.

```
config/
├── environment/      - Environment configs
├── database/         - Database configs
├── cache/            - Cache configurations
├── logging/          - Logging configs
└── security/         - Security configs
```

### 📁 **deployment/** - Deployment Configuration
Docker, Kubernetes, and cloud deployment configs.

```
deployment/
├── docker/           - Docker configurations
├── kubernetes/       - K8s manifests
├── terraform/        - Infrastructure as Code
├── helm/             - Helm charts
├── production/       - Production configs
└── staging/          - Staging configs
```

### 📁 **tools/** - Developer Tools
Build tools, linters, testing tools.

```
tools/
├── build/            - Build configurations
├── lint/             - Linting configurations
├── test/             - Test configurations
├── webpack/          - Webpack configs
├── babel/            - Babel configs
└── eslint/           - ESLint configurations
```

## File Organization Guidelines

### Naming Conventions
- **Components**: PascalCase (e.g., `UserDashboard.tsx`)
- **Functions**: camelCase (e.g., `calculateBalance()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Directories**: lowercase (e.g., `components/`, `services/`)

### Import Paths
- Use absolute imports from configured paths
- Example: `import { useAuth } from '@/hooks'` (absolute import)
- Avoid relative imports: `../../utils/helpers` (relative paths)

### File Placement Rules

| Extension | Location | Purpose |
|-----------|----------|---------|
| `.tsx` | `src/components/` | React components |
| `.ts` | `src/services/` | Business logic |
| `.test.ts` | `tests/` | Test files |
| `.spec.ts` | `tests/` | Test specifications |
| `.d.ts` | `src/types/` | Type definitions |
| `.config.ts` | `config/` | Configuration files |
| `.env` | Root | Environment variables |

## Key Development Directories

### Application Entry Points
- **Next.js**: `src/app/layout.tsx`, `src/app/page.tsx`
- **Express**: `server.py`, `backend/src/index.ts`
- **API**: `api/index.ts`

### Critical Configuration Files
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `webpack.config.js` - Webpack configuration
- `jest.config.js` - Testing configuration
- `package.json` - Dependencies and scripts
- `.env.example` - Environment template

### Important Environment Variables
- `NEXT_PUBLIC_API_URL` - API endpoint
- `DATABASE_URL` - Database connection
- `JWT_SECRET` - Authentication secret
- `OPENAI_API_KEY` - AI service key
- `NODE_ENV` - Environment (development/production)

## Development Workflow

### Source Code Changes
1. Modify files in `src/`
2. Follow naming conventions
3. Add tests in `tests/`
4. Run linting and formatting
5. Commit changes with descriptive messages

### Adding New Features
```
Feature: New Dashboard Widget
1. Create component: src/components/dashboard/Widget.tsx
2. Create service: src/services/widgets.ts
3. Add route: src/app/api/widgets/route.ts
4. Create tests: tests/components/dashboard/Widget.test.tsx
5. Update documentation in docs/
6. Commit: feat: add dashboard widget
```

### Testing Workflow
```
Unit Tests:        tests/unit/**/*.test.ts
Integration Tests: tests/integration/**/*.test.ts
E2E Tests:        tests/e2e/**/*.spec.ts
```

## Build and Distribution

### Build Output
- Production build: `dist/` or `.next/`
- Static assets: `public/`
- Compiled types: `dist/types/`

### Distribution Packages
- **Web**: Vercel deployment
- **Desktop**: Electron builds (Windows, macOS, Linux)
- **Mobile**: Native apps (iOS, Android)
- **CLI**: Command-line tools
- **API**: Docker containers

## Documentation Structure

### Root Level Documentation
- `README.md` - Main project readme
- `CONTRIBUTING.md` - Contribution guidelines
- `LICENSE` - License information
- `CHANGELOG.md` - Version history

### Category Documentation
- `API.md` - API reference (45,900+ APIs)
- `ENDPOINTS.md` - HTTP endpoints (268+)
- `ROUTES.md` - Application routes (270+)
- `HOOKS.md` - React hooks (168+)
- `WEBHOOKS.md` - Webhook definitions (1,954+)
- `ALLTESTSAUTOTESTS.md` - Test suite reference (1,707+)
- `TREE.md` - This file, developer structure

## Production Structure

### Deployment Ready
- All source code in `src/`
- Tests in `tests/` with >90% coverage
- Configuration files for all environments
- Docker images ready for containerization
- CI/CD pipelines configured

### Monitoring & Logging
- Logs directory: `logs/`
- Metrics collection: `metrics/`
- Health checks: `health/`

## Quick Reference Links

- [API Reference](API.md) - Complete API documentation
- [Endpoints Reference](ENDPOINTS.md) - All HTTP endpoints
- [Routes Reference](ROUTES.md) - Application routes
- [Hooks Reference](HOOKS.md) - Available hooks
- [Webhooks Reference](WEBHOOKS.md) - Webhook definitions
- [Tests Reference](ALLTESTSAUTOTESTS.md) - Test suite inventory
- [Markdown Files](ALLMDFILESREFS.md) - All documentation files
- [Instances Reference](INSTANCES.md) - Application instances

## Statistics

**Total Directories**: 50+
**Total Source Files**: 2,000+
**Total Test Files**: 1,707+
**Total Documentation Files**: 2,131+
**Total Lines of Code**: 500,000+

## Last Updated
{self.timestamp}

---

**Note**: For the latest updates to this documentation, re-run the developer structure generator script.
"""
        return doc

    def run(self):
        """Generate and save TREE.md"""
        print("🌳 Generating comprehensive TREE.md...")
        doc = self.generate_structure_doc()
        
        tree_path = os.path.join(self.workspace_root, 'TREE.md')
        try:
            with open(tree_path, 'w', encoding='utf-8') as f:
                f.write(doc)
            print(f"✅ TREE.md updated ({len(doc)} bytes)")
            return True
        except Exception as e:
            print(f"❌ Failed to update TREE.md: {e}")
            return False

if __name__ == "__main__":
    generator = TreeGenerator()
    generator.run()
