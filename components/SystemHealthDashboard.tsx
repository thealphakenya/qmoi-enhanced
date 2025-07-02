import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SelfHealingService, SystemError } from '../scripts/services/self_healing';

const initialErrors: SystemError[] = [
  {
    id: 'err1',
    type: 'distribution',
    message: 'Failed to publish to ExamplePlatform',
    detectedAt: new Date(Date.now() - 3600 * 1000),
    severity: 'medium',
    context: { platform: 'ExamplePlatform' },
  },
  {
    id: 'err2',
    type: 'analytics',
    message: 'Analytics API timeout',
    detectedAt: new Date(Date.now() - 7200 * 1000),
    severity: 'low',
    context: { api: 'AnalyticsOptimizationService' },
  },
];

const SystemHealthDashboard: React.FC = () => {
  const [errors, setErrors] = useState<SystemError[]>(initialErrors);
  const [diagnosis, setDiagnosis] = useState<{ [id: string]: string }>({});
  const [fixHistory, setFixHistory] = useState<string[]>([]);
  const isMasterOrTeam = true; // Replace with actual role check
  const [healthStats, setHealthStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const diagnoseError = async (error: SystemError) => {
    const diag = await SelfHealingService.diagnoseError(error);
    setDiagnosis(prev => ({ ...prev, [error.id]: diag }));
  };

  const autoFixError = async (error: SystemError) => {
    const diag = await SelfHealingService.diagnoseError(error);
    const result = await SelfHealingService.autoFixError(error);
    setFixHistory(prev => [
      `Auto-fix for ${error.id} (${error.type}): ${result ? 'Success' : 'Failed'} at ${new Date().toLocaleString()}`,
      ...prev
    ]);
    await SelfHealingService.reportToMaster(error, diag, result);
    setErrors(prev => prev.filter(e => e.id !== error.id));
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/qmoi_health_status.json');
        if (res.ok) {
          setHealthStats(await res.json());
        } else {
          // fallback to /status endpoint
          const statusRes = await fetch('/status');
          if (statusRes.ok) setHealthStats(await statusRes.json());
        }
      } catch {
        setHealthStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8">
      {isMasterOrTeam && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">System Health & Self-Healing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Detected Errors & Problems</h3>
              {errors.length === 0 && <div className="text-green-600">No current errors detected.</div>}
              <ul className="space-y-2">
                {errors.map(error => (
                  <li key={error.id} className="border rounded p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{error.type.toUpperCase()}</span>
                      <span className="text-xs text-gray-500">{error.message}</span>
                      <span className="text-xs text-gray-400">Severity: {error.severity}</span>
                    </div>
                    <div className="text-xs text-gray-400">Detected: {error.detectedAt.toLocaleString()}</div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => diagnoseError(error)}>Diagnose</Button>
                      <Button size="sm" variant="destructive" onClick={() => autoFixError(error)}>Auto-Fix</Button>
                    </div>
                    {diagnosis[error.id] && (
                      <div className="text-xs text-blue-600 mt-1">Diagnosis: {diagnosis[error.id]}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Fix History</h3>
              <ul className="text-xs space-y-1">
                {fixHistory.map((log, idx) => (
                  <li key={idx}>{log}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      <Card className="bg-white shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">QMOI Health & Accuracy Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading health stats...</div>
          ) : healthStats ? (
            <div>
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <span className={`px-2 py-1 rounded text-xs ${healthStats.percent_fixed >= 95 ? 'bg-green-100 text-green-800' : healthStats.percent_fixed >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>Health: {healthStats.percent_fixed}%</span>
                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">Total Errors: {healthStats.total_errors}</span>
                <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">Remaining: {healthStats.errors_remaining}</span>
                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Fixed: {healthStats.errors_fixed}</span>
                <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">Auto-Fix Attempts: {healthStats.auto_fix_attempts}</span>
                <span className="px-2 py-1 rounded text-xs bg-purple-200 text-purple-900">Auto-Fix Success: {healthStats.auto_fix_success}</span>
              </div>
              <div style={{width:'100%',background:'#eee',borderRadius:8,overflow:'hidden',marginBottom:10}}>
                <div style={{width:`${healthStats.percent_fixed ?? 0}%`,background:'#4ade80',color:'#fff',padding:'4px 0',textAlign:'center'}}>{healthStats.percent_fixed ?? 0}%</div>
              </div>
              <div className="text-xs text-gray-500">Last update: {healthStats.last_update}</div>
              <div className="text-xs text-gray-500">Last error: {healthStats.last_error}</div>
              <div className="text-xs text-gray-500">Last fix: {healthStats.last_fix}</div>
            </div>
          ) : (
            <div className="text-red-600">Failed to load health stats.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthDashboard; 