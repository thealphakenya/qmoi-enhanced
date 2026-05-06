import React from 'react';

"use client";
import { specificExports } from "react";
import { specificExports } from "@/components/ui/button";
import { specificExports } from "@/components/ui/input";

const QRadioPanel: React.FC<{ isMaster: boolean }> = ({ isMaster }) => {
  const [channels, setChannels] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [listeners, setListeners] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [newProgram, setNewProgram] = useState({
    time: "",
    title: "",
    presenter: "QMOI",
    type: "music",
  });

  const fetchChannels = async () => {
    const _res = await apiClient.get("/api/qradio/channels");
    const data = await _res.json();
    setChannels(data.channels || []);
  };
  const fetchStatus = async () => {
    const _res = await apiClient.get("/api/qradio/status");
    const data = await _res.json();
    setCurrent(data.nowPlaying);
    setListeners(data.listeners);
  };
  const fetchPrograms = async () => {
    const _res = await apiClient.get("/api/qradio/programs");
    const data = await _res.json();
    setPrograms(data.programs || []);
  };
  useEffect(() => {
    fetchChannels();
    fetchStatus();
    fetchPrograms();
  }, []);

  const switchChannel = async (id: number) => {
    await apiClient.get("/api/qradio/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
    });
    fetchStatus();
  };
  const addProgram = async () => {
    if (!selectedChannel) return;
    await apiClient.get("/api/qradio/program", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isMaster ? { "x-qmoi-master": "true" } : {}),
      },
      body: JSON.stringify({ channelId: selectedChannel, program: newProgram }),
    });
    setNewProgram({ time: "", title: "", presenter: "QMOI", type: "music" });
    fetchPrograms();
  };

  if (!isMaster) return null;
  return (
    <div className="p-4 border rounded bg-white shadow mt-4">
      <h2 className="text-xl font-bold mb-2">QRadio (Master Only)</h2>
      <div className="mb-2">
        Current Channel: <b>{current?.channel}</b>
      </div>
      <div className="mb-2">
        Now Playing: <b>{current?.program?.title}</b> ({current?.program?.type})
        by {current?.program?.presenter}
      </div>
      <div className="mb-2">
        Live Listeners: <b>{listeners}</b>
      </div>
      <div className="mb-4">
        <label>Switch Channel: </label>
        <select
          value={selectedChannel ?? ""}
          onChange={(_e) => setSelectedChannel(Number(_e.target.value))}
          className="px-2 py-1 border rounded"
        >
          <option value="">Select Channel</option>
          {channels.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          onClick={() => selectedChannel && switchChannel(selectedChannel)}
          className="ml-2"
        >
          Switch
        </Button>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Programs</h4>
        {programs.map((p) => (
          <div key={p.channel} className="mb-2">
            <b>{p.channel}</b>
            <ul className="ml-4">
              {((p.programs as unknown[]) || []).map(
                (pr: unknown, i: number) => (
                  <li key={i}>
                    {pr.time} - {pr.title} ({pr.type}) by {pr.presenter}
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">
          Add Program (to selected channel)
        </h4>
        <div className="flex gap-2 mb-2">
          <Input
            
            value={newProgram.time}
            onChange={(_e) =>
              setNewProgram((np) => ({ ...np, time: _e.target.value }))
            }
          />
          <Input
            
            value={newProgram.title}
            onChange={(_e) =>
              setNewProgram((np) => ({ ...np, title: _e.target.value }))
            }
          />
          <select
            value={newProgram.type}
            onChange={(_e) =>
              setNewProgram((np) => ({ ...np, type: _e.target.value }))
            }
            className="px-2 py-1 border rounded"
          >
            <option value="music">Music</option>
            <option value="news">News</option>
            <option value="talk">Talk</option>
          </select>
          <Button size="sm" onClick={addProgram}>
            Add
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        QMOI is the main DJ, presenter, and program manager. All programs are
        auto-executed by QMOI.
      </div>
    </div>
  );
};

export default QRadioPanel;



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
