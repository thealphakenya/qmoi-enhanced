#!/usr/bin/env node
/**
 * Common Vercel Deployment Error Fixes
 * Automatically diagnoses and fixes common deployment problems
 */

const fs = require('fs');
const path = require('path');

const ERRORS_MAPPING = {
  // Error: Function pattern doesn't match
  'function.*pattern.*doesnt.*match': {
    title: '❌ Function Pattern Mismatch',
    description: 'The pattern in vercel.json doesn\'t match any actual function files',
    solution: `Update vercel.json:
    "functions": {
      "app/api/**/route.ts": { "maxDuration": 30 }
    },
    "routes": []`,
    file: 'vercel.json',
  },

  // Error: Cannot find module
  'cannot.*find.*module': {
    title: '❌ Missing Module',
    description: 'An imported module cannot be found during build',
    solution: `1. Check import paths use correct aliases (@/...)
2. Verify tsconfig.json has correct baseUrl and paths
3. Run: npm install
4. Check for typos in import statements`,
    file: 'tsconfig.json, package.json',
  },

  // Error: Build timed out
  'build.*timeout|timeout': {
    title: '⏱️  Build Timeout',
    description: 'The build process took too long and was terminated',
    solution: `1. Check for infinite loops in build scripts
2. Optimize dependencies in package.json
3. Increase maxDuration in vercel.json
4. Consider splitting large routes`,
    file: 'vercel.json',
  },

  // Error: Out of memory
  'out.*of.*memory|memory.*exceeded': {
    title: '💾 Out of Memory',
    description: 'The build process ran out of memory',
    solution: `Add to package.json scripts:
    "build": "NODE_OPTIONS=--max-old-space-size=4096 next build"
    
Or in vercel.json:
    "build": {
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=4096"
      }
    }`,
    file: 'package.json or vercel.json',
  },

  // Error: ENOENT no such file
  'enoent.*no.*such.*file|no.*such.*file': {
    title: '📁 File Not Found',
    description: 'A required file is missing or in the wrong location',
    solution: `1. Check all required files exist:
   - package.json
   - next.config.js
   - tsconfig.json
   - .gitignore
2. Verify no file path issues
3. Check NODE_ENV is set correctly`,
    file: 'Check workspace structure',
  },

  // Error: TypeScript compilation error
  'typescript.*error|ts.*error': {
    title: '🔴 TypeScript Error',
    description: 'TypeScript compilation failed',
    solution: `1. Run locally: npm run build
2. Fix all TypeScript errors shown
3. Check import paths and types
4. Verify all @/ aliases resolve correctly
5. Run: npm run lint:fix`,
    file: 'See build logs for specific errors',
  },

  // Error: ESLint blocking build
  'eslint.*error': {
    title: '🚫 ESLint Error',
    description: 'ESLint found errors blocking the build',
    solution: `Add to next.config.js:
    {
      eslint: {
        ignoreDuringBuilds: true,
      }
    }
    
Or fix ESLint errors:
    npm run lint:fix`,
    file: 'next.config.js',
  },

  // Error: Environment variable missing
  'env.*undefined|undefined.*env': {
    title: '🔐 Missing Environment Variable',
    description: 'A required environment variable is not defined',
    solution: `1. Check Vercel project settings > Environment Variables
2. Add missing variables
3. Use .env.example as template
4. Make variables optional with fallbacks:
   const apiKey = process.env.QMOI_API_KEY || '';`,
    file: 'vercel.json, .env.example',
  },

  // Error: Port already in use
  'port.*already.*in.*use|eaddrinuse': {
    title: '🔌 Port Already in Use',
    description: 'The development server port is already in use',
    solution: `Kill existing process:
    pkill -f "next dev"
    
Or use different port:
    npm run dev -- -p 3001`,
    file: 'None - local dev issue',
  },

  // Error: NextAuth or auth issue
  'nextauth.*error|auth.*error': {
    title: '🔐 Authentication Error',
    description: 'NextAuth.js or authentication configuration issue',
    solution: `1. Check NEXTAUTH_URL in environment
2. Verify NEXTAUTH_SECRET is set
3. Check auth API routes exist
4. Verify session configuration`,
    file: 'app/api/auth/[...nextauth].ts or equivalent',
  },

  // Error: API route not found
  'api.*route.*not.*found|404.*api': {
    title: '🚫 API Route Not Found',
    description: 'An API endpoint is missing or not properly configured',
    solution: `1. Verify route file exists: app/api/<path>/route.ts
2. Check export naming: export async function GET/POST/etc
3. Ensure route syntax is correct
4. Check for typos in route paths`,
    file: 'app/api/*/route.ts',
  },
};

// Parse error messages and suggest fixes
function diagnoseError(errorMessage) {
  if (!errorMessage) return null;

  const lowerMessage = errorMessage.toLowerCase();

  for (const [pattern, fix] of Object.entries(ERRORS_MAPPING)) {
    const regex = new RegExp(pattern);
    if (regex.test(lowerMessage)) {
      return fix;
    }
  }

  return null;
}

// Display error diagnosis
function showErrorDiagnosis(_error) {
  const diagnosis = diagnoseError(_error);

  if (!diagnosis) {
    console.log(`\n❓ Unknown error. Please check Vercel logs for details.\n`);
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(diagnosis.title);
  console.log('='.repeat(60));
  console.log(`\n📝 Description:\n${diagnosis.description}\n`);
  console.log(`💡 Solution:\n${diagnosis.solution}\n`);
  console.log(`📄 Related Files:\n${diagnosis.file}\n`);
  console.log('='.repeat(60) + '\n');
}

// Export for use in other scripts
module.exports = {
  diagnoseError,
  showErrorDiagnosis,
  ERRORS_MAPPING,
};

// If run directly, show error reference
if (require.main === module) {
  console.log(`
╔════════════════════════════════════════════════════╗
║  Common Vercel Deployment Errors & Solutions      ║
╚════════════════════════════════════════════════════╝
  `);

  Object.entries(ERRORS_MAPPING).forEach(([pattern, fix]) => {
    console.log(`\n${fix.title}`);
    console.log(`Pattern: ${pattern}`);
    console.log(`Solution: ${fix.solution.split('\n')[0]}...`);
  });

  console.log(`\n\nUsage in other scripts:
const { diagnoseError } = require('./deployment-error-handler.js');
const diagnosis = diagnoseError(errorMessage);
if (diagnosis) {
  console.log('Error:', diagnosis.title);
  console.log('Fix:', diagnosis.solution);
}
  `);
}
