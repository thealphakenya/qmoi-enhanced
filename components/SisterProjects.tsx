import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// SisterProjects: Shows and saves AI-suggested projects for the sister role
export function SisterProjects() {
  const [suggested, setSuggested] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    function handleSuggestions(e: any) {
      setSuggested(e.detail || []);
    }
    window.addEventListener('ai-suggested-projects', handleSuggestions);
    return () => window.removeEventListener('ai-suggested-projects', handleSuggestions);
  }, []);

  function saveProject(p: any) {
    setSaved((prev) => [...prev, p]);
    // Optionally persist to backend or localStorage
    window.dispatchEvent(new CustomEvent('sister-project-saved', { detail: p }));
  }

  return (
    <Card className="my-4">
      <CardContent>
        <h4 className="font-semibold mb-2">Your Projects</h4>
        {saved.length === 0 && <div className="text-gray-400 mb-2">No projects saved yet.</div>}
        <ul className="mb-4">
          {saved.map((p, i) => (
            <li key={i} className="mb-1"><span className="font-bold">{p.title}:</span> {p.description}</li>
          ))}
        </ul>
        <h5 className="font-semibold mb-1">AI Suggestions</h5>
        <ul>
          {suggested.map((p, i) => (
            <li key={i} className="mb-2 flex items-center justify-between">
              <span><span className="font-bold">{p.title}:</span> {p.description}</span>
              <Button size="sm" onClick={() => saveProject(p)} disabled={saved.some(s => s.title === p.title)}>
                {saved.some(s => s.title === p.title) ? 'Saved' : 'Save'}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
