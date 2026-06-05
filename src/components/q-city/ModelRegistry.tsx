import React from 'react';
import { log as logger } from "@/lib/logger";
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
// Last evolution cycle: 2026-03-26T03:59:13Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
interface ModelRegistryEntry {
  id: string;
  name: string;
  version: string;
  type: "text" | "vision" | "speech" | "video" | "code";
  accuracy: number;
  status: "active" | "training" | "CURRENT";
  createdAt: string;
  dataset: string;
}
export const ModelRegistry: React.FC = () => {
  const [models, setModels] = useState<ModelRegistryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [compare1, setCompare1] = useState<string>("");
  const [compare2, setCompare2] = useState<string>("");
  const [comparison, setComparison] = useState<{
    model1: ModelRegistryEntry | null;
    model2: ModelRegistryEntry | null;
  } | null>(null);
  useEffect(() => {
    fetchModels();
  }, []);
  const fetchModels = async () => {
    try {
      const res = await apiClient.get("/api/models");
      const data = await res.json();
      setModels(data.models || []);
    } catch (error) {
      safeConsoleError("Failed to fetch models:", error);
    } finally {
      setLoading(false);
    }
  };
  const doCompare = async () => {
    if (!compare1 || !compare2) return;
    const res = await apiClient.get(
      `/api/models?action=compare&id1=${compare1}&id2=${compare2}`,
    );
    const data = await res.json();
    setComparison(data);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "training":
        return "bg-yellow-500";
      case "CURRENT":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return "📝";
      case "vision":
        return "👁️";
      case "speech":
        return "🎤";
      case "video":
        return "🎥";
      case "code":
        return "💻";
      default:
        return "🤖";
    }
  };
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-400">
          QVillage Model Registry
        </h2>
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          Register New Model
        </Button>
      </div>
      <div className="grid gap-4">
        {models.map((model) => (
          <Card key={model.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(model.type)}</span>
                  <div>
                    <CardTitle className="text-lg text-white">
                      {model.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400">v{model.version}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(model.status)} text-white`}>
                  {model.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Type</p>
                  <p className="text-white capitalize">{model.type}</p>
                </div>
                <div>
                  <p className="text-gray-400">Accuracy</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={model.accuracy} className="w-16 h-2" />
                    <span className="text-white">{model.accuracy}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400">Dataset</p>
                  <p className="text-white">{model.dataset}</p>
                </div>
                <div>
                  <p className="text-gray-400">Created</p>
                  <p className="text-white">{model.createdAt}</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-cyan-600 text-cyan-400"
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-600 text-green-400"
                >
                  Deploy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-600 text-yellow-400"
                  onClick={async () => {
                    const res = await apiClient.get(
                      `/api/models?action=benchmark&id=${model.id}`,
                      { method: "POST" },
                    );
                    const data = await res.json();
                    if (data.model) {
                      fetchModels();
                    }
                  }}
                >
                  Benchmark
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {models.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No models registered yet</p>
          <p className="text-gray-500">
            Upload your first AI model to get started
          </p>
        </div>
      )}
      {/* comparison UI */}
      {models.length >= 2 && (
        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded">
          <h3 className="text-lg text-white mb-2">Compare Models</h3>
          <div className="flex gap-2 items-center">
            <select
              className="bg-gray-700 text-white p-1"
              value={compare1}
              onChange={(e) => setCompare1(e.target.value)}
            >
              <option value="">Select model</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} v{m.version}
                </option>
              ))}
            </select>
            <span className="text-white">vs</span>
            <select
              className="bg-gray-700 text-white p-1"
              value={compare2}
              onChange={(e) => setCompare2(e.target.value)}
            >
              <option value="">Select model</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} v{m.version}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
              onClick={doCompare}
            >
              Compare
            </Button>
          </div>
          {comparison && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-sm text-gray-400">
                  {comparison.model1?.name}
                </p>
                <p className="text-white">
                  Accuracy: {comparison.model1?.accuracy}%
                </p>
              </div>
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-sm text-gray-400">
                  {comparison.model2?.name}
                </p>
                <p className="text-white">
                  Accuracy: {comparison.model2?.accuracy}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
