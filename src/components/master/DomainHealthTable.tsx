
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}


/**
 * Enhanced Domain Health Table Component
 *
 production-ready
 * Includes link health, domain stats, and automated monitoring features
 *
 * Location: src/components/master/DomainHealthTable.tsx
 */

'use client';

import { specificExports } from 'react';

interface DomainValidation {
  domain: string;
  dnsResolution: boolean;
  sslCertificate: boolean;
  accessibility: boolean;
  responseTime: number;
  lastValidated: string;
  health: number;
  ownership: 'qmoi' | 'external' | 'partner' | 'unknown';
  category: string;
  management: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  autoRepairEnabled: boolean;
  customNaming: boolean;
  linkStatus?: {
    totalLinks: number;
    healthyLinks: number;
    brokenLinks: number;
    lastLinkCheck: string;
  };
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
  onRefresh?: () => void;
  onAutoRepair?: (domain: string) => void;
  showLinkStats?: boolean;
}

export default /**
 * DomainHealthTable function
 */
function DomainHealthTable(): any {
  try {({
  validations,
  godaddyStatus,
  loading = false,
  onRefresh,
  onAutoRepair,
  showLinkStats = true
}: DomainHealthTableProps) {
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'health' | 'responseTime' | 'priority'>('health');

  // Toggle expanded view for domain details
  const toggleExpanded = (domain: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain);
    } else {
      newExpanded.add(domain);
    }
    setExpandedDomains(newExpanded);
  };

  // Get health color class with enhanced styling
  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-700 bg-green-50 border-green-200';
    if (health >= 80) return 'text-green-600 bg-green-100 border-green-300';
    if (health >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    if (health >= 40) return 'text-orange-600 bg-orange-100 border-orange-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get status icon with better visual indicators
  const getStatusIcon = (status: boolean) => {
    return status ?
      <span className="text-green-600 font-bold">✓</span> :
      <span className="text-red-600 font-bold">✗</span>;
  };

  // Filter and sort validations
  const filteredValidations = validations
    .filter(v => filterPriority === 'all' || v.priority === filterPriority)
    .filter(v => filterCategory === 'all' || v.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'health': return b.health - a.health;
        case 'responseTime': return a.responseTime - b.responseTime;
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default: return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading domain health data</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header with controls */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Domain Health Status</h2>
          <div className="flex items-center space-x-4">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Priority:</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="primary">Primary</option>
                <option value="service">Service</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="application">Application</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="health">Health</option>
                <option value="responseTime">Response Time</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
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
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DNS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SSL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response
              </th>
              {showLinkStats && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Links
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredValidations.map((validation) => (
              <React.Fragment key={validation.domain}>
                <tr
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpanded(validation.domain)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(validation.priority)}`}>
                          {validation.priority}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {validation.domain}
                        </div>
                        <div className="text-sm text-gray-500">
                          {validation.category} • {validation.ownership}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getHealthColor(validation.health)}`}>
                      {validation.health}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(validation.priority)}`}>
                      {validation.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getStatusIcon(validation.dnsResolution)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getStatusIcon(validation.sslCertificate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {validation.responseTime}ms
                  </td>
                  {showLinkStats && validation.linkStatus && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">{validation.linkStatus.healthyLinks}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-red-600">{validation.linkStatus.brokenLinks}</span>
                          <span className="text-gray-400">/</span>
                          <span>{validation.linkStatus.totalLinks}</span>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(validation.domain);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {expandedDomains.has(validation.domain) ? 'Collapse' : 'Expand'}
                      </button>
                      {validation.autoRepairEnabled && onAutoRepair && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAutoRepair(validation.domain);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Auto-Repair
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded details */}
                {expandedDomains.has(validation.domain) && (
                  <tr>
                    <td colSpan={showLinkStats ? 8 : 7} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Domain Details</h4>
                          <dl className="space-y-1">
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-600">Ownership:</dt>
                              <dd className="text-sm text-gray-900">{validation.ownership}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-600">Category:</dt>
                              <dd className="text-sm text-gray-900">{validation.category}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-600">Management:</dt>
                              <dd className="text-sm text-gray-900">{validation.management}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-600">Last Validated:</dt>
                              <dd className="text-sm text-gray-900">
                                {new Date(validation.lastValidated).toLocaleString()}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {validation.linkStatus && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Link Health</h4>
                            <dl className="space-y-1">
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Total Links:</dt>
                                <dd className="text-sm text-gray-900">{validation.linkStatus.totalLinks}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Healthy:</dt>
                                <dd className="text-sm text-green-600">{validation.linkStatus.healthyLinks}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">FUNCTIONAL:</dt>
                                <dd className="text-sm text-red-600">{validation.linkStatus.brokenLinks}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Last Check:</dt>
                                <dd className="text-sm text-gray-900">
                                  {new Date(validation.linkStatus.lastLinkCheck).toLocaleString()}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        )}

                        {godaddyStatus[validation.domain] && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">GoDaddy Status</h4>
                            <dl className="space-y-1">
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Registered:</dt>
                                <dd className="text-sm text-gray-900">
                                  {getStatusIcon(godaddyStatus[validation.domain].registered)}
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">SSL Active:</dt>
                                <dd className="text-sm text-gray-900">
                                  {getStatusIcon(godaddyStatus[validation.domain].sslActive)}
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">DNS Configured:</dt>
                                <dd className="text-sm text-gray-900">
                                  {getStatusIcon(godaddyStatus[validation.domain].dnsConfigured)}
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Revenue:</dt>
                                <dd className="text-sm text-gray-900">
                                  ${godaddyStatus[validation.domain].revenue}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredValidations.length} of {validations.length} domains
          </span>
          <div className="flex items-center space-x-4">
            <span>
              Healthy: {validations.filter(v => v.health >= 80).length}
            </span>
            <span>
              Critical: {validations.filter(v => v.priority === 'critical').length}
            </span>
            <span>
              Auto-Repair Enabled: {validations.filter(v => v.autoRepairEnabled).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
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
        production-ready
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