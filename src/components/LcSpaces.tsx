import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LcSpace { id: string | number; name: string }

export function LcSpaces() {
  const [spaces, setSpaces] = useState<LcSpace[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const local = localStorage.getItem("lc-spaces");
    setSpaces(local ? JSON.parse(local) : []);
  }, []);

  const saveLocal = (s: LcSpace[]) => {
    setSpaces(s);
    localStorage.setItem("lc-spaces", JSON.stringify(s));
  };

  const addSpace = () => {
    if (!name.trim()) return;
    const id = new Date().getTime();
    saveLocal([...spaces, { id, name }]);
    setName("");
  };

  const remove = (id: string | number) => saveLocal(spaces.filter((s) => s.id !== id));

  return (
    <div className="p-3 border rounded bg-slate-900">
      <h4 className="font-semibold">Local Spaces</h4>
      <div className="mt-2">
        <div className="flex gap-2 mb-2">
          <Input placeholder="Local space name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={addSpace} size="sm">Add</Button>
        </div>
        <ul>
          {spaces.map((s) => (
            <li key={s.id} className="flex justify-between items-center p-1 border-b">
              <span>{s.name}</span>
              <Button size="xs" variant="destructive" onClick={() => remove(s.id)}>Remove</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LcSpaces;