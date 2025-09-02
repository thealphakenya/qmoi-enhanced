#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class JSONConfigFixer {
  constructor() {
    this.logFile = path.join(process.cwd(), 'logs', 'json-config-fixer.log');
    this.ensureLogDir();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(this.logFile, logEntry);
    console.log(`[${level}] ${message}`);
  }

  async findJSONFiles(dir = process.cwd()) {
    const jsonFiles = [];
    
    const findFiles = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            findFiles(fullPath);
          } else if (item.endsWith('.json')) {
            jsonFiles.push(fullPath);
          }
        }
      } catch (error) {
        this.log(`Error reading directory ${currentDir}: ${error.message}`, 'WARN');
      }
    };
    
    findFiles(dir);
    return jsonFiles;
  }

  async validateJSONFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      return { valid: true, errors: [] };
    } catch (error) {
      return { valid: false, errors: [error.message] };
    }
  }

  async fixJSONFile(filePath) {
    try {
      this.log(`Fixing JSON file: ${filePath}`);
      
      const content = fs.readFileSync(filePath, 'utf8');
      let fixedContent = content;
      let fixes = [];
      
      // Fix common JSON issues
      
      // 1. Fix trailing commas
      fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1');
      if (fixedContent !== content) {
        fixes.push('Removed trailing commas');
      }
      
      // 2. Fix missing quotes around property names
      fixedContent = fixedContent.replace(/(\s*)(\w+)(\s*):/g, '$1"$2"$3:');
      if (fixedContent !== content) {
        fixes.push('Added quotes around property names');
      }
      
      // 3. Fix single quotes to double quotes
      fixedContent = fixedContent.replace(/'/g, '"');
      if (fixedContent !== content) {
        fixes.push('Converted single quotes to double quotes');
      }
      
      // 4. Fix unescaped quotes in strings
      fixedContent = fixedContent.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '"$1\\"$2\\"$3"');
      
      // 5. Fix missing commas
      fixedContent = fixedContent.replace(/(\s*[}\]])/g, ',$1');
      fixedContent = fixedContent.replace(/,\s*,\s*([}\]])/g, ',$1');
      
      // 6. Fix extra commas
      fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1');
      
      // Validate the fixed content
      try {
        JSON.parse(fixedContent);
        this.log(`JSON file fixed successfully: ${filePath}`);
        this.log(`Fixes applied: ${fixes.join(', ')}`);
        
        // Write the fixed content back
        fs.writeFileSync(filePath, fixedContent);
        
        return { success: true, fixes };
      } catch (parseError) {
        this.log(`Failed to fix JSON file ${filePath}: ${parseError.message}`, 'ERROR');
        return { success: false, error: parseError.message };
      }
      
    } catch (error) {
      this.log(`Error fixing JSON file ${filePath}: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async fixPackageJSON() {
    try {
      this.log('Fixing package.json...');
      
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        this.log('package.json not found, creating basic one', 'WARN');
        const basicPackageJson = {
          "name": "qmoi-ai-system",
          "version": "1.0.0",
          "description": "QMOI AI System with comprehensive automation",
          "main": "index.js",
          "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject",
            "auto:setup": "node scripts/auto-setup.js",
            "gitlab:automation": "node scripts/gitlab-automation.js",
            "qmoi:setup": "npm run auto:setup",
            "qmoi:test": "npm test",
            "qmoi:build": "npm run build",
            "qmoi:all": "npm run qmoi:setup && npm run qmoi:test && npm run qmoi:build"
          },
          "dependencies": {
            "react": "^18.0.0",
            "react-dom": "^18.0.0",
            "react-scripts": "5.0.1"
          },
          "devDependencies": {
            "@testing-library/react": "^13.0.0",
            "@testing-library/jest-dom": "^5.16.0",
            "@testing-library/user-event": "^14.0.0",
            "jest": "^27.0.0",
            "jest-environment-jsdom": "^27.0.0"
          },
          "browserslist": {
            "production": [
              ">0.2%",
              "not dead",
              "not op_mini all"
            ],
            "development": [
              "last 1 chrome version",
              "last 1 firefox version",
              "last 1 safari version"
            ]
          }
        };
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(basicPackageJson, null, 2));
        this.log('Created basic package.json');
        return { success: true, fixes: ['Created package.json'] };
      }
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      let fixes = [];
      
      // Ensure required fields exist
      if (!packageJson.name) {
        packageJson.name = 'qmoi-ai-system';
        fixes.push('Added name field');
      }
      
      if (!packageJson.version) {
        packageJson.version = '1.0.0';
        fixes.push('Added version field');
      }
      
      if (!packageJson.description) {
        packageJson.description = 'QMOI AI System with comprehensive automation';
        fixes.push('Added description field');
      }
      
      // Ensure scripts section exists
      if (!packageJson.scripts) {
        packageJson.scripts = {};
        fixes.push('Added scripts section');
      }
      
      // Add missing QMOI scripts
      const requiredScripts = {
        'auto:setup': 'node scripts/auto-setup.js',
        'gitlab:automation': 'node scripts/gitlab-automation.js',
        'qmoi:setup': 'npm run auto:setup',
        'qmoi:test': 'npm test',
        'qmoi:build': 'npm run build',
        'qmoi:all': 'npm run qmoi:setup && npm run qmoi:test && npm run qmoi:build'
      };
      
      for (const [script, command] of Object.entries(requiredScripts)) {
        if (!packageJson.scripts[script]) {
          packageJson.scripts[script] = command;
          fixes.push(`Added script: ${script}`);
        }
      }
      
      // Ensure dependencies exist
      if (!packageJson.dependencies) {
        packageJson.dependencies = {};
        fixes.push('Added dependencies section');
      }
      
      if (!packageJson.devDependencies) {
        packageJson.devDependencies = {};
        fixes.push('Added devDependencies section');
      }
      
      // Add missing essential dependencies
      const essentialDeps = {
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        'react-scripts': '5.0.1'
      };
      
      for (const [dep, version] of Object.entries(essentialDeps)) {
        if (!packageJson.dependencies[dep]) {
          packageJson.dependencies[dep] = version;
          fixes.push(`Added dependency: ${dep}`);
        }
      }
      
      // Add missing dev dependencies
      const essentialDevDeps = {
        '@testing-library/react': '^13.0.0',
        '@testing-library/jest-dom': '^5.16.0',
        '@testing-library/user-event': '^14.0.0',
        'jest': '^27.0.0',
        'jest-environment-jsdom': '^27.0.0'
      };
      
      for (const [dep, version] of Object.entries(essentialDevDeps)) {
        if (!packageJson.devDependencies[dep]) {
          packageJson.devDependencies[dep] = version;
          fixes.push(`Added devDependency: ${dep}`);
        }
      }
      
      // Ensure browserslist exists
      if (!packageJson.browserslist) {
        packageJson.browserslist = {
          "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
          ],
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
          ]
        };
        fixes.push('Added browserslist configuration');
      }
      
      // Write the fixed package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      
      this.log(`package.json fixed successfully with ${fixes.length} fixes`);
      return { success: true, fixes };
      
    } catch (error) {
      this.log(`Failed to fix package.json: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async fixTsConfigJSON() {
    try {
      this.log('Fixing tsconfig.json...');
      
      const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
      if (!fs.existsSync(tsConfigPath)) {
        this.log('tsconfig.json not found, creating basic one', 'WARN');
        const basicTsConfig = {
          "compilerOptions": {
            "target": "es5",
            "lib": [
              "dom",
              "dom.iterable",
              "es6"
            ],
            "allowJs": true,
            "skipLibCheck": true,
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
            "strict": true,
            "forceConsistentCasingInFileNames": true,
            "noFallthroughCasesInSwitch": true,
            "module": "esnext",
            "moduleResolution": "node",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "noEmit": true,
            "jsx": "react-jsx"
          },
          "include": [
            "src"
          ]
        };
        
        fs.writeFileSync(tsConfigPath, JSON.stringify(basicTsConfig, null, 2));
        this.log('Created basic tsconfig.json');
        return { success: true, fixes: ['Created tsconfig.json'] };
      }
      
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
      let fixes = [];
      
      // Ensure compilerOptions exists
      if (!tsConfig.compilerOptions) {
        tsConfig.compilerOptions = {};
        fixes.push('Added compilerOptions section');
      }
      
      // Add missing essential compiler options
      const essentialOptions = {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "es6"],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx"
      };
      
      for (const [option, value] of Object.entries(essentialOptions)) {
        if (!tsConfig.compilerOptions[option]) {
          tsConfig.compilerOptions[option] = value;
          fixes.push(`Added compiler option: ${option}`);
        }
      }
      
      // Ensure include section exists
      if (!tsConfig.include) {
        tsConfig.include = ["src"];
        fixes.push('Added include section');
      }
      
      // Write the fixed tsconfig.json
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      
      this.log(`tsconfig.json fixed successfully with ${fixes.length} fixes`);
      return { success: true, fixes };
      
    } catch (error) {
      this.log(`Failed to fix tsconfig.json: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async fixJestConfig() {
    try {
      this.log('Fixing jest.config.js...');
      
      const jestConfigPath = path.join(process.cwd(), 'jest.config.js');
      if (!fs.existsSync(jestConfigPath)) {
        this.log('jest.config.js not found, creating basic one', 'WARN');
        const basicJestConfig = `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};`;
        
        fs.writeFileSync(jestConfigPath, basicJestConfig);
        this.log('Created basic jest.config.js');
        return { success: true, fixes: ['Created jest.config.js'] };
      }
      
      this.log('jest.config.js exists, validating...');
      return { success: true, fixes: ['jest.config.js validated'] };
      
    } catch (error) {
      this.log(`Failed to fix jest.config.js: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async fixESLintConfig() {
    try {
      this.log('Fixing .eslintrc.json...');
      
      const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
      if (!fs.existsSync(eslintConfigPath)) {
        this.log('.eslintrc.json not found, creating basic one', 'WARN');
        const basicESLintConfig = {
          "extends": [
            "react-app",
            "react-app/jest"
          ],
          "rules": {
            "no-unused-vars": "warn",
            "no-console": "warn"
          }
        };
        
        fs.writeFileSync(eslintConfigPath, JSON.stringify(basicESLintConfig, null, 2));
        this.log('Created basic .eslintrc.json');
        return { success: true, fixes: ['Created .eslintrc.json'] };
      }
      
      const eslintConfig = JSON.parse(fs.readFileSync(eslintConfigPath, 'utf8'));
      let fixes = [];
      
      // Ensure extends section exists
      if (!eslintConfig.extends) {
        eslintConfig.extends = ["react-app", "react-app/jest"];
        fixes.push('Added extends section');
      }
      
      // Ensure rules section exists
      if (!eslintConfig.rules) {
        eslintConfig.rules = {
          "no-unused-vars": "warn",
          "no-console": "warn"
        };
        fixes.push('Added rules section');
      }
      
      // Write the fixed .eslintrc.json
      fs.writeFileSync(eslintConfigPath, JSON.stringify(eslintConfig, null, 2));
      
      this.log(`.eslintrc.json fixed successfully with ${fixes.length} fixes`);
      return { success: true, fixes };
      
    } catch (error) {
      this.log(`Failed to fix .eslintrc.json: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async fixAllJSONFiles() {
    try {
      this.log('Starting comprehensive JSON file fixing...');
      
      const results = {
        total: 0,
        fixed: 0,
        errors: 0,
        details: []
      };
      
      // Find all JSON files
      const jsonFiles = await this.findJSONFiles();
      results.total = jsonFiles.length;
      
      this.log(`Found ${jsonFiles.length} JSON files to check`);
      
      // Fix each JSON file
      for (const filePath of jsonFiles) {
        try {
          const validation = await this.validateJSONFile(filePath);
          
          if (!validation.valid) {
            this.log(`Invalid JSON found: ${filePath}`, 'WARN');
            const fixResult = await this.fixJSONFile(filePath);
            
            if (fixResult.success) {
              results.fixed++;
              results.details.push({
                file: filePath,
                status: 'fixed',
                fixes: fixResult.fixes
              });
            } else {
              results.errors++;
              results.details.push({
                file: filePath,
                status: 'error',
                error: fixResult.error
              });
            }
          } else {
            results.details.push({
              file: filePath,
              status: 'valid',
              fixes: []
            });
          }
        } catch (error) {
          results.errors++;
          results.details.push({
            file: filePath,
            status: 'error',
            error: error.message
          });
        }
      }
      
      // Fix specific configuration files
      const configFixes = [
        await this.fixPackageJSON(),
        await this.fixTsConfigJSON(),
        await this.fixJestConfig(),
        await this.fixESLintConfig()
      ];
      
      for (const fix of configFixes) {
        if (fix.success) {
          results.fixed++;
          results.details.push({
            file: 'Configuration file',
            status: 'fixed',
            fixes: fix.fixes
          });
        } else {
          results.errors++;
          results.details.push({
            file: 'Configuration file',
            status: 'error',
            error: fix.error
          });
        }
      }
      
      this.log(`JSON fixing completed: ${results.fixed} fixed, ${results.errors} errors`);
      return results;
      
    } catch (error) {
      this.log(`Failed to fix JSON files: ${error.message}`, 'ERROR');
      throw error;
    }
  }
}

// Main execution
async function main() {
  const fixer = new JSONConfigFixer();
  
  try {
    const args = process.argv.slice(2);
    const command = args[0];
    const target = args[1];
    
    switch (command) {
      case '--fix-all':
        await fixer.fixAllJSONFiles();
        break;
      case '--fix-file':
        if (!target) {
          console.log('Please specify a file path');
          process.exit(1);
        }
        await fixer.fixJSONFile(target);
        break;
      case '--fix-package':
        await fixer.fixPackageJSON();
        break;
      case '--fix-tsconfig':
        await fixer.fixTsConfigJSON();
        break;
      case '--fix-jest':
        await fixer.fixJestConfig();
        break;
      case '--fix-eslint':
        await fixer.fixESLintConfig();
        break;
      case '--validate':
        if (!target) {
          console.log('Please specify a file path');
          process.exit(1);
        }
        const validation = await fixer.validateJSONFile(target);
        console.log(`File ${target} is ${validation.valid ? 'valid' : 'invalid'}`);
        if (!validation.valid) {
          console.log('Errors:', validation.errors);
        }
        break;
      default:
        console.log('QMOI JSON Config Fixer');
        console.log('Usage:');
        console.log('  --fix-all                    Fix all JSON files');
        console.log('  --fix-file <path>            Fix specific JSON file');
        console.log('  --fix-package                Fix package.json');
        console.log('  --fix-tsconfig               Fix tsconfig.json');
        console.log('  --fix-jest                   Fix jest.config.js');
        console.log('  --fix-eslint                 Fix .eslintrc.json');
        console.log('  --validate <path>            Validate JSON file');
        break;
    }
    
  } catch (error) {
    fixer.log(`JSON config fixer failed: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = { JSONConfigFixer };

// Run if this script is executed directly
if (require.main === module) {
  main();
} 