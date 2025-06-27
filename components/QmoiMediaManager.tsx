"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Download, 
  Play, 
  Film, 
  Tv, 
  BookOpen, 
  Zap,
  Clock,
  HardDrive,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Music,
  Video,
  Image
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: string;
  url: string;
  createdAt: string;
  tags: string[];
}

interface MediaLog {
  id: number;
  action: string;
  media_id: string;
  details: string;
  user_id?: string;
  timestamp: number;
}

interface MediaManagerProps {
  className?: string;
}

const QmoiMediaManager: React.FC<MediaManagerProps> = ({ className }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [logs, setLogs] = useState<MediaLog[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockMedia: MediaItem[] = [
      {
        id: '1',
        name: 'presentation.pdf',
        type: 'document',
        size: '2.5 MB',
        url: '/media/presentation.pdf',
        createdAt: '2024-01-15',
        tags: ['work', 'presentation']
      },
      {
        id: '2',
        name: 'vacation_photo.jpg',
        type: 'image',
        size: '1.2 MB',
        url: '/media/vacation_photo.jpg',
        createdAt: '2024-01-10',
        tags: ['personal', 'vacation']
      },
      {
        id: '3',
        name: 'meeting_recording.mp3',
        type: 'audio',
        size: '15.7 MB',
        url: '/media/meeting_recording.mp3',
        createdAt: '2024-01-12',
        tags: ['work', 'meeting']
      },
      {
        id: '4',
        name: 'tutorial_video.mp4',
        type: 'video',
        size: '45.2 MB',
        url: '/media/tutorial_video.mp4',
        createdAt: '2024-01-08',
        tags: ['tutorial', 'learning']
      }
    ];
    setMediaItems(mockMedia);
  }, []);

  const searchMedia = async (query: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, this would be an API call
      // Using URLSearchParams with proper type checking
      const searchParams = new (globalThis.URLSearchParams || URLSearchParams)();
      searchParams.append('q', query);
      searchParams.append('type', selectedType);
      
      // Mock response filtering
      const filtered = mediaItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      setMediaItems(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMedia = async (item: MediaItem) => {
    setDownloadProgress(prev => ({ ...prev, [item.id]: 0 }));
    
    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setDownloadProgress(prev => ({ ...prev, [item.id]: i }));
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloaded: ${item.name}`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadProgress(prev => ({ ...prev, [item.id]: 0 }));
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/qmoi-database?logs=true&limit=50', {
        headers: {
          'x-qmoi-master': 'true'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Media Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
            </select>
            <Button 
              onClick={() => searchMedia(searchQuery)}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Media List */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getMediaIcon(item.type)}
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{item.size}</span>
                          <span>•</span>
                          <span>{item.createdAt}</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => downloadMedia(item)}
                        disabled={downloadProgress[item.id] > 0}
                      >
                        <Download className="w-4 h-4" />
                        {downloadProgress[item.id] > 0 ? `${downloadProgress[item.id]}%` : 'Download'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {filteredMedia.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No media files found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QmoiMediaManager; 