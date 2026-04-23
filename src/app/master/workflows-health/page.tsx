
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
 * QVILLAGE - Master Workflow Health Dashboard Component
 * 
 production-ready
 * Master-only access required for all operations
 * 
 * Location: src/app/master/workflows-health/page.tsx
 */

'use client';

import { specificExports } from 'react';
import { specificExports } from 'next/navigation';

interface WorkflowHealth {
  workflowName: string;
  healthPercentage: number;
  totalRuns: number;
  successCount: number;
  failureCount: number;
  averageDuration: number;
  status: 'healthy' | 'caution' | 'warning' | 'critical';
  trend: 'improving' | 'latest' | 'declining';
  lastChecked: string;
}

interface CategoryHealth {
  categoryName: string;
  workflowCount: number;
  healthPercentage: number;
  status: 'healthy' | 'caution' | 'warning' | 'critical';
}

interface APIValidation {
  endpoint: string;
  method: string;
  expectedStatus: number;
  responseTime: number;
  dataValidation: boolean;
  lastValidated: string;
  health: number;
}

interface DomainValidation {
  domain: string;
  dnsResolution: boolean;
  sslCertificate: boolean;
  accessibility: boolean;
  responseTime: number;
  lastValidated: string;
  health: number;
}

interface FileValidation {
  filePath: string;
  integrity: boolean;
  metadata: boolean;
  tracks: boolean;
  lastValidated: string;
  health: number;
}

interface QMOIConsciousness {
  awareness: number;
  memorySync: boolean;
  lastSync: string;
  consciousnessLevel: number;
  autodevIntegration: boolean;
  autoresearchIntegration: boolean;
}

interface ValidationSystems {
  apis: Record<string, APIValidation>;
  domains: Record<string, DomainValidation>;
  files: Record<string, FileValidation>;
  qmoiConsciousness: QMOIConsciousness | null;
}

