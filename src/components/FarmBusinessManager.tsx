import React, { useState } from "react";

interface Asset {
  type: "farm" | "livestock" | "business";
  name: string;
  count: number;
  added: string;
}

export const FarmBusinessManager: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [type, setType] = useState<"farm" | "livestock" | "business">("farm");
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);

  const handleAdd = () => {
    if (!name) return;
    setAssets((a) => [
      ...a,
      { type, name, count, added: new Date().toLocaleString() },
    ]);
    setName("");
    setCount(1);
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Farm, Livestock & Business Manager</h3>
      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value as "farm" | "livestock" | "business")
        }
        style={{ marginBottom: 8 }}
      >
        <option value="farm">Farm Asset</option>
        <option value="livestock">Livestock</option>
        <option value="business">Business Asset</option>
      </select>
      <input
        type="text"
        placeholder="Name/Type"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: 8, width: "100%" }}
      />
      <input
        type="number"
        min={1}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        style={{ marginBottom: 8, width: "100%" }}
      />
      <button onClick={handleAdd} disabled={!name}>
        Add
      </button>
      <ul style={{ marginTop: 16, fontSize: 14 }}>
        {assets.map((a, i) => (
          <li key={i}>
            {a.type}: {a.name} x{a.count}{" "}
            <span style={{ color: "#aaa" }}>({a.added})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.119923Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.966593Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.112740Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.549056Z

// AUTOFIXED by Ollama at 2026-07-28T23:33:47.022574Z
