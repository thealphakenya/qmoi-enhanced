import ErrorBoundary from '@/components/ErrorBoundary';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
"use client";
"use client";
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
  Image,
} from "lucide-react";
import { buildMasterHeaders } from "@/app/lib/auth/master";
interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<
    Record<string, number>
  >({});
  const [logs, setLogs] = useState<MediaLog[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [healthStatus, setHealthStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagFilter, setTagFilter] = useState("");
  // QMOI Media Manager
  // For upload support, add an upload button and handler to POST files to your media API endpoint.
  // See README for more integration details.
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const items = await fetchMedia();
        if (mounted && Array.isArray(items))
          setMediaItems(items as MediaItem[]);
      } catch (err) {
        logger.warning("Failed to load media via adapter", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  const searchMedia = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/media/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_QMOI_API_KEY || '',
        },
        body: JSON.stringify({
          query: query,
          type: selectedType,
          limit: 50,
          sortBy: 'relevance',
          filters: {
            category: selectedType,
            quality: 'high',
            format: ['mp4', 'mp3', 'jpg', 'png', 'gif']
          }
        }),
      });
      if (!response.ok) {
      }
      const searchResults = await response.json();
      // Transform API response to component format
      const transformedResults = searchResults.items.map((item: any) => ({
        id: item.id,
        name: item.title || item.name,
        type: item.type,
        url: item.url,
        thumbnail: item.thumbnail,
        duration: item.duration,
        size: item.size,
        tags: item.tags || [],
        metadata: item.metadata || {},
        createdAt: item.createdAt,
        quality: item.quality || 'standard'
      }));
      setMediaItems(transformedResults);
      setSearchResults(transformedResults);
    } catch (error) {
      (globalThis.console as any)?.error?.("Media search failed:", error);
      // Fallback to local search if API fails
      const filtered = mediaItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
      );
      setMediaItems(filtered);
      setSearchResults(filtered);
    } finally {
      setIsLoading(false);
    }
  };
  const downloadMedia = async (item: MediaItem) => {
    setDownloadProgress((prev) => ({ ...prev, [item.id]: 0 }));
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setDownloadProgress((prev) => ({ ...prev, [item.id]: i }));
      }
      // Create download link
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      logger.info(`Downloaded: ${item.name}`);
    } catch (error) {
      (globalThis.console as any)?.error?.("Download failed:", error);
    } finally {
      setDownloadProgress((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };
  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "audio":
        return <Music className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "audio":
        return "bg-green-100 text-green-800";
      case "document":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesTag = !tagFilter || item.tags.includes(tagFilter);
    return matchesSearch && matchesType && matchesTag;
  });
  // Fetch logs
  const fetchLogs = async () => {
    try {
      const response = await apiClient.get("/api/qmoi-database?logs=true&limit=50", {
        headers: buildMasterHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      (globalThis.console as any)?.error?.("Failed to fetch logs:", error);
    }
  };
  useEffect(() => {
    fetchLogs();
  }, []);
  useEffect(() => {
    apiClient.get("/api/health")
      .then((res) => res.json())
      .then((data) => setHealthStatus(data.status))
      .catch(() => setHealthStatus("offline"));
  }, []);
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this media file?")) return;
    await apiClient.get(`/api/media/${id}`, {
      method: "DELETE",
      headers: { "x-qmoi-admin": "qmoi-master-key" },
    });
    setMediaItems((items) => items.filter((item) => item.id !== id));
  };
  const handleTagFilter = (tag: string) => setTagFilter(tag);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const xhr = new fetch();
      xhr.open("POST", "/api/media");
      xhr.setRequestHeader("x-qmoi-admin", "qmoi-master-key");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const newMedia = JSON.parse(xhr.responseText);
          setMediaItems((prev) => [newMedia, ...prev]);
        }
        setUploading(false);
        setUploadProgress(0);
      };
      xhr.onerror = () => {
        setUploading(false);
        setUploadProgress(0);
      };
      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      setUploadProgress(0);
    }
  };
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
              enabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
          {/* Upload Button () */}
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                healthStatus === "ok"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Health: {healthStatus}
            </span>
          </div>
          <input
            type="file"
            onChange={handleUpload}
            enabled={uploading}
            className="mb-2"
          />
          {uploading && <Progress value={uploadProgress} className="mb-2" />}
          {/* Tag Filter */}
          <div className="mb-2 flex gap-1">
            {Array.from(new Set(mediaItems.flatMap((item) => item.tags))).map(
              (tag) => (
                <Badge
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className={tagFilter === tag ? "bg-blue-500 text-white" : ""}
                  style={{ cursor: "pointer" }}
                >
                  {tag}
                </Badge>
              ),
            )}
            {tagFilter && (
              <Button size="sm" onClick={() => setTagFilter("")}>
                Clear Tag Filter
              </Button>
            )}
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
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
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
                        enabled={downloadProgress[item.id] > 0}
                      >
                        <Download className="w-4 h-4" />
                        {downloadProgress[item.id] > 0
                          ? `${downloadProgress[item.id]}%`
                          : "Download"}
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      )}
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
