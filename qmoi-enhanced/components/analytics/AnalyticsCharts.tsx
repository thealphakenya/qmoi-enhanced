import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const AnalyticsCharts: React.FC<{ analytics: { events: any[] } }> = ({
  analytics,
}) => {
  // Plugin usage count
  const pluginUsage: { [name: string]: number } = {};
  analytics.events.forEach((e) => {
    if (e.type === "plugin-enabled" || e.type === "plugin-disabled") {
      const name = e.payload?.id || "unknown";
      pluginUsage[name] = (pluginUsage[name] || 0) + 1;
    }
  });
  const pluginLabels = Object.keys(pluginUsage);
  const pluginCounts = pluginLabels.map((l) => pluginUsage[l]);

  // Event frequency by time
  const eventTimes = analytics.events.map(
    (e) => new Date(e.timestamp || Date.now()),
  );
  const timeLabels = eventTimes.map((t) => t.toLocaleTimeString());
  const eventCounts = analytics.events.map((_, i) => i + 1);

  return (
    <div>
      <h4>Plugin Usage</h4>
      <Bar
        data={{
          labels: pluginLabels,
          datasets: [
            { label: "Usage", data: pluginCounts, backgroundColor: "#36a2eb" },
          ],
        }}
        options={{ responsive: true, plugins: { legend: { display: false } } }}
      />
      <h4 style={{ marginTop: 32 }}>Event Frequency</h4>
      <Line
        data={{
          labels: timeLabels,
          datasets: [
            {
              label: "Events",
              data: eventCounts,
              borderColor: "#ff6384",
              backgroundColor: "#ffb1c1",
            },
          ],
        }}
        options={{ responsive: true, plugins: { legend: { display: false } } }}
      />
    </div>
  );
};
