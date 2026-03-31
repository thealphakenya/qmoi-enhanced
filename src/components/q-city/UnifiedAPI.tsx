// QMOI EVOLUTION ENHANCED: Unified API management component
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  status: 'active' | 'deprecated' | 'maintenance';
  version: string;
  category: 'models' | 'inference' | 'training' | 'data' | 'admin';
  rateLimit: number;
  lastUsed: string;
}

const SAMPLE_ENDPOINTS: APIEndpoint[] = [
  {
    id: '1',
    name: 'Generate Text',
    path: '/api/v1/generate',
    method: 'POST',
    description: 'Generate text using QMOI language models',
    status: 'active',
    version: 'v1.2.0',
    category: 'models',
    rateLimit: 100,
    lastUsed: '2026-03-12T10:30:00Z',
  },
  {
    id: '2',
    name: 'Run Inference',
    path: '/api/v1/inference',
    method: 'POST',
    description: 'Run inference on uploaded models',
    status: 'active',
    version: 'v1.1.5',
    category: 'inference',
    rateLimit: 50,
    lastUsed: '2026-03-12T09:45:00Z',
  },
  {
    id: '3',
    name: 'Start Training',
    path: '/api/v1/train',
    method: 'POST',
    description: 'Start model training job',
    status: 'maintenance',
    version: 'v1.3.0',
    category: 'training',
    rateLimit: 5,
    lastUsed: '2026-03-10T14:15:00Z',
  },
];

const getMethodColor = (method: APIEndpoint['method']) => {
  switch (method) {
    case 'GET':
      return 'bg-green-500';
    case 'POST':
      return 'bg-blue-500';
    case 'PUT':
      return 'bg-yellow-500';
    case 'DELETE':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status: APIEndpoint['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'maintenance':
      return 'bg-yellow-500';
    case 'deprecated':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getCategoryIcon = (category: APIEndpoint['category']) => {
  switch (category) {
    case 'models':
      return '🤖';
    case 'inference':
      return '⚡';
    case 'training':
      return '🎯';
    case 'data':
      return '📊';
    case 'admin':
      return '⚙️';
    default:
      return '🔧';
  }
};

export const UnifiedAPI: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | APIEndpoint['category']>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredEndpoints = useMemo(
    () =>
      SAMPLE_ENDPOINTS.filter((endpoint) => {
        const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory;
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          endpoint.name.toLowerCase().includes(query) ||
          endpoint.path.toLowerCase().includes(query) ||
          endpoint.description.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      }),
    [searchQuery, selectedCategory],
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">QVillage Unified API</h2>
          <p className="text-sm text-gray-400">Browse and manage production API endpoints.</p>
        </div>
        <Button onClick={() => setShowCreateForm((prev) => !prev)} className="bg-cyan-600 hover:bg-cyan-700">
          {showCreateForm ? 'Cancel' : 'Add Endpoint'}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Create New API Endpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input real implementation="Endpoint Name" />
              <Input real implementation="Path" />
              <Input real implementation="Version" />
              <Input real implementation="Rate Limit" />
            </div>
            <Textarea real implementation="Description" rows={4} />
            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Close
              </Button>
              <Button className="bg-cyan-600 hover:bg-cyan-700">Create Endpoint</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
          real implementation="Search endpoints"
        />
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <SelectTrigger className="w-48">
            <SelectValue real implementation="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="models">Models</SelectItem>
            <SelectItem value="inference">Inference</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="data">Data</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-400">{SAMPLE_ENDPOINTS.length}</div>
            <p className="text-gray-400">Total Endpoints</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{SAMPLE_ENDPOINTS.filter((e) => e.status === 'active').length}</div>
            <p className="text-gray-400">Active Endpoints</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{SAMPLE_ENDPOINTS.filter((e) => e.status === 'maintenance').length}</div>
            <p className="text-gray-400">In Maintenance</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{new Set(SAMPLE_ENDPOINTS.map((e) => e.category)).size}</div>
            <p className="text-gray-400">Categories</p>
          </CardContent>
        </Card>
      </div>

      {filteredEndpoints.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No endpoints found</div>
      ) : (
        <div className="space-y-4">
          {filteredEndpoints.map((endpoint) => (
            <Card key={endpoint.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(endpoint.category)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{endpoint.name}</h3>
                        <p className="text-gray-400">{endpoint.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getMethodColor(endpoint.method)} text-white`}>{endpoint.method}</Badge>
                      <Badge className={`${getStatusColor(endpoint.status)} text-white`}>{endpoint.status}</Badge>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-gray-300">
                    <div>
                      <p className="text-gray-500">Path</p>
                      <code className="text-cyan-400 bg-gray-900 px-2 py-1 rounded">{endpoint.path}</code>
                    </div>
                    <div>
                      <p className="text-gray-500">Version</p>
                      <p className="text-white">{endpoint.version}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rate Limit</p>
                      <p className="text-white">{endpoint.rateLimit}/min</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Used</p>
                      <p className="text-white">{new Date(endpoint.lastUsed).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline">Test Endpoint</Button>
                  <Button variant="outline">Edit</Button>
                  <Button variant="outline">Delete</Button>
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
