import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface Strategy {
  id: number;
  name: string;
  status: string;
}

interface Analytics {
  totalEarned: number;
  last24h: number;
  activeStrategies: number;
  errors: number;
}

const EarningDashboard: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [monitoring, setMonitoring] = useState(false);
  const [status, setStatus] = useState("");

  const fetchStrategies = async () => {
    const res = await fetch("/api/earning/strategies");
    const data = await res.json();
    setStrategies(data.strategies || []);
  };

  const fetchAnalytics = async () => {
    const res = await fetch("/api/earning/analytics");
    const data = await res.json();
    setAnalytics(data.analytics || null);
  };

  useEffect(() => {
    fetchStrategies();
    fetchAnalytics();
  }, []);

  const toggleMonitoring = async () => {
    const res = await fetch("/api/earning/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monitor: !monitoring }),
    });
    const data = await res.json();
    setMonitoring(data.monitoring);
    setStatus(data.monitoring ? "Monitoring started" : "Monitoring stopped");
  };

  const selfHeal = async () => {
    const res = await fetch("/api/earning/self-heal", {
      method: "POST",
    });
    const data = await res.json();
    setStatus(data.message || "Self-healing triggered");
    fetchAnalytics();
  };

  return (
    <Card className="space-y-4 mt-4">
      <CardHeader>
  <Typography variant="h6">Earning Features & Analytics</Typography>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Earning Strategies</h4>
          <ul>
            {strategies.map((s) => (
              <li key={s.id}>
                {s.name}{" "}
                <span className="text-xs text-gray-500">({s.status})</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <Button onClick={toggleMonitoring} className="mr-2">
            {monitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Button>
          <Button onClick={selfHeal} variant="outlined" color="secondary">
            Trigger Self-Healing
          </Button>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Analytics</h4>
          {analytics && (
            <ul>
              <li>Total Earned: ${analytics.totalEarned.toFixed(2)}</li>
              <li>Last 24h: ${analytics.last24h.toFixed(2)}</li>
              <li>Active Strategies: {analytics.activeStrategies}</li>
              <li>Errors: {analytics.errors}</li>
            </ul>
          )}
        </div>
        <div className="text-green-700 font-semibold">{status}</div>
        {/* TODO: Advanced analytics, strategy management */}
      </CardContent>
    </Card>
  );
};

export default EarningDashboard;
