"use client";
import React, { useState, useEffect } from "react";
import logger from '../../src/lib/logger';
const isProduction = process.env.NODE_ENV === "production";
export default function DevPage() {
  if (isProduction) {
    return (
      <main className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Developer Utilities</h1>
          <p className="text-slate-300">
            Developer utilities are disabled in production environments. Access to debug tools must be gated through secure operational procedures.
          </p>
        </div>
      </main>
    );
  }
  const [apiTestResults, setApiTestResults] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const testEndpoints = async () => {
    setLoading(true);
    const endpoints = [
      '/api/production-api',
      '/api/admin/dashboard',
      '/api/devices',
      '/api/qi-spaces',
      '/api/qcity/metrics',
      '/api/qvillage/spaces'
    ];
    const results = [];
    for (const endpoint of endpoints) {
      try {
        const start = Date.now();
        const response = await fetch(endpoint);
        const end = Date.now();
        const data = await response.json();
        results.push({
          endpoint,
          status: response.status,
          success: response.ok,
          responseTime: end - start,
          hasData: data && Object.keys(data).length > 0
        });
      } catch (error) {
        results.push({
          endpoint,
          status: 'ERROR',
          success: false,
          responseTime: 0,
          error: error.message
        });
      }
    }
    setApiTestResults(results);
    setLoading(false);
  };
  const loadDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug/info');
      if (response.ok) {
        const data = await response.json();
        setDebugInfo(data);
      }
    } catch (error) {
      try { logger.error('Failed to load debug info', error); } catch (e) { console.error('Failed to load debug info:', error); }
    }
  };
  useEffect(() => {
    loadDebugInfo();
  }, []);
  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Developer Utilities</h1>
        <p className="text-slate-300 mb-8">Launch internal tools, diagnostics, and development helpers safely.</p>
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">API Endpoint Tester</h2>
            <p className="text-slate-400 mb-4">Validate internal API endpoints without exposing production traffic.</p>
            <button
              onClick={testEndpoints}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Run Tests'}
            </button>
            {apiTestResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {apiTestResults.map((result, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-mono">{result.endpoint}</span>
                    <span className={`ml-2 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                      {result.status} ({result.responseTime}ms)
                    </span>
                    {result.error && <span className="text-red-400 ml-2">{result.error}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">Debug Console</h2>
            <p className="text-slate-400 mb-4">Review logs, diagnostics, and runtime health checks from this workspace.</p>
            <button
              onClick={loadDebugInfo}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white mr-2"
            >
              Refresh Info
            </button>
            <button
              onClick={() => setDebugInfo({})}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
            >
              Clear
            </button>
            {Object.keys(debugInfo).length > 0 && (
              <pre className="mt-4 text-xs text-slate-300 bg-slate-800 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">System Health</h2>
          <p className="text-slate-400">Current system status and metrics.</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">●</div>
              <div className="text-sm text-slate-400">Database</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">●</div>
              <div className="text-sm text-slate-400">API</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">●</div>
              <div className="text-sm text-slate-400">Cache</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">●</div>
              <div className="text-sm text-slate-400">Memory</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
