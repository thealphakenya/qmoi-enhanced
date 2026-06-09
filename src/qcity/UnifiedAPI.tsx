"use client";
import React, { useEffect, useMemo, useState } from "react";
import apiClient from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { log as logger } from "@/lib/logger";
const logger = {
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  status: "active" | "maintenance" | "deprecated";
  version: string;
  category: "models" | "inference" | "training" | "data" | "admin";
  rateLimit: number;
  lastUsed: string;
}
const SAMPLE_ENDPOINTS: APIEndpoint[] = [
  {
    id: "1",
    name: "Generate Text",
    path: "/api/v1/generate",
    method: "POST",
    description: "Generate text using QMOI language models",
    status: "active",
    version: "v1.2.0",
    category: "models",
    rateLimit: 100,
    lastUsed: "2026-03-12T10:30:00Z",
  },
];
const getMethodColor = (method: APIEndpoint["method"]) => {
  switch (method) {
    case "GET":
      return "bg-green-500";
    case "POST":
      return "bg-blue-500";
    case "PUT":
      return "bg-yellow-500";
    case "DELETE":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
const getStatusColor = (status: APIEndpoint["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "maintenance":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};
const getCategoryIcon = (category: APIEndpoint["category"]) => {
  switch (category) {
    case "models":
      return "🤖";
    case "inference":
      return "⚡";
    case "training":
      return "🎯";
    case "data":
      return "📊";
    case "admin":
      return "⚙️";
    default:
      return "🔧";
  }
};
const UnifiedAPI: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<APIEndpoint["category"] | "all">("all");
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadEndpoints = async () => {
      try {
        setLoading(true);
        const data = await apiClient.json<APIEndpoint[]>("/api/endpoints");
        setEndpoints(Array.isArray(data) ? data : []);
      } catch (err) {
        logger.error("Failed to load endpoints", err);
        setError("Unable to load API endpoints");
        if (process.env.NODE_ENV !== "production") {
          setEndpoints(SAMPLE_ENDPOINTS);
        }
      } finally {
        setLoading(false);
      }
    };
    void loadEndpoints();
  }, []);
  const filteredEndpoints = useMemo(
    () =>
      endpoints.filter((endpoint) => {
        const matchesCategory = selectedCategory === "all" || endpoint.category === selectedCategory;
        const query = searchQuery.toLowerCase();
        return (
          matchesCategory &&
          (endpoint.name.toLowerCase().includes(query) ||
            endpoint.path.toLowerCase().includes(query) ||
            endpoint.description.toLowerCase().includes(query))
        );
      }),
    [endpoints, searchQuery, selectedCategory],
  );
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">QVillage Unified API</h2>
          <p className="text-sm text-gray-400">Production API endpoint management and status overview.</p>
        </div>
        <Button variant="secondary" onClick={() => setSelectedCategory("all")}>Reset Filters</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">Total Endpoints</div>
            <div className="mt-2 text-3xl font-bold">{endpoints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">Active</div>
            <div className="mt-2 text-3xl font-bold">{endpoints.filter((e) => e.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">Maintenance</div>
            <div className="mt-2 text-3xl font-bold">{endpoints.filter((e) => e.status === "maintenance").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">Categories</div>
            <div className="mt-2 text-3xl font-bold">{new Set(endpoints.map((e) => e.category)).size}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search endpoints..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as APIEndpoint["category"] | "all")}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white"
          >
            <option value="all">All Categories</option>
            <option value="models">Models</option>
            <option value="inference">Inference</option>
            <option value="training">Training</option>
            <option value="data">Data</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      {loading && <div className="text-gray-400">Loading endpoints...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {filteredEndpoints.length === 0 && !loading ? (
        <div className="rounded-xl border border-slate-700 bg-slate-950 p-8 text-center text-slate-400">
          No API endpoints matched your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEndpoints.map((endpoint) => (
            <Card key={endpoint.id} className="border-slate-700 bg-slate-950">
              <CardHeader>
                <CardTitle>{endpoint.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={`${getMethodColor(endpoint.method)} text-white`}>{endpoint.method}</Badge>
                  <Badge className={`${getStatusColor(endpoint.status)} text-white`}>{endpoint.status}</Badge>
                  <span className="text-sm text-slate-400">{endpoint.version}</span>
                </div>
                <p className="text-sm text-slate-300">{endpoint.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span>{getCategoryIcon(endpoint.category)} {endpoint.category}</span>
                  <span>{endpoint.path}</span>
                  <span>Rate limit: {endpoint.rateLimit}/min</span>
                  <span>Last used: {new Date(endpoint.lastUsed).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default UnifiedAPI;
