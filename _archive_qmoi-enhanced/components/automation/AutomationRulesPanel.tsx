import React, { useState } from "react";

interface Rule {
  id: string;
  trigger: string;
  action: string;
}

export const AutomationRulesPanel: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [trigger, setTrigger] = useState("");
  const [action, setAction] = useState("");

  const addRule = () => {
    if (!trigger || !action) return;
    setRules([...rules, { id: Date.now().toString(), trigger, action }]);
    setTrigger("");
    setAction("");
  };
  const removeRule = (id: string) => setRules(rules.filter(r => r.id !== id));

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h4>Automation Rules</h4>
      <ul>
        {rules.map(r => (
          <li key={r.id} style={{ marginBottom: 6 }}>
            <b>When</b> <span style={{ color: '#36a2eb' }}>{r.trigger}</span> <b>then</b> <span style={{ color: '#ff6384' }}>{r.action}</span>
            <button onClick={() => removeRule(r.id)} style={{ marginLeft: 8 }}>Remove</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12 }}>
        <input placeholder="Trigger (event type)" value={trigger} onChange={e => setTrigger(e.target.value)} style={{ marginRight: 8 }} />
        <input placeholder="Action (e.g., notify, offload)" value={action} onChange={e => setAction(e.target.value)} style={{ marginRight: 8 }} />
        <button onClick={addRule}>Add Rule</button>
      </div>
    </div>
  );
}; 