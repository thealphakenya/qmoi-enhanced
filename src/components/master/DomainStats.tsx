/**
 * Domain Statistics Component
 *
 * Displays comprehensive domain health statistics
 * Used in master domain health dashboard
 *
 * Location: src/components/master/DomainStats.tsx
 */
'use client';
interface DomainStats {
  totalDomains: number;
  healthyDomains: number;
  healthPercentage: number;
  lastValidated: string;
  allHealthy: boolean;
}
interface DomainStatsProps {
  stats: DomainStats | null;
  loading?: boolean;
}
export default function DomainStats({ stats, loading = false }: DomainStatsProps): any {
  try {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-100 animate-pulse p-4 rounded-lg">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (percentage >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };
    return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Domains */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Domains</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDomains}</p>
          </div>
          <div className="text-3xl">🌐</div>
        </div>
      </div>
      {/* Healthy Domains */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Healthy Domains</p>
            <p className="text-2xl font-bold text-green-600">{stats.healthyDomains}</p>
            <p className="text-xs text-gray-500">≥80% health</p>
          </div>
          <div className="text-3xl">✅</div>
        </div>
      </div>
      {/* Overall Health */}
      <div className={`border rounded-lg p-4 ${getHealthColor(stats.healthPercentage)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overall Health</p>
            <p className="text-2xl font-bold">{stats.healthPercentage.toFixed(1)}%</p>
            <p className="text-xs opacity-75">System status</p>
          </div>
          <div className="text-3xl">
            {stats.healthPercentage >= 80 ? '🟢' :
             stats.healthPercentage >= 60 ? '🟡' :
             stats.healthPercentage >= 40 ? '🟠' : '🔴'}
          </div>
        </div>
      </div>
      {/* System Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">System Status</p>
            <p className={`text-2xl font-bold ${stats.allHealthy ? 'text-green-600' : 'text-red-600'}`}>
              {stats.allHealthy ? 'HEALTHY' : 'ISSUES'}
            </p>
            <p className="text-xs text-gray-500">All domains</p>
          </div>
          <div className="text-3xl">
            {stats.allHealthy ? '🎉' : '⚠️'}
          </div>
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error?.('DomainStats render error:', error);
    return null;
  }
}