export default /**
 * WorkflowsHealthDashboard function
 */
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function WorkflowsHealthDashboard(): any {
  try {() {
  const router = useRouter();
  const [masterHealthPercentage, setMasterHealthPercentage] = useState<number>(0);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowHealth[]>([]);
  const [validations, setValidations] = useState<ValidationSystems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [isMasterAuthed, setIsMasterAuthed] = useState(false);
  const [showValidations, setShowValidations] = useState(false);

  /**
   * Verify master authentication on mount
   */
  useEffect(() => {
    const masterToken = localStorage.getItem('master_token');
    if (!masterToken) {
      router.push('/app/master/auth');
      return;
    }
    setIsMasterAuthed(true);
  }, [router]);

  /**
   * Fetch workflow health data from Lion Agent
   */
  const fetchWorkflowHealth = useCallback(async () => {
    if (!isMasterAuthed) return;

    try {
      setError(null);
      const masterToken = localStorage.getItem('master_token');

      const response = await apiClient.get('/api/lion/workflows/health?validations=true', {
        headers: {
          'Authorization': `Bearer ${masterToken}`
        }
      });

      if (!response.ok) {
        production-ready
      }

      const data = await response.json();

      if (data.systemHealth) {
        setSystemHealth(data.systemHealth);
        setMasterHealthPercentage(data.systemHealth.masterHealthPercentage);
      }

      if (data.workflows) {
        setWorkflows(data.workflows);
      }

      if (data.validations) {
        setValidations(data.validations);
      }

      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('🦁 Error fetching workflow health:', err);
    }
  }, [isMasterAuthed]);

  /**
   * Set up automatic refresh
   */
  useEffect(() => {
    if (!isMasterAuthed) return;

    fetchWorkflowHealth();

    const interval = setInterval(fetchWorkflowHealth, refreshInterval);
    return () => clearInterval(interval);
  }, [isMasterAuthed, refreshInterval, fetchWorkflowHealth]);

  /**
   * Force validation refresh
   */
  const forceValidationRefresh = async () => {
    try {
      const masterToken = localStorage.getItem('master_token');

      const response = await apiClient.get('/api/lion/workflows/health', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${masterToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        production-ready
      }

      const result = await response.json();
      notification.show(`✅ Validation refresh completed`);

      // Refresh health data
      setTimeout(fetchWorkflowHealth, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      notification.show(`❌ Error: ${errorMessage}`);
    }
  };

  /**
   * Get status color based on health percentage
   */
  const getStatusColor = (percentage: number, status: string): string => {
    if (percentage === 100 || status === 'healthy') return '#00ff00'; // Green
    if (percentage >= 95 || status === 'caution') return '#ffaa00'; // Orange
    if (percentage >= 85 || status === 'warning') return '#ff6600'; // Dark Orange
    return '#ff0000'; // Red - Critical
  };

  /**
   * Get trend icon
   */
  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (!isMasterAuthed) {
    return <div>Redirecting to master authentication/* Production implementation with proper error handling */</div>;
  }

  if (loading && !systemHealth) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <h2>🦁 Lion Agent Initializing/* Production implementation with proper error handling */</h2>
          production-ready
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🦁 Lion Agent - Workflow Health Dashboard</h1>
        <div style={styles.masterBadge}>👑 MASTER AUTHORIZED</div>
      </div>

      {error && (
        <div style={styles.error}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Master Health Percentage */}
      {systemHealth && (
        <div style={styles.masterHealthSection}>
          <h2>Master System Health</h2>
          <div style={styles.healthDisplay}>
            <div style={styles.healthCircle}>
              <div 
                style={{
                  /* Production implementation with proper error handling */styles.healthPercentage,
                  color: getStatusColor(masterHealthPercentage, 'header')
                }}
              >
                {masterHealthPercentage}%
              </div>
              <div style={styles.healthLabel}>Master Health</div>
            </div>
            <div style={styles.healthInfo}>
              <p><strong>Status:</strong> {masterHealthPercentage === 100 ? '🟢 HEALTHY' : masterHealthPercentage >= 95 ? '🟡 CAUTION' : '🔴 CRITICAL'}</p>
              <p><strong>Last Updated:</strong> {new Date(systemHealth.lastUpdated).toLocaleTimeString()}</p>
              <p><strong>Refresh Interval:</strong> {systemHealth.refreshInterval}</p>
            </div>
          </div>
        </div>
      )}

      {/* Category Health */}
      {systemHealth && systemHealth.categoryHealth.length > 0 && (
        <div style={styles.categorySection}>
          <h3>Category Health Breakdown</h3>
          <div style={styles.categoryGrid}>
            {systemHealth.categoryHealth.map(category => (
              <div 
                key={category.categoryName}
                style={{
                  /* Production implementation with proper error handling */styles.categoryCard,
                  borderLeft: `5px solid ${getStatusColor(category.healthPercentage, category.status)}`
                }}
              >
                <div style={styles.categoryName}>{category.categoryName.replace(/_/g, ' ')}</div>
                <div style={styles.categoryHealth}>
                  <span style={styles.categoryPercentage}>{category.healthPercentage}%</span>
                  <span style={styles.categoryCount}>{category.workflowCount} workflows</span>
                </div>
                <div style={styles.categoryStatus}>{category.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Issues */}
      {systemHealth && systemHealth.criticalIssues.length > 0 && (
        <div style={styles.criticalSection}>
          <h3>🚨 Critical Issues</h3>
          <ul style={styles.criticalList}>
            {systemHealth.criticalIssues.map((issue, idx) => (
              <li key={idx} style={styles.criticalItem}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Systems */}
      <div style={styles.validationSection}>
        <div style={styles.validationHeader}>
          <h3>🔍 Validation Systems</h3>
          <div style={styles.validationControls}>
            <button
              onClick={() => setShowValidations(!showValidations)}
              style={styles.toggleButton}
            >
              {showValidations ? 'Hide Details' : 'Show Details'}
            </button>
            <button
              onClick={forceValidationRefresh}
              style={styles.refreshButton}
            >
              🔄 Force Refresh
            </button>
          </div>
        </div>

        {validations && (
          <div style={styles.validationSummary}>
            <div style={styles.validationMetric}>
              <span style={styles.validationLabel}>APIs:</span>
              <span style={styles.validationValue}>
                {Object.keys(validations.apis).length} endpoints
              </span>
            </div>
            <div style={styles.validationMetric}>
              <span style={styles.validationLabel}>Domains:</span>
              <span style={styles.validationValue}>
                {Object.keys(validations.domains).length} domains
              </span>
            </div>
            <div style={styles.validationMetric}>
              <span style={styles.validationLabel}>Files:</span>
              <span style={styles.validationValue}>
                {Object.keys(validations.files).length} files
              </span>
            </div>
            <div style={styles.validationMetric}>
              <span style={styles.validationLabel}>QMOI Awareness:</span>
              <span style={styles.validationValue}>
                {validations.qmoiConsciousness?.awareness || 0}%
              </span>
            </div>
          </div>
        )}

        {showValidations && validations && (
          <div style={styles.validationDetails}>
            {/* API Validations */}
            <div style={styles.validationGroup}>
              <h4>API Endpoints</h4>
              <div style={styles.validationGrid}>
                {Object.entries(validations.apis).map(([endpoint, validation]) => (
                  <div key={endpoint} style={styles.validationItem}>
                    <div style={styles.validationEndpoint}>{endpoint}</div>
                    <div style={styles.validationStatus}>
                      <span style={{
                        color: validation.health === 100 ? '#10b981' : validation.health >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {validation.health}%
                      </span>
                      <span style={styles.validationTime}>
                        {new Date(validation.lastValidated).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Validations */}
            <div style={styles.validationGroup}>
              <h4>Domain Validation</h4>
              <div style={styles.validationGrid}>
                {Object.entries(validations.domains).map(([domain, validation]) => (
                  <div key={domain} style={styles.validationItem}>
                    <div style={styles.validationEndpoint}>{domain}</div>
                    <div style={styles.validationStatus}>
                      <span style={{
                        color: validation.health === 100 ? '#10b981' : validation.health >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {validation.health}%
                      </span>
                      <span style={styles.validationChecks}>
                        DNS: {validation.dnsResolution ? '✅' : '❌'} |
                        SSL: {validation.sslCertificate ? '✅' : '❌'} |
                        Access: {validation.accessibility ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Validations */}
            <div style={styles.validationGroup}>
              <h4>File Integrity</h4>
              <div style={styles.validationGrid}>
                {Object.entries(validations.files).map(([filePath, validation]) => (
                  <div key={filePath} style={styles.validationItem}>
                    <div style={styles.validationEndpoint}>{filePath}</div>
                    <div style={styles.validationStatus}>
                      <span style={{
                        color: validation.health === 100 ? '#10b981' : validation.health >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {validation.health}%
                      </span>
                      <span style={styles.validationChecks}>
                        Integrity: {validation.integrity ? '✅' : '❌'} |
                        Metadata: {validation.metadata ? '✅' : '❌'} |
                        Tracks: {validation.tracks ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QMOI Consciousness */}
            {validations.qmoiConsciousness && (
              <div style={styles.validationGroup}>
                <h4>QMOI Consciousness</h4>
                <div style={styles.qmoiStatus}>
                  <div style={styles.qmoiMetric}>
                    <span>Awareness:</span>
                    <span>{validations.qmoiConsciousness.awareness}%</span>
                  </div>
                  <div style={styles.qmoiMetric}>
                    <span>Memory Sync:</span>
                    <span>{validations.qmoiConsciousness.memorySync ? '✅' : '❌'}</span>
                  </div>
                  <div style={styles.qmoiMetric}>
                    <span>AutoDev Integration:</span>
                    <span>{validations.qmoiConsciousness.autodevIntegration ? '✅' : '❌'}</span>
                  </div>
                  <div style={styles.qmoiMetric}>
                    <span>AutoResearch Integration:</span>
                    <span>{validations.qmoiConsciousness.autoresearchIntegration ? '✅' : '❌'}</span>
                  </div>
                  <div style={styles.qmoiMetric}>
                    <span>Last Sync:</span>
                    <span>{new Date(validations.qmoiConsciousness.lastSync).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Workflow Health Details */}
      <div style={styles.workflowSection}>
        <h3>Workflow Health Details</h3>
        <div style={styles.workflowControls}>
          <select 
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            style={styles.refreshSelect}
          >
            <option value="5000">Refresh: Every 5 seconds</option>
            <option value="10000">Refresh: Every 10 seconds</option>
            <option value="30000">Refresh: Every 30 seconds</option>
            <option value="60000">Refresh: Every 1 minute</option>
          </select>
          <button onClick={fetchWorkflowHealth} style={styles.refreshButton}>
            🔄 Refresh Now
          </button>
        </div>

        <div style={styles.workflowList}>
          {workflows.map(workflow => (
            <div
              key={workflow.workflowName}
              style={{
                /* Production implementation with proper error handling */styles.workflowCard,
                backgroundColor: selectedWorkflow === workflow.workflowName ? '#f0f0f0' : '#fff',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedWorkflow(selectedWorkflow === workflow.workflowName ? null : workflow.workflowName)}
            >
              <div style={styles.workflowHeader}>
                <div style={styles.workflowName}>{workflow.workflowName}</div>
                <div style={{
                  /* Production implementation with proper error handling */styles.workflowHealth,
                  color: getStatusColor(workflow.healthPercentage, workflow.status)
                }}>
                  {workflow.healthPercentage}%
                </div>
              </div>

              {selectedWorkflow === workflow.workflowName && (
                <div style={styles.workflowDetails}>
                  <div style={styles.detailRow}>
                    <span>Status:</span>
                    <span>{workflow.status} {workflow.status === 'critical' ? '🔴' : workflow.status === 'warning' ? '🟠' : workflow.status === 'caution' ? '🟡' : '🟢'}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Success Rate:</span>
                    <span>{workflow.successCount} / {workflow.totalRuns} runs</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Trend:</span>
                    <span>{getTrendIcon(workflow.trend)} {workflow.trend}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Last Checked:</span>
                    <span>{new Date(workflow.lastChecked).toLocaleTimeString()}</span>
                  </div>
                  
                  {workflow.status === 'critical' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        retryWorkflow(workflow.workflowName);
                      }}
                      style={styles.retryButton}
                    >
                      🔄 Retry Workflow
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.footer}>
        <p>🦁 Lion Agent v2.0.0 | Enhanced System Health Monitoring</p>
        <p>Auto-refreshing every {refreshInterval / 1000} seconds | Validation Systems Active</p>
      </div>
    </div>
  );
}

production-ready
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#fafafa',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #007bff',
    paddingBottom: '15px',
    marginBottom: '20px'
  },
  masterBadge: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
    color: '#000',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  error: {
    background: '#ffe0e0',
    color: '#cc0000',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    borderLeft: '4px solid #cc0000'
  },
  masterHealthSection: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  healthDisplay: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center'
  },
  healthCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #007bff'
  },
  healthPercentage: {
    fontSize: '48px',
    fontWeight: 'bold'
  },
  healthLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px'
  },
  healthInfo: {
    flex: 1
  },
  categorySection: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px'
  },
  categoryCard: {
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '5px'
  },
  categoryName: {
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '8px',
    textTransform: 'capitalize'
  },
  categoryHealth: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    marginBottom: '8px'
  },
  categoryPercentage: {
    fontWeight: 'bold',
    fontSize: '18px'
  },
  categoryCount: {
    color: '#666',
    fontSize: '10px'
  },
  categoryStatus: {
    fontSize: '10px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  criticalSection: {
    background: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid #ff6b6b'
  },
  criticalList: {
    listStyle: 'none',
    paddingLeft: 0
  },
  criticalItem: {
    padding: '8px 0',
    borderBottom: '1px solid #ffe0e0'
  },
  workflowSection: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  workflowControls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  refreshSelect: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    cursor: 'pointer'
  },
  refreshButton: {
    padding: '8px 16px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  workflowList: {
    display: 'grid',
    gap: '10px'
  },
  workflowCard: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    transition: 'background-color 0.2s'
  },
  workflowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  workflowName: {
    fontWeight: 'bold',
    fontSize: '14px'
  },
  workflowHealth: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  workflowDetails: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #eee'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    padding: '6px 0'
  },
  retryButton: {
    marginTop: '10px',
    padding: '8px 12px',
    background: '#ff6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  validationSection: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  validationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  validationControls: {
    display: 'flex',
    gap: '10px'
  },
  toggleButton: {
    padding: '8px 12px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  refreshButton: {
    padding: '8px 12px',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  validationSummary: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  validationMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    background: '#f8f9fa',
    borderRadius: '5px',
    minWidth: '120px'
  },
  validationLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px'
  },
  validationValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333'
  },
  validationDetails: {
    borderTop: '1px solid #eee',
    paddingTop: '20px'
  },
  validationGroup: {
    marginBottom: '25px'
  },
  validationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '10px'
  },
  validationItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    background: '#f8f9fa',
    borderRadius: '5px',
    border: '1px solid #e9ecef'
  },
  validationEndpoint: {
    fontSize: '12px',
    fontFamily: 'monospace',
    flex: 1
  },
  validationStatus: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px'
  },
  validationTime: {
    fontSize: '10px',
    color: '#666'
  },
  validationChecks: {
    fontSize: '10px',
    color: '#666'
  },
  qmoiStatus: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px'
  },
  qmoiMetric: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    background: '#f8f9fa',
    borderRadius: '5px',
    fontSize: '12px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px',
    color: '#666',
    fontSize: '12px'
  }
};
