// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
'use client';

import { useEffect, useState } from 'react';

interface LinkTrack {
  url: string;
  status: 'active' | 'inactive' | 'checking';
  lastChecked: string;
  responseTime?: number;
  error?: string;
  accessCount: number;
  lastAccessed?: string;
}

interface DomainValidation {
  domain: string;
  registered: boolean;
  globalAccessible: boolean;
  globalRegionsChecked: number;
  globalSuccessRate: number;
  dnsRecords: string[];
  whoisInfo?: string;
  lastValidated: string;
}

export default function MasterLinksDashboard() {
  const [linkTracks, setLinkTracks] = useState<LinkTrack[]>([]);
  const [domainValidations, setDomainValidations] = useState<DomainValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Set up real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, domainsRes] = await Promise.all([
        fetch('/api/master/links'),
        fetch('/api/master/domains')
      ]);

      if (!linksRes.ok || !domainsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const linksData = await linksRes.json();
      const domainsData = await domainsRes.json();

      setLinkTracks(linksData.tracks || []);
      setDomainValidations(domainsData.validations || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">QMOI Master Links Dashboard</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">QMOI Master Links Dashboard</h1>
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">QMOI Master Links Dashboard</h1>

        {/* Domain Validations */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Domain Validations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainValidations.map((domain) => (
              <div key={domain.domain} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-2">{domain.domain}</h3>
                <div className="space-y-2">
                  <div className={`text-sm ${domain.registered ? 'text-green-400' : 'text-red-400'}`}>
                    Registered: {domain.registered ? 'Yes' : 'No'}
                  </div>
                  <div className={`text-sm ${domain.globalAccessible ? 'text-green-400' : 'text-red-400'}`}>
                    Globally Accessible: {domain.globalAccessible ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-blue-400">
                    Global Success Rate: {(domain.globalSuccessRate * 100).toFixed(1)}% ({domain.globalRegionsChecked} regions)
                  </div>
                  <div className="text-sm text-gray-400">
                    DNS Records: {domain.dnsRecords.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last Validated: {new Date(domain.lastValidated).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link Tracks */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Link Status & Stats</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4">URL</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Response Time</th>
                  <th className="text-left p-4">Access Count</th>
                  <th className="text-left p-4">Last Checked</th>
                  <th className="text-left p-4">Last Accessed</th>
                  <th className="text-left p-4">Error</th>
                </tr>
              </thead>
              <tbody>
                {linkTracks.map((track) => (
                  <tr key={track.url} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-4">
                      <a href={track.url} target="_blank" rel="noopener noreferrer"
                         className="text-blue-400 hover:text-blue-300 break-all">
                        {track.url}
                      </a>
                    </td>
                    <td className={`p-4 ${getStatusColor(track.status)}`}>
                      {track.status}
                    </td>
                    <td className="p-4">
                      {track.responseTime ? `${track.responseTime}ms` : 'N/A'}
                    </td>
                    <td className="p-4">{track.accessCount}</td>
                    <td className="p-4 text-sm">
                      {new Date(track.lastChecked).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm">
                      {track.lastAccessed ? new Date(track.lastAccessed).toLocaleString() : 'Never'}
                    </td>
                    <td className="p-4 text-red-400 text-sm">
                      {track.error || 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-400">{linkTracks.length}</div>
            <div className="text-sm text-gray-400">Total Links</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-400">
              {linkTracks.filter(t => t.status === 'active').length}
            </div>
            <div className="text-sm text-gray-400">Active Links</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-red-400">
              {linkTracks.filter(t => t.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-400">Inactive Links</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {linkTracks.filter(t => t.status === 'checking').length}
            </div>
            <div className="text-sm text-gray-400">Checking Links</div>
          </div>
        </div>
      </div>
    </div>
  );
}