import React, { useEffect, useState } from "react";
import { QmoiMemory } from "../src/services/QmoiMemory";
import { useMaster } from "./MasterContext";
import { Button } from "./ui/button";

export const QmoiMemoryPanel: React.FC = () => {
  const { isMaster } = useMaster();
  const [memory, setMemory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [evolving, setEvolving] = useState(false);

  useEffect(() => {
    if (isMaster) {
      setLoading(true);
      QmoiMemory.list("master").then((mem) => {
        setMemory(mem);
        setLoading(false);
      });
    }
  }, [isMaster]);

  const handleEvolve = async () => {
    setEvolving(true);
    await QmoiMemory.save("evolution", { action: "triggered" }, "master");
    QmoiMemory.list("master").then((mem) => {
      setMemory(mem);
      setEvolving(false);
    });
  };

  if (!isMaster) return null;

  return (
    <div className="p-4 bg-gray-900 text-green-200 rounded-lg shadow mt-4">
      <h3 className="font-semibold mb-2">
        QMOI Memory & Evolution (Master Only)
      </h3>
      <Button
        size="sm"
        variant="outline"
        onClick={handleEvolve}
        disabled={evolving}
      >
        {evolving ? "Evolving..." : "Trigger Evolution Cycle"}
      </Button>
      <div className="mt-4 max-h-64 overflow-y-auto">
        {loading
          ? "Loading..."
          : memory.map((entry, i) => (
              <div key={i} className="mb-2 p-2 bg-gray-800 rounded">
                <div className="text-xs text-gray-400">{entry.timestamp}</div>
                <div className="text-sm font-mono">
                  {JSON.stringify(entry.value)}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
