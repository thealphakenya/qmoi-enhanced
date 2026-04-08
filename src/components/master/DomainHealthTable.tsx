/**
 * Domain Health Table Component
 *
 * Displays domain validation results in a comprehensive table
 * Used in master domain health dashboard
 *
 * Location: src/components/master/DomainHealthTable.tsx
 */

'use client';

import React from 'react';

interface DomainValidation {
  domain: string;
  dnsResolution: boolean;
  sslCertificate: boolean;
  accessibility: boolean;
  responseTime: number;
  lastValidated: string;
  health: number;
}

interface GoDaddyStatus {
  registered: boolean;
  sslActive: boolean;
  dnsConfigured: boolean;
  paidFeatures: string[];
  revenue: number;
  lastSync: string;
}

interface DomainHealthTableProps {
  validations: DomainValidation[];
  godaddyStatus: Record<string, GoDaddyStatus>;
  loading?: boolean;
}

export default function DomainHealthTable({ validations, godaddyStatus, loading = false }: DomainHealthTableProps) {
  // Get health color class
  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600 bg-green-100';
    if (health >= 60) return 'text-yellow-600 bg-yellow-100';
    if (health >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Get status icon
  const getStatusIcon = (status: boolean) => {
    return status ? '✅' : '❌';
  };

  // Get GoDaddy status display
  const getGoDaddyStatus = (domain: string) => {
    const status = godaddyStatus[domain];
    if (!status) return '⏳';

    if (status.registered && status.sslActive && status.dnsConfigured) {
      return '✅';
    } else if (status.registered) {
      return '⚠️';
    } else {
      return '❌';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Domain Health Status</h2>
        <p className="text-sm text-gray-600 mt-1">Real-time validation results for all QMOI domains</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domain
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DNS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SSL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Access
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GoDaddy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Checked
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {validations.map((domain) => (
              <tr key={domain.domain} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{domain.domain}</div>
                  <div className="text-xs text-gray-500">
                    {domain.domain.includes('qmoi.ai') && 'Primary'}
                    {domain.domain.includes('prod') && 'Infrastructure'}
                    {domain.domain.includes('huggingface.co') && 'External'}
                    {domain.domain.includes('ngrok.io') && 'Fallback'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthColor(domain.health)}`}>
                    {domain.health}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`text-lg ${domain.dnsResolution ? 'text-green-600' : 'text-red-600'}`}>
                    {getStatusIcon(domain.dnsResolution)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`text-lg ${domain.sslCertificate ? 'text-green-600' : 'text-red-600'}`}>
                    {getStatusIcon(domain.sslCertificate)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`text-lg ${domain.accessibility ? 'text-green-600' : 'text-red-600'}`}>
                    {getStatusIcon(domain.accessibility)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {domain.responseTime > 0 ? `${domain.responseTime.toFixed(0)}ms` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-lg">
                    {getGoDaddyStatus(domain.domain)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(domain.lastValidated).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total: {validations.length} domains</span>
          <span>
            Healthy: {validations.filter(v => v.health >= 80).length} |
            Issues: {validations.filter(v => v.health < 80).length}
          </span>
        </div>
      </div>
    </div>
  );
}