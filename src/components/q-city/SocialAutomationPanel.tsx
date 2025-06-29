import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Contact {
  id: number;
  name: string;
  platform: string;
  tags: string[];
}

const SocialAutomationPanel: React.FC = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('WhatsApp');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tag, setTag] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const fetchContacts = async () => {
    const res = await fetch('/api/social-automation/contacts');
    const data = await res.json();
    setContacts(data.contacts || []);
  };

  const fetchFeatures = async () => {
    const res = await fetch('/api/social-automation/features');
    const data = await res.json();
    setFeatures(data.features || []);
  };

  useEffect(() => {
    fetchContacts();
    fetchFeatures();
  }, []);

  const postStatus = async () => {
    const res = await fetch('/api/social-automation/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, platform })
    });
    const data = await res.json();
    setStatus(data.success ? 'Posted!' : 'Post failed');
  };

  const tagContact = async (id: number) => {
    const res = await fetch('/api/social-automation/tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, tag })
    });
    const data = await res.json();
    setStatus(data.success ? 'Tagged!' : 'Tag failed');
    fetchContacts();
  };

  return (
    <Card className="space-y-4 mt-4">
      <CardHeader>
        <CardTitle>WhatsApp & Social Automation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Status/News Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Platform (WhatsApp, Telegram, etc.)"
            value={platform}
            onChange={e => setPlatform(e.target.value)}
            className="mb-2"
          />
          <Button onClick={postStatus}>Post Status/News</Button>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Contacts</h4>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Platform</th>
                <th>Tags</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c.id} className="border-t">
                  <td>{c.name}</td>
                  <td>{c.platform}</td>
                  <td>{c.tags.join(', ')}</td>
                  <td>
                    <Input
                      placeholder="Tag"
                      value={tag}
                      onChange={e => setTag(e.target.value)}
                      className="inline-block w-24 mr-2"
                    />
                    <Button size="sm" onClick={() => tagContact(c.id)}>Tag</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Available Features</h4>
          <ul>
            {features.map(f => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="text-green-700 font-semibold">{status}</div>
        {/* TODO: Info gathering, community features */}
      </CardContent>
    </Card>
  );
};

export default SocialAutomationPanel; 