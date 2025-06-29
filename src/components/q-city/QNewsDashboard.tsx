import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', scheduledAt: '', category: 'general', media: [] as { type: string; url: string }[] });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');

  const fetchNews = async () => {
    setLoading(true);
    const res = await fetch('/api/qnews');
    const data = await res.json();
    setNews(data.news || []);
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    if (!isMaster) return;
    const res = await fetch('/api/qnews/analytics', { headers: { 'x-qmoi-master': 'true' } });
    const data = await res.json();
    setAnalytics(data.analytics || []);
  };

  useEffect(() => { fetchNews(); if (isMaster) fetchAnalytics(); }, [isMaster]);

  const handleApprove = async (id: number) => {
    await fetch('/api/qnews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-qmoi-master': 'true' },
      body: JSON.stringify({ id, status: 'approved' })
    });
    fetchNews();
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      scheduledAt: item.scheduledAt || '',
      category: item.category || 'general',
      media: item.media || []
    });
  };

  const handleSave = async () => {
    if (editingId) {
      await fetch('/api/qnews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-qmoi-master': 'true' },
        body: JSON.stringify({ id: editingId, ...form })
      });
      setEditingId(null);
    } else {
      await fetch('/api/qnews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(isMaster ? { 'x-qmoi-master': 'true' } : {}) },
        body: JSON.stringify(form)
      });
    }
    setForm({ title: '', content: '', scheduledAt: '', category: 'general', media: [] });
    fetchNews();
    if (isMaster) fetchAnalytics();
  };

  const handleSchedule = async (id: number, scheduledAt: string) => {
    await fetch('/api/qnews/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-qmoi-master': 'true' },
      body: JSON.stringify({ id, scheduledAt })
    });
    fetchNews();
  };

  const handleAddMedia = async () => {
    if (!editingId) return;
    await fetch('/api/qnews/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-qmoi-master': 'true' },
      body: JSON.stringify({ id: editingId, media: [{ type: mediaType, url: mediaUrl }] })
    });
    setMediaUrl('');
    fetchNews();
  };

  // TODO: Analytics, engagement, post history
  // TODO: Post to WhatsApp, Telegram, etc.

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>QNews Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="mb-2"
          />
          <Input
            placeholder="Content"
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className="mb-2"
          />
          {isMaster && (
            <>
              <Input
                placeholder="Category (e.g. earning, project, marketing, global, local)"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="mb-2"
              />
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Media URL"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  className="flex-1"
                />
                <select value={mediaType} onChange={e => setMediaType(e.target.value)} className="px-2 py-1 rounded border">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="text">Text</option>
                </select>
                <Button size="sm" onClick={handleAddMedia} disabled={!editingId || !mediaUrl}>Add Media</Button>
              </div>
            </>
          )}
          <Input
            placeholder="Schedule (ISO, optional)"
            value={form.scheduledAt}
            onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
            className="mb-2"
          />
          <Button onClick={handleSave}>{editingId ? 'Save Changes' : 'Submit News'}</Button>
        </div>
        <div>
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
              {news.map(item => (
                <tr key={item.id} className="border-t">
                  <td>{item.title}</td>
                  <td>{item.status}</td>
                  <td>{item.category}</td>
                  <td>{item.createdAt}</td>
                  <td>{item.updatedAt}</td>
                  <td>
                    {isMaster && item.status !== 'approved' && (
                      <Button size="sm" onClick={() => handleApprove(item.id)} className="mr-2">Approve</Button>
                    )}
                    {isMaster && (
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                    )}
                    {isMaster && (
                      <Button size="sm" variant="outline" onClick={() => handleSchedule(item.id, prompt('Enter ISO date/time to schedule:') || '')}>Schedule</Button>
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
                {analytics.map(a => (
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
              {(news.find(n => n.id === editingId)?.media || []).map((m, i) => (
                <li key={i}>{m.type}: <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{m.url}</a></li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QNewsDashboard; 