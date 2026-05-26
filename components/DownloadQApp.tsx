"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Smartphone,
  Monitor,
  Tablet,
  Server,
  Download,
  Wifi,
  Zap,
  CheckCircle,
  Star,
} from "lucide-react";
interface DeviceInfo {
  type: string;
  os: string;
  name: string;
  icon: React.ReactNode;
  downloadUrl: string;
  sizeMB: number;
  requirements: string[];
  features: string[];
}
const devices: DeviceInfo[] = [
  {
    type: "mobile",
    os: "android",
    name: "Android Mobile",
    icon: <Smartphone className="w-6 h-6" />,
    downloadUrl:
      "https://github.com/thealphakenya/latest-Q-ai/releases/latest/download/qmoi_ai.apk",
    sizeMB: 50,
    requirements: ["Android 8.0+", "2GB RAM", "500MB Storage"],
    features: ["Push Notifications", "Offline Mode", "Biometric Login", "Auto-Sync"],
  },
  {
    type: "mobile",
    os: "ios",
    name: "iPhone / iPad",
    icon: <Smartphone className="w-6 h-6" />,
    downloadUrl:
      "https://github.com/thealphakenya/latest-Q-ai/releases/latest/download/qmoi_ai.ipa",
    sizeMB: 60,
    requirements: ["iOS 14+", "2GB RAM", "500MB Storage"],
    features: ["Face ID / Touch ID", "Siri Integration", "Apple Watch Support", "iCloud Sync"],
  },
  {
    type: "desktop",
    os: "windows",
    name: "Windows Desktop",
    icon: <Monitor className="w-6 h-6" />,
    downloadUrl:
      "https://github.com/thealphakenya/latest-Q-ai/releases/latest/download/qmoi_ai.exe",
    sizeMB: 120,
    requirements: ["Windows 10+", "4GB RAM", "1GB Storage"],
    features: ["System Tray", "Auto Startup", "Desktop Widgets", "Keyboard Shortcuts"],
  },
  {
    type: "tablet",
    os: "android",
    name: "Android Tablet",
    icon: <Tablet className="w-6 h-6" />,
    downloadUrl:
      "https://github.com/thealphakenya/latest-Q-ai/releases/latest/download/qmoi_ai.apk",
    sizeMB: 50,
    requirements: ["Android 8.0+", "3GB RAM", "1GB Storage"],
    features: ["Pen Support", "Multi-Window", "Floating Widgets", "HD Display"],
  },
  {
    type: "server",
    os: "linux",
    name: "Linux Server",
    icon: <Server className="w-6 h-6" />,
    downloadUrl:
      "https://github.com/thealphakenya/latest-Q-ai/releases/latest/download/qmoi_ai.appimage",
    sizeMB: 100,
    requirements: ["Ubuntu 20.04+", "8GB RAM", "10GB Storage"],
    features: ["Docker Support", "CLI Interface", "Service Management", "Logging"],
  },
];
const DownloadQApp: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string>("");
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const fallback = devices.find((device) => device.os === "windows") || devices[0];
    const detected = devices.find((device) => {
      if (/Android/i.test(userAgent) && device.os === "android") return true;
      if (/iPhone|iPad|iPod/i.test(userAgent) && device.os === "ios") return true;
      if (/Windows/i.test(userAgent) && device.os === "windows") return true;
      if (/Mac/i.test(userAgent) && device.os === "macos") return true;
      if (/Linux/i.test(userAgent) && device.os === "linux") return true;
      return false;
    });
    setSelectedDevice(detected || fallback);
  }, []);
  const selectedSteps = useMemo(
    () => [
      {
        title: "Device Detection",
        description: "Automatically determining the best installation package.",
        icon: <Smartphone className="w-5 h-5" />,
      },
      {
        title: "Requirements Check",
        description: "Validating your device against installation prerequisites.",
        icon: <CheckCircle className="w-5 h-5" />,
      },
      {
        title: "Download & Install",
        description: "Downloading QMOI and preparing the installer.",
        icon: <Download className="w-5 h-5" />,
      },
      {
        title: "Network Setup",
        description: "Configuring connectivity and agent communication.",
        icon: <Wifi className="w-5 h-5" />,
      },
      {
        title: "Agent Activation",
        description: "Activating your personal AI agent on the device.",
        icon: <Zap className="w-5 h-5" />,
      },
      {
        title: "Optimization",
        description: "Tuning performance for your environment.",
        icon: <Star className="w-5 h-5" />,
      },
    ],
    [],
  );
  const handleDownload = async () => {
    if (!selectedDevice) return;
    setIsDownloading(true);
    setDownloadMessage("Starting download...");
    setDownloadProgress(0);
    const interval = window.setInterval(() => {
      setDownloadProgress((value) => {
        const next = Math.min(100, value + 16);
        if (next === 100) {
          window.clearInterval(interval);
          setDownloadMessage("Download complete. Follow the installer prompts to finish setup.");
          setIsDownloading(false);
        }
        return next;
      });
    }, 400);
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Download QMOI App</h1>
        <p className="text-sm text-slate-500">
          Choose your device and install the latest QMOI release with guided setup.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Device</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDevice ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-900">
                    {selectedDevice.icon}
                    <div>
                      <p className="font-semibold">{selectedDevice.name}</p>
                      <p className="text-sm text-slate-500">{selectedDevice.os}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div>
                      <p className="font-medium text-slate-900">Installer Size</p>
                      <p>{selectedDevice.sizeMB} MB</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Requirements</p>
                      <p>{selectedDevice.requirements.join(", ")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Features</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {selectedDevice.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>No device detected. Select a package manually below.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Installation Steps</h2>
            <div className="space-y-3">
              {selectedSteps.map((step) => (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3 text-slate-900">
                    {step.icon}
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-slate-500">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500">
                Downloading {selectedDevice?.name ?? "selected device"} package.
              </p>
              <Progress value={downloadProgress} />
              <p className="text-sm text-slate-500">{downloadMessage || "Ready to download."}</p>
              <Button onClick={handleDownload} disabled={isDownloading} className="w-full">
                {isDownloading ? "Downloading..." : "Start Download"}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Alternate Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {devices.map((device) => (
                <button
                  key={device.name}
                  type="button"
                  onClick={() => setSelectedDevice(device)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedDevice?.name === device.name
                      ? "border-slate-900 bg-slate-100"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {device.icon}
                    <div>
                      <p className="font-semibold text-slate-900">{device.name}</p>
                      <p className="text-xs text-slate-500">{device.requirements.join(", ")}</p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};
DownloadQApp.displayName = "DownloadQApp";
export default DownloadQApp;
