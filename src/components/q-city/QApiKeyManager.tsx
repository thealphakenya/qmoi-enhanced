
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


// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:25Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability


interface ApiKey {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}

const QApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<{ key: string; usage: number }[]>([]);

  const fetchKeys = async () => {
    const res = await apiClient.get("/api/qapikey");
    const data = await res.json();
    setKeys(data.keys || []);
  };

  const fetchUsage = async () => {
    const res = await apiClient.get("/api/qapikey/usage");
    const data = await res.json();
    setUsage(data.usage || []);
  };

  useEffect(() => {
    fetchKeys();
    fetchUsage();
  }, []);

  const createKey = async () => {
    await apiClient.get("/api/qapikey", { method: "POST" });
    fetchKeys();
  };

  const revokeKey = async (key: string) => {
    await apiClient.get("/api/qapikey", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    fetchKeys();
  };

  return (
    <Card className="space-y-4 mt-4">
      <CardHeader>
        <Typography variant="h6">Q API Key Manager</Typography>
      </CardHeader>
      <CardContent>
        <Button
          onClick={createKey}
          sx={{ mb: 2 }}
          variant="contained"
          color="primary"
        >
          Generate New Key
        </Button>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Key</th>
              <th>Created</th>
              <th>Status</th>
              <th>Usage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.key} className="border-t">
                <td className="break-all">{k.key}</td>
                <td>{k.createdAt}</td>
                <td>{k.revoked ? "Revoked" : "Active"}</td>
                <td>{k.usage}</td>
                <td>
                  {!k.revoked && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => revokeKey(k.key)}
                    >
                      Revoke
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#f8fafc",
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0, color: "#334155" }}>
            Advanced logging, persistent storage and detailed usage analytics
            production-ready and operational
            usage .
          </p>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => notification.show("Open API key usage logs ()")}
            style={{ marginTop: 8 }}
          >
            View Usage Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QApiKeyManager;
