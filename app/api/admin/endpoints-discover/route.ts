/**
 * API to collect and validate all endpoints
 * Used for auto-generating API documentation
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface EndpointInfo {
  path: string;
  methods: string[];
  file: string;
  authenticated: boolean;
  description?: string;
}

export async function GET(request: NextRequest) {
  try {
    const endpoints = collectAllEndpoints();
    return NextResponse.json({
      success: true,
      total: endpoints.length,
      endpoints,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

function collectAllEndpoints(): EndpointInfo[] {
  const endpoints: EndpointInfo[] = [];
  const apiDir = path.join(process.cwd(), 'app', 'api');

  // Recursively walk through API directory
  walkDirectory(apiDir, (file: string, relativePath: string) => {
    if (file.endsWith('route.ts') || file.endsWith('route.js')) {
      const content = fs.readFileSync(file, 'utf-8');

      // Extract HTTP methods from the file
      const methods = extractMethods(content);
      const apiPath = normalizeApiPath(relativePath);

      if (methods.length > 0) {
        endpoints.push({
          path: apiPath,
          methods,
          file: relativePath,
          authenticated: checkAuthentication(content),
          description: extractDescription(content),
        });
      }
    }
  });

  return endpoints;
}

function walkDirectory(dir: string, callback: (file: string, relative: string) => void) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDirectory(fullPath, callback);
    } else if (stat.isFile()) {
      const relative = path.relative(process.cwd(), fullPath);
      callback(fullPath, relative);
    }
  }
}

function extractMethods(content: string): string[] {
  const methods = new Set<string>();

  // Match export function patterns
  const patterns = [
    /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/gi,
    /export\s+const\s+\w+\s*=\s*(?:async\s+)?\(.*?\)\s*=>\s*\{(?:[\s\S]*?)(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/gi,
    /router\.(?:get|post|put|delete|patch|head|options)\(/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const method = match[1] || match[0].split('.')[1]?.split('(')[0];
      if (method) {
        methods.add(method.toUpperCase());
      }
    }
  }

  return Array.from(methods);
}

function normalizeApiPath(filePath: string): string {
  // Convert: app/api/users/[id]/route.ts -> /api/users/[id]
  let apiPath = filePath
    .replace(/\\/g, '/') // Normalize slashes
    .replace(/^app\/api\//, '/api/') // Replace app/api prefix
    .replace(/\/route\.[tj]s$/, ''); // Remove route.ts extension

  // Handle [id] style dynamic routes
  return apiPath.includes('[') ? apiPath : apiPath;
}

function checkAuthentication(content: string): boolean {
  const authPatterns = [
    /auth|Authorization|Bearer|JWT|token|session|userId|authenticated/i,
  ];

  return authPatterns.some(pattern => pattern.test(content));
}

function extractDescription(content: string): string | undefined {
  // Try to extract JSDoc or inline comments
  const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\/|\/\/\s*(.+)/);

  if (jsdocMatch) {
    return jsdocMatch[1] || jsdocMatch[0].split('\n')[0];
  }

  return undefined;
}
