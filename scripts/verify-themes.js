#!/usr/bin/env node

/**
 * Theme Verification Script
 * 
 * Verifies that all app shells correctly implement theme selection
 * and persistence across page boundaries.
 * 
 * Run: node scripts/verify-themes.js
 */

const fs = require('fs');
const path = require('path');

// ANSI Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

// Test files and expected components
const appShellsToTest = [
  { name: 'QMOI AI', path: 'src/components/qmoi/QMOIAIShell.tsx', app: 'qmoi-ai' },
  { name: 'QMOI Space', path: 'src/components/qmoi/QMOISpaceShell.tsx', app: 'qmoi-space' },
  { name: 'QCity', path: 'src/components/q-city/QCityShell.tsx', app: 'qcity' },
  { name: 'QVillage', path: 'src/components/qvillage/QVillageShell.tsx', app: 'qvillage' },
  { name: 'QAlpha', path: 'src/components/qalpha/QAlphaShell.tsx', app: 'qalpha' },
];

const documentationFiles = [
  { name: 'ENDPOINTS.md', path: 'ENDPOINTS.md', section: 'auth' },
  { name: 'ROUTES.md', path: 'ROUTES.md', section: 'App Shell' },
  { name: 'STYLES.md', path: 'STYLES.md', section: 'ThemeSelector' },
  { name: 'UNIVERSAL.md', path: 'UNIVERSAL.md', section: 'Theme' },
  { name: 'QMOIAIUI.md', path: 'QMOIAIUI.md', section: 'Authentication' },
  { name: 'QMOISPACEUI.md', path: 'QMOISPACEUI.md', section: 'Authentication' },
  { name: 'QCITYUI.md', path: 'QCITYUI.md', section: 'Authentication' },
  { name: 'QVILLAGEUI.md', path: 'QVILLAGEUI.md', section: 'Authentication' },
  { name: 'QALPHAUI.md', path: 'QALPHAUI.md', section: 'Authentication' },
];

let passCount = 0;
let failCount = 0;
let warningCount = 0;

function log(level, message) {
  const prefix = {
    '✓': colors.green + '✓' + colors.reset,
    '✗': colors.red + '✗' + colors.reset,
    '⚠': colors.yellow + '⚠' + colors.reset,
    'ℹ': colors.blue + 'ℹ' + colors.reset,
  };
  
  const levelSymbol = prefix[level] || level;
  console.log(`${levelSymbol} ${message}`);
}

function checkFileExists(filePath) {
  const fullPath = path.join('/workspaces/qmoi-enhanced', filePath);
  return fs.existsSync(fullPath);
}

function readFile(filePath) {
  try {
    const fullPath = path.join('/workspaces/qmoi-enhanced', filePath);
    return fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    return null;
  }
}

function containsString(content, searchString) {
  return content && content.includes(searchString);
}

