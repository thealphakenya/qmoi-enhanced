import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Space { id: string | number; name: string; description?: string }

export function QiSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/qspaces");
        if (!res.ok) throw new Error("no remote qspaces");
        const data = await res.json();
        setSpaces(data.spaces || []);
      } catch (err) {
        // fallback to localStorage
        const local = localStorage.getItem("qi-spaces");
        setSpaces(local ? JSON.parse(local) : []);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  const saveLocal = (s: Space[]) => {
    setSpaces(s);
    localStorage.setItem("qi-spaces", JSON.stringify(s));
  };

  const addSpace = async () => {
    if (!name.trim()) return;
    try {
      const res = await fetch("/api/qspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("remote create failed");
      const data = await res.json();
      setSpaces((s) => [...s, data.space]);
    } catch (err) {
      // fallback local
      const id = new Date().getTime();
      saveLocal([...spaces, { id, name }]);
    } finally {
      setName("");
    }
  };

  const removeSpace = async (id: string | number) => {
    try {
      const res = await fetch(`/api/qspaces/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Remote delete failed");
      setSpaces((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      saveLocal(spaces.filter((x) => x.id !== id));
    }
  };

  return (
    <div className="p-3 border rounded bg-slate-900">
      <h4 className="font-semibold">Qi Spaces</h4>
      <div className="mt-2">
        <div className="flex gap-2 mb-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Space name" />
          <Button size="sm" onClick={addSpace} disabled={!name.trim()}>Add</Button>
        </div>
        <div>
          {loading && <div className="text-gray-400">Loading...</div>}
          {spaces.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-2 border-b">
              <div>{s.name}</div>
              <div><Button size="xs" variant="destructive" onClick={() => removeSpace(s.id)}>Remove</Button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QiSpaces;