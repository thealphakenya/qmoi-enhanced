import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ErrorItem {
  id: number;
  type: string;
  message: string;
  severity: string;
  timestamp: string;
  status: string;
}

interface FixItem {
  errorId: number;
  type: string;
  details: string;
  success: boolean;
  timestamp: string;
  duration: number;
}

interface GitHubActionStatus {
  preCheck: string;
  autoFix: string;
  build: string;
  lint: string;
  deploy: string;
  lastRun: string;
}

const QMOIAutoFixDashboard: React.FC<{ isMaster: boolean }> = ({ isMaster }) => {
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [fixes, setFixes] = useState<FixItem[]>([]);
  const [githubStatus, setGitHubStatus] = useState<GitHubActionStatus | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchErrorLog = async () => {
    try {
      const mockErrors: ErrorItem[] = [
        { id: 1, type: 'build', message: 'TypeScript compilation failed', severity: 'high', timestamp: new Date().toISOString(), status: 'fixed' },
        { id: 2, type: 'lint', message: 'ESLint errors found', severity: 'medium', timestamp: new Date().toISOString(), status: 'fixed' },
        { id: 3, type: 'deploy', message: 'Vercel deployment failed', severity: 'high', timestamp: new Date().toISOString(), status: 'pending' }
      ];
      setErrors(mockErrors);
    } catch (error) {
      console.error('Failed to fetch error log:', error);
    }
  };

  const fetchFixHistory = async () => {
    try {
      const mockFixes: FixItem[] = [
        { errorId: 1, type: 'typescript-fix', details: 'Fixed type annotations', success: true, timestamp: new Date().toISOString(), duration: 1500 },
        { errorId: 2, type: 'eslint-fix', details: 'Auto-fixed linting issues', success: true, timestamp: new Date().toISOString(), duration: 800 },
        { errorId: 3, type: 'vercel-deploy', details: 'Force redeploy attempted', success: false, timestamp: new Date().toISOString(), duration: 5000 }
      ];
      setFixes(mockFixes);
    } catch (error) {
      console.error('Failed to fetch fix history:', error);
    }
  };

  const fetchGitHubStatus = async () => {
    try {
      const mockStatus: GitHubActionStatus = {
        preCheck: 'success',
        autoFix: 'success',
        build: 'success',
        lint: 'success',
        deploy: 'success',
        lastRun: new Date().toISOString()
      };
      setGitHubStatus(mockStatus);
    } catch (error) {
      console.error('Failed to fetch GitHub status:', error);
    }
  };

  useEffect(() => {
    if (isMaster) {
      fetchErrorLog();
      fetchFixHistory();
      fetchGitHubStatus();
      setLastUpdate(new Date().toISOString());
    }
  }, [isMaster]);

  const triggerAutoFix = async () => {
    setIsRunning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      fetchErrorLog();
      fetchFixHistory();
      fetchGitHubStatus();
      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Auto-fix failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isMaster) return null;

  const totalErrors = errors.length;
  const fixedErrors = fixes.filter(f => f.success).length;
  const remainingErrors = totalErrors - fixedErrors;
  const successRate = totalErrors > 0 ? Math.round((fixedErrors / totalErrors) * 100) : 100;

  return (
    <Card className="space-y-4 mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>QMOI Auto-Fix Dashboard</span>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(isRunning ? 'pending' : 'success')}>
              {isRunning ? 'Running' : 'Ready'}
            </Badge>
            <Button onClick={triggerAutoFix} disabled={isRunning} size="sm">
              {isRunning ? 'Fixing...' : 'Trigger Auto-Fix'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{totalErrors}</div>
            <div className="text-sm text-gray-600">Total Errors</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{fixedErrors}</div>
            <div className="text-sm text-gray-600">Fixed</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{remainingErrors}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {githubStatus && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">GitHub Actions Status</h4>
            <div className="grid grid-cols-5 gap-2">
              <Badge className={getStatusColor(githubStatus.preCheck)}>Pre-Check</Badge>
              <Badge className={getStatusColor(githubStatus.autoFix)}>Auto-Fix</Badge>
              <Badge className={getStatusColor(githubStatus.build)}>Build</Badge>
              <Badge className={getStatusColor(githubStatus.lint)}>Lint</Badge>
              <Badge className={getStatusColor(githubStatus.deploy)}>Deploy</Badge>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last run: {new Date(githubStatus.lastRun).toLocaleString()}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h4 className="font-semibold mb-2">All Errors</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {errors.map(error => (
              <div key={error.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{error.type}</div>
                  <div className="text-sm text-gray-600">{error.message}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(error.severity)}>{error.severity}</Badge>
                  <Badge className={getStatusColor(error.status)}>{error.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Fix History</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {fixes.map((fix, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{fix.type}</div>
                  <div className="text-sm text-gray-600">{fix.details}</div>
                  <div className="text-xs text-gray-500">
                    Error ID: {fix.errorId} | Duration: {fix.duration}ms
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(fix.success ? 'success' : 'failed')}>
                    {fix.success ? 'SUCCESS' : 'FAILED'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(lastUpdate).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default QMOIAutoFixDashboard; 