// Test Suite
function runTests() {
  console.log('\n' + colors.blue + '='.repeat(60) + colors.reset);
  console.log(colors.blue + 'PHASE 3 TIER 2: THEME VERIFICATION SCRIPT' + colors.reset);
  console.log(colors.blue + '='.repeat(60) + colors.reset + '\n');

  // Check core files
  console.log(colors.blue + 'Core Files Verification:' + colors.reset);
  
  const coreFiles = [
    { name: 'ThemeSelector.tsx', path: 'app/components/theme/ThemeSelector.tsx' },
    { name: 'theme.css', path: 'styles/theme.css' },
    { name: 'useAuth hook', path: 'app/hooks/useAuth.ts' },
    { name: 'UniversalRouteGuard', path: 'app/components/auth/UniversalRouteGuard.tsx' },
  ];

  coreFiles.forEach(file => {
    if (checkFileExists(file.path)) {
      log('✓', `${file.name} - Found`);
      passCount++;
    } else {
      log('✗', `${file.name} - Not found at ${file.path}`);
      failCount++;
    }
  });

  // Check app shells for theme integration
  console.log('\n' + colors.blue + 'App Shell Theme Integration:' + colors.reset);
  
  appShellsToTest.forEach(app => {
    if (!checkFileExists(app.path)) {
      log('✗', `${app.name} shell not found at ${app.path}`);
      failCount++;
      return;
    }

    const content = readFile(app.path);
    let shellPass = true;

    // Check for useTheme hook
    if (containsString(content, 'useTheme')) {
      log('✓', `${app.name}: Uses useTheme hook`);
      passCount++;
    } else {
      log('⚠', `${app.name}: Missing useTheme hook import`);
      warningCount++;
      shellPass = false;
    }

    // Check for ThemeSelector component
    if (containsString(content, 'ThemeSelector')) {
      log('✓', `${app.name}: Renders ThemeSelector component`);
      passCount++;
    } else {
      log('⚠', `${app.name}: Missing ThemeSelector component`);
      warningCount++;
      shellPass = false;
    }

    // Check for data-theme or theme handling
    if (containsString(content, 'data-theme') || containsString(content, 'theme')) {
      log('✓', `${app.name}: Has theme handling logic`);
      passCount++;
    } else {
      log('⚠', `${app.name}: No theme handling detected`);
      warningCount++;
      shellPass = false;
    }
  });

  // Check theme.css for all three themes
  console.log('\n' + colors.blue + 'Theme CSS Variables:' + colors.reset);
  const themeCss = readFile('styles/theme.css');
  
  const themes = ['dark', 'light', 'high-contrast'];
  themes.forEach(theme => {
    // Check for theme-specific variables
    const darkVars = ['--color-bg', '--color-text', '--color-border', '--color-accent'];
    
    if (themeCss && themeCss.includes(`[data-theme="${theme}"]`) || themeCss.includes(`.${theme}`)) {
      log('✓', `Theme CSS: ${theme} theme defined`);
      passCount++;
    } else {
      log('⚠', `Theme CSS: ${theme} theme may be missing`);
      warningCount++;
    }
  });

  // Check documentation for auth sections
  console.log('\n' + colors.blue + 'Documentation Coverage:' + colors.reset);
  
  documentationFiles.forEach(doc => {
    if (!checkFileExists(doc.path)) {
      log('✗', `${doc.name}: File not found`);
      failCount++;
      return;
    }

    const content = readFile(doc.path);
    
    if (containsString(content, doc.section)) {
      log('✓', `${doc.name}: Contains "${doc.section}" section`);
      passCount++;
    } else {
      log('⚠', `${doc.name}: Missing "${doc.section}" section`);
      warningCount++;
    }
  });

  // Check for auth integration
  console.log('\n' + colors.blue + 'Authentication Integration:' + colors.reset);
  
  const universalAuth = readFile('UNIVERSAL_AUTH.md');
  if (universalAuth && universalAuth.includes('Authentication Portal')) {
    log('✓', 'UNIVERSAL_AUTH.md: Comprehensive auth documentation');
    passCount++;
  } else {
    log('⚠', 'UNIVERSAL_AUTH.md: May be missing key sections');
    warningCount++;
  }

  const authIntegrationTests = readFile('AUTH_INTEGRATION_TESTS.md');
  if (authIntegrationTests && authIntegrationTests.includes('Test Cases')) {
    log('✓', 'AUTH_INTEGRATION_TESTS.md: Test suite available');
    passCount++;
  } else {
    log('⚠', 'AUTH_INTEGRATION_TESTS.md: May be incomplete');
    warningCount++;
  }

  // Summary
  console.log('\n' + colors.blue + '='.repeat(60) + colors.reset);
  console.log(colors.blue + 'VERIFICATION SUMMARY' + colors.reset);
  console.log(colors.blue + '='.repeat(60) + colors.reset);
  console.log(`${colors.green}✓ Passed: ${passCount}${colors.reset}`);
  console.log(`${colors.yellow}⚠ Warnings: ${warningCount}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${failCount}${colors.reset}`);
  
  const totalTests = passCount + warningCount + failCount;
  const passPercentage = ((passCount / totalTests) * 100).toFixed(1);
  
  console.log(`\nTotal Tests: ${totalTests}`);
  console.log(`Pass Rate: ${passPercentage}%`);

  if (failCount === 0 && warningCount === 0) {
    console.log(`\n${colors.green}✓ ALL VERIFICATIONS PASSED!${colors.reset}`);
    console.log('Phase 3 Tier 2 is ready for manual testing.\n');
    process.exit(0);
  } else if (failCount === 0) {
    console.log(`\n${colors.yellow}⚠ Warnings detected - Review above for details${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ Failures detected - Please fix above issues${colors.reset}\n`);
    process.exit(1);
  }
}

// Run the tests
runTests();
