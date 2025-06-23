import React, { useState, useEffect, useCallback } from 'react';
import { useTimezone } from '../../hooks/useTimezone';
import { useToast } from '../../../hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  size?: number;
  path: string;
  lastModified: string;
  isSelected: boolean;
  tags: string[];
  category: 'project' | 'document' | 'media' | 'code' | 'data' | 'other';
}

interface QFileManagerProps {
  isMaster?: boolean;
}

interface WalletRequest {
  email: string;
  username: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'denied';
}

export const QFileManager: React.FC<QFileManagerProps> = ({ isMaster = false }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const { getCurrentTime, currentTimezone } = useTimezone();
  const [walletRequested, setWalletRequested] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<WalletRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch pending requests for master
  useEffect(() => {
    if (isMaster) {
      fetchPendingRequests();
    }
  }, [isMaster]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wallet?pending_wallets=1', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' }
      });
      if (!res.ok) throw new Error('Failed to fetch pending requests');
      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      setError('Failed to load pending requests');
      toast({
        title: 'Error',
        description: 'Failed to load pending wallet requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulate file data
  useEffect(() => {
    const mockFiles: FileItem[] = [
      {
        id: '1',
        name: 'Qmoi AI Core',
        type: 'folder',
        path: '/src/core',
        lastModified: new Date().toISOString(),
        isSelected: false,
        tags: ['ai', 'core', 'qmoi'],
        category: 'code'
      },
      {
        id: '2',
        name: 'Auto Projects',
        type: 'folder',
        path: '/projects',
        lastModified: new Date().toISOString(),
        isSelected: false,
        tags: ['projects', 'auto', 'generated'],
        category: 'project'
      },
      {
        id: '3',
        name: 'WhatsApp Integration',
        type: 'file',
        extension: '.ts',
        size: 2048,
        path: '/src/services/whatsapp.ts',
        lastModified: new Date().toISOString(),
        isSelected: false,
        tags: ['whatsapp', 'integration', 'api'],
        category: 'code'
      },
      {
        id: '4',
        name: 'Master Dashboard',
        type: 'file',
        extension: '.tsx',
        size: 4096,
        path: '/src/components/MasterDashboard.tsx',
        lastModified: new Date().toISOString(),
        isSelected: false,
        tags: ['dashboard', 'master', 'ui'],
        category: 'code'
      },
      {
        id: '5',
        name: 'Project Documentation',
        type: 'file',
        extension: '.md',
        size: 1024,
        path: '/docs/projects.md',
        lastModified: new Date().toISOString(),
        isSelected: false,
        tags: ['documentation', 'projects'],
        category: 'document'
      }
    ];

    setFiles(mockFiles);
  }, []);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
        break;
      case 'size':
        comparison = (a.size || 0) - (b.size || 0);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleFileSelect = useCallback((id: string) => {
    setFiles(prev => prev.map(file => ({
      ...file,
      isSelected: file.id === id ? !file.isSelected : file.isSelected
    })));
  }, []);

  const handleBulkSelect = useCallback(() => {
    setFiles(prev => prev.map(file => ({ ...file, isSelected: true })));
  }, []);

  const handleBulkDeselect = useCallback(() => {
    setFiles(prev => prev.map(file => ({ ...file, isSelected: false })));
  }, []);

  const handleDelete = useCallback(async () => {
    const selectedFiles = files.filter(file => file.isSelected);
    if (selectedFiles.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedFiles.length} item(s)?`)) {
      setIsLoading(true);
      try {
        // Simulate deletion
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFiles(prev => prev.filter(file => !file.isSelected));
      } catch (error) {
        console.error('Error deleting files:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [files]);

  const handleOrganize = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate AI organization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // AI would organize files by type, date, or other criteria
      setFiles(prev => prev.map(file => ({
        ...file,
        tags: [...file.tags, 'organized']
      })));
    } catch (error) {
      console.error('Error organizing files:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return '📁';
    
    switch (file.extension) {
      case '.ts':
      case '.tsx':
      case '.js':
      case '.jsx':
        return '📄';
      case '.md':
        return '📝';
      case '.json':
        return '⚙️';
      case '.py':
        return '🐍';
      case '.css':
      case '.scss':
        return '🎨';
      default:
        return '📄';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const categories = [
    { value: 'all', label: 'All Files', emoji: '📁' },
    { value: 'project', label: 'Projects', emoji: '🚀' },
    { value: 'code', label: 'Code', emoji: '💻' },
    { value: 'document', label: 'Documents', emoji: '📝' },
    { value: 'media', label: 'Media', emoji: '🎬' },
    { value: 'data', label: 'Data', emoji: '📊' },
    { value: 'other', label: 'Other', emoji: '📄' }
  ];

  const handleRequestWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const email = localStorage.getItem('userEmail');
      const username = localStorage.getItem('username');
      
      if (!email || !username) {
        throw new Error('Please complete your profile first');
      }

      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
        body: JSON.stringify({
          action: 'request_wallet',
          email,
          username,
        }),
      });

      const data = await res.json();
      
      if (data.status === 'pending') {
        setWalletRequested(true);
        toast({
          title: 'Success',
          description: 'Wallet request sent to master for approval',
        });
      } else {
        throw new Error(data.error || 'Failed to request wallet');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWallet = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': localStorage.getItem('adminToken') || '',
          'x-master-token': localStorage.getItem('masterToken') || '',
        },
        body: JSON.stringify({
          action: 'approve_wallet',
          email,
        }),
      });

      const data = await res.json();
      
      if (data.status === 'approved') {
        setPendingRequests(prev => prev.filter(r => r.email !== email));
        toast({
          title: 'Success',
          description: `Wallet approved for ${email}`,
        });
      } else {
        throw new Error(data.error || 'Failed to approve wallet');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🤖 AI File Manager</h2>
          <p className="text-gray-600">Intelligent file organization and management</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {getCurrentTime()} {currentTimezone.emoji}
          </div>
          <div className="text-xs text-gray-400">
            {files.length} items • {files.filter(f => f.isSelected).length} selected
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="🔍 Search files, folders, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">📝 Name</option>
          <option value="date">📅 Date</option>
          <option value="size">📏 Size</option>
          <option value="type">📁 Type</option>
        </select>

        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {sortOrder === 'asc' ? '⬆️' : '⬇️'}
        </button>

        <button
          onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {viewMode === 'grid' ? '📋' : '🔲'}
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={handleBulkSelect}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          ☑️ Select All
        </button>
        <button
          onClick={handleBulkDeselect}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ☐ Deselect All
        </button>
        <button
          onClick={handleDelete}
          disabled={files.filter(f => f.isSelected).length === 0}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🗑️ Delete Selected
        </button>
        <button
          onClick={handleOrganize}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? '🔄 Organizing...' : '🤖 AI Organize'}
        </button>
      </div>

      {/* File Grid/List */}
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {sortedFiles.map(file => (
          <div
            key={file.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              file.isSelected 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleFileSelect(file.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFileIcon(file)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {file.type === 'file' && file.extension && (
                      <span className="mr-2">{file.extension}</span>
                    )}
                    {file.type === 'file' && file.size && (
                      <span className="mr-2">{formatFileSize(file.size)}</span>
                    )}
                    <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {file.isSelected && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
            
            {/* Tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              {file.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {file.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{file.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding some files'}
          </p>
        </div>
      )}

      {/* Master-only features */}
      {isMaster && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">👑</span>
            <span className="font-medium text-yellow-800">Master Controls</span>
          </div>
          <div className="text-sm text-yellow-700">
            Advanced file operations, AI organization, and system-wide file management available.
          </div>
        </div>
      )}

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div className="text-gray-500 mb-2">Loading...</div>}
      {!isMaster && (
        <div className="mt-4">
          <Button
            onClick={handleRequestWallet}
            disabled={loading || walletRequested}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : walletRequested ? (
              'Wallet Request Pending Approval'
            ) : (
              'Request Wallet'
            )}
          </Button>
        </div>
      )}
      {isMaster && (
        <div className="mt-4">
          <h4 className="font-bold mb-2">Pending Wallet Requests</h4>
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {!loading && pendingRequests.length === 0 && <div>No pending requests.</div>}
          {pendingRequests.map(req => (
            <Card key={req.email} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{req.username}</p>
                  <p className="text-sm text-gray-500">{req.email}</p>
                  <p className="text-xs text-gray-400">
                    Requested: {new Date(req.requestedAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleApproveWallet(req.email)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Approve'
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 