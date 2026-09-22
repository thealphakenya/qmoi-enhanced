#!/usr/bin/env node

/**
 * QMOI Auto Vercel Fix Script
 * Automatically fixes common Vercel deployment errors
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VercelAutoFix {
  constructor() {
    this.projectRoot = process.cwd();
    this.fixes = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async checkAndFixPublicDirectory() {
    this.log('Checking public directory...');
    
    const publicDir = path.join(this.projectRoot, 'public');
    if (!fs.existsSync(publicDir)) {
      this.log('Creating public directory...');
      fs.mkdirSync(publicDir, { recursive: true });
      this.fixes.push('Created missing public directory');
    }

    // Ensure index.html exists
    const indexHtml = path.join(publicDir, 'index.html');
    if (!fs.existsSync(indexHtml)) {
      this.log('Creating index.html...');
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QMOI Alpha AI</title>
</head>
<body>
    <h1>🚀 QMOI Alpha AI</h1>
    <p>Comprehensive AI System with Friendship Enhancement</p>
</body>
</html>`;
      fs.writeFileSync(indexHtml, htmlContent);
      this.fixes.push('Created missing index.html');
    }
  }

  async checkAndFixPackageJson() {
    this.log('Checking package.json...');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      this.log('Creating package.json...');
      const packageJson = {
        name: "qmoi-alpha-ai",
        version: "1.0.0",
        description: "QMOI Alpha AI - Comprehensive AI System",
        scripts: {
          "dev": "next dev",
          "build": "next build",
          "start": "next start",
          "export": "next export"
        },
        dependencies: {
          "next": "^14.0.0",
          "react": "^18.0.0",
          "react-dom": "^18.0.0"
        }
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      this.fixes.push('Created missing package.json');
    }
  }

  async checkAndFixVercelConfig() {
    this.log('Checking vercel.json...');
    
    const vercelConfigPath = path.join(this.projectRoot, 'vercel.json');
    if (!fs.existsSync(vercelConfigPath)) {
      this.log('Creating vercel.json...');
      const vercelConfig = {
        "$schema": "https://openapi.vercel.sh/vercel.json",
        "version": 2,
        "name": "qmoi-alpha-ai",
        "buildCommand": "npm run build",
        "outputDirectory": "public",
        "installCommand": "npm install",
        "framework": "nodejs",
        "functions": {
          "app/api/**/*.js": {
            "maxDuration": 30
          }
        },
        "routes": [
          {
            "src": "/api/(.*)",
            "dest": "/app/api/$1"
          },
          {
            "src": "/(.*)",
            "dest": "/public/$1"
          }
        ]
      };
      fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
      this.fixes.push('Created missing vercel.json');
    }
  }

  async checkAndFixNextConfig() {
    this.log('Checking next.config.js...');
    
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (!fs.existsSync(nextConfigPath)) {
      this.log('Creating next.config.js...');
      const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig`;
      fs.writeFileSync(nextConfigPath, nextConfig);
      this.fixes.push('Created missing next.config.js');
    } else {
      // Check if existing config has problematic settings
      try {
        const configContent = fs.readFileSync(nextConfigPath, 'utf8');
        if (configContent.includes('appDir: true') || configContent.includes('NODE_ENV')) {
          this.log('Fixing problematic next.config.js settings...');
          const fixedConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig`;
          fs.writeFileSync(nextConfigPath, fixedConfig);
          this.fixes.push('Fixed problematic next.config.js settings');
        }
      } catch (error) {
        this.errors.push('Failed to check/fix next.config.js: ' + error.message);
      }
    }
  }

  async checkAndFixAppDirectory() {
    this.log('Checking app directory structure...');
    
    const appDir = path.join(this.projectRoot, 'app');
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
      this.fixes.push('Created missing app directory');
    }

    // Create page.js if it doesn't exist
    const pageJsPath = path.join(appDir, 'page.js');
    if (!fs.existsSync(pageJsPath)) {
      this.log('Creating app/page.js...');
      const pageContent = `export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">🚀 QMOI Alpha AI</h1>
          <p className="text-2xl mb-12">Comprehensive AI System with Friendship Enhancement</p>
        </div>
      </div>
    </div>
  )
}`;
      fs.writeFileSync(pageJsPath, pageContent);
      this.fixes.push('Created missing app/page.js');
    }

    // Create layout.js if it doesn't exist
    const layoutJsPath = path.join(appDir, 'layout.js');
    if (!fs.existsSync(layoutJsPath)) {
      this.log('Creating app/layout.js...');
      const layoutContent = `export const metadata = {
  title: 'QMOI Alpha AI - Comprehensive AI System',
  description: 'QMOI Alpha AI - Advanced AI system with friendship enhancement',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`;
      fs.writeFileSync(layoutJsPath, layoutContent);
      this.fixes.push('Created missing app/layout.js');
    }
  }

  async installDependencies() {
    this.log('Installing dependencies...');
    try {
      // Use --legacy-peer-deps to handle TypeScript version conflicts
      execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
      this.fixes.push('Installed dependencies with legacy peer deps');
    } catch (error) {
      this.errors.push('Failed to install dependencies: ' + error.message);
    }
  }

  async runBuild() {
    this.log('Running build test...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      this.fixes.push('Build completed successfully');
    } catch (error) {
      this.errors.push('Build failed: ' + error.message);
    }
  }

  async generateReport() {
    this.log('Generating fix report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      fixes: this.fixes,
      errors: this.errors,
      summary: {
        totalFixes: this.fixes.length,
        totalErrors: this.errors.length,
        success: this.errors.length === 0
      }
    };

    const reportPath = path.join(this.projectRoot, 'vercel-fix-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Report saved to: ${reportPath}`);
    return report;
  }

  async run() {
    this.log('🚀 Starting QMOI Auto Vercel Fix...');
    
    try {
      await this.checkAndFixPublicDirectory();
      await this.checkAndFixPackageJson();
      await this.checkAndFixVercelConfig();
      await this.checkAndFixNextConfig();
      await this.checkAndFixAppDirectory();
      await this.installDependencies();
      await this.runBuild();
      
      const report = await this.generateReport();
      
      this.log('✅ Auto fix completed!', 'success');
      this.log(`Fixed ${report.summary.totalFixes} issues`);
      
      if (report.summary.totalErrors > 0) {
        this.log(`⚠️  ${report.summary.totalErrors} errors encountered`, 'error');
      }
      
      return report;
    } catch (error) {
      this.log(`❌ Auto fix failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Run the auto fix if this script is executed directly
if (require.main === module) {
  const autoFix = new VercelAutoFix();
  autoFix.run().catch(console.error);
}

module.exports = { VercelAutoFix }; 