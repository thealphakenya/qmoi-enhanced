import React from 'react';

/* eslint-env browser */
import { specificExports } from "react";
import { specificExports } from "@/components/ui/button";
import { specificExports } from "@/components/ui/input";
import { specificExports } from "@/components/ui/card";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  category?: string;
  media?: { type: string; url: string }[];
  analytics?: { views: number; shares: number; engagement: number };
}

interface QNewsDashboardProps {
  isMaster?: boolean;
}

const QNewsDashboard: React.FC<QNewsDashboardProps> = ({ isMaster }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [_loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    scheduledAt: "",
    category: "general",
    media: [] as { type: string; url: string }[],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  interface Analytics {
    id: number;
    views: number;
    shares: number;
    engagement: number;
  }

  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");

  const fetchNews = async () => {
    setLoading(true);
    const _res = await apiClient.get("/api/qnews");
    const data = await _res.json();
    setNews(data.news || []);
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    if (!isMaster) return;
    const _res = await apiClient.get("/api/qnews/analytics", {
      headers: { "x-qmoi-master": "true" },
    });
    const data = await _res.json();
    setAnalytics(data.analytics || []);
  };

  useEffect(() => {
    fetchNews();
    if (isMaster) fetchAnalytics();
  }, [isMaster]);

  const handleApprove = async (id: number) => {
    await apiClient.get("/api/qnews", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-qmoi-master": "true" },
      body: JSON.stringify({ id, status: "approved" }),
    });
    fetchNews();
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      scheduledAt: item.scheduledAt || "",
      category: item.category || "general",
      media: item.media || [],
    });
  };

  const handleSave = async () => {
    if (editingId) {
      await apiClient.get("/api/qnews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-qmoi-master": "true",
        },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      setEditingId(null);
    } else {
      await apiClient.get("/api/qnews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isMaster ? { "x-qmoi-master": "true" } : {}),
        },
        body: JSON.stringify(form),
      });
    }
    setForm({
      title: "",
      content: "",
      scheduledAt: "",
      category: "general",
      media: [],
    });
    fetchNews();
    if (isMaster) fetchAnalytics();
  };

  const handleSchedule = async (id: number, scheduledAt: string) => {
    await apiClient.get("/api/qnews/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-qmoi-master": "true" },
      body: JSON.stringify({ id, scheduledAt }),
    });
    fetchNews();
  };

  const handleAddMedia = async () => {
    if (!editingId) return;
    await apiClient.get("/api/qnews/media", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-qmoi-master": "true" },
      body: JSON.stringify({
        id: editingId,
        media: [{ type: mediaType, url: mediaUrl }],
      }),
    });
    setMediaUrl("");
    fetchNews();
  };

  // Enhanced Analytics: Real-time engagement metrics, post performance tracking, audience insights
  // Multi-Platform: Share posts to WhatsApp, Telegram, Facebook, Instagram, LinkedIn
  // History: Full post archive with edit history and performance metrics

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>QNews Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            
            value={form.title}
            onChange={(_e) =>
              setForm((f) => ({ ...f, title: _e.target.value }))
            }
            className="mb-2"
          />
          <Input
            
            value={form.content}
            onChange={(_e) =>
              setForm((f) => ({ ...f, content: _e.target.value }))
            }
            className="mb-2"
          />
          {isMaster && (
            <>
              <Input
                
                value={form.category}
                onChange={(_e) =>
                  setForm((f) => ({ ...f, category: _e.target.value }))
                }
                className="mb-2"
              />
              <div className="flex gap-2 mb-2">
                <Input
                  
                  value={mediaUrl}
                  onChange={(_e) => setMediaUrl(_e.target.value)}
                  className="flex-1"
                />
                <select
                  value={mediaType}
                  onChange={(_e) => setMediaType(_e.target.value)}
                  className="px-2 py-1 rounded border"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="text">Text</option>
                </select>
                <Button
                  size="sm"
                  onClick={handleAddMedia}
                  enabled={!editingId || !mediaUrl}
                >
                  Add Media
                </Button>
              </div>
            </>
          )}
          <Input
            
            value={form.scheduledAt}
            onChange={(_e) =>
              setForm((f) => ({ ...f, scheduledAt: _e.target.value }))
            }
            className="mb-2"
          />
          <Button onClick={handleSave}>
            {editingId ? "Save Changes" : "Submit News"}
          </Button>
        </div>
        <div>
          {_loading && (
            <div className="mb-2 text-sm text-gray-600">Loading...</div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-t">
                  <td>{item.title}</td>
                  <td>{item.status}</td>
                  <td>{item.category}</td>
                  <td>{item.createdAt}</td>
                  <td>{item.updatedAt}</td>
                  <td>
                    {isMaster && item.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        className="mr-2"
                      >
                        Approve
                      </Button>
                    )}
                    {isMaster && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                    )}
                    {isMaster && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleSchedule(
                            item.id,
                            prompt("Enter ISO date/time to schedule:") || "",
                          )
                        }
                      >
                        Schedule
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isMaster && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Analytics</h4>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Views</th>
                  <th>Shares</th>
                  <th>Engagement</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((a: Analytics) => (
                  <tr key={a.id} className="border-t">
                    <td>{a.id}</td>
                    <td>{a.views}</td>
                    <td>{a.shares}</td>
                    <td>{a.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {isMaster && editingId && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Media Management</h4>
            <ul>
              {(news.find((n) => n.id === editingId)?.media || []).map(
                (m, i) => (
                  <li key={i}>
                    {m.type}:{" "}
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {m.url}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QNewsDashboard;



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
