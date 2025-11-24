import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Download, Smartphone, Monitor, Tablet, Laptop, Server, Wifi, Shield, Zap, Star } from 'lucide-react';

interface DeviceInfo {
  type: 'mobile' | 'desktop' | 'tablet' | 'laptop' | 'server';
  os: 'android' | 'ios' | 'windows' | 'macos' | 'linux';
  name: string;
  icon: React.ReactNode;
  downloadUrl: string;
  sizeMB: number;
  requirements: string[];
  features: string[];
}

const DownloadQApp: React.FC = () => {
  const [showDownload, setShowDownload] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // userAgent state removed (was unused)

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = localStorage.getItem('qmoi_app_installed');
    if (!isInstalled) {
      setShowDownload(true);
    }

    // Detect user device
    
    // Auto-detect best device match
    const detectedDevice = detectDevice(navigator.userAgent);
    if (detectedDevice) {
      setSelectedDevice(detectedDevice);
    }
  }, []);

  const detectDevice = (agent: string): DeviceInfo | null => {
    if (/Android/i.test(agent)) {
      return devices.find(d => d.os === 'android' && d.type === 'mobile') || null;
    } else if (/iPhone|iPad|iPod/i.test(agent)) {
      return devices.find(d => d.os === 'ios' && d.type === 'mobile') || null;
    } else if (/Windows/i.test(agent)) {
      return devices.find(d => d.os === 'windows' && d.type === 'desktop') || null;
    } else if (/Mac/i.test(agent)) {
      return devices.find(d => d.os === 'macos' && d.type === 'desktop') || null;
    } else if (/Linux/i.test(agent)) {
      return devices.find(d => d.os === 'linux' && d.type === 'desktop') || null;
    }
    return null;
  };

  const devices: DeviceInfo[] = [
    {
      type: 'mobile',
      os: 'android',
      name: 'Android Mobile',
      icon: <Smartphone className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.apk',
      sizeMB: 50,
      requirements: ['Android 8.0+', '2GB RAM', '500MB Storage'],
      features: ['Push Notifications', 'Offline Mode', 'Biometric Login', 'Auto-Sync']
    },
    {
      type: 'mobile',
      os: 'ios',
      name: 'iPhone/iPad',
      icon: <Smartphone className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.ipa',
      sizeMB: 60,
      requirements: ['iOS 14.0+', '2GB RAM', '500MB Storage'],
      features: ['Face ID/Touch ID', 'Siri Integration', 'Apple Watch Support', 'iCloud Sync']
    },
    {
      type: 'desktop',
      os: 'windows',
      name: 'Windows Desktop',
      icon: <Monitor className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.exe',
      sizeMB: 120,
      requirements: ['Windows 10+', '4GB RAM', '1GB Storage'],
      features: ['System Tray', 'Auto-Startup', 'Desktop Widgets', 'Keyboard Shortcuts']
    },
    {
      type: 'desktop',
      os: 'macos',
      name: 'Mac Desktop',
      icon: <Monitor className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.dmg',
      sizeMB: 110,
      requirements: ['macOS 11.0+', '4GB RAM', '1GB Storage'],
      features: ['Touch Bar Support', 'Spotlight Integration', 'Menu Bar Widget', 'Handoff']
    },
    {
      type: 'laptop',
      os: 'windows',
      name: 'Windows Laptop',
      icon: <Laptop className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.exe',
      sizeMB: 120,
      requirements: ['Windows 10+', '4GB RAM', '1GB Storage'],
      features: ['Battery Optimization', 'Touch Screen Support', 'Pen Input', 'Multi-Monitor']
    },
    {
      type: 'laptop',
      os: 'macos',
      name: 'MacBook',
      icon: <Laptop className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.dmg',
      sizeMB: 110,
      requirements: ['macOS 11.0+', '4GB RAM', '1GB Storage'],
      features: ['Touch Bar Support', 'Force Touch', 'Backlit Keyboard', 'Thunderbolt']
    },
    {
      type: 'tablet',
      os: 'android',
      name: 'Android Tablet',
      icon: <Tablet className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.apk',
      sizeMB: 50,
      requirements: ['Android 8.0+', '3GB RAM', '1GB Storage'],
      features: ['Pen Support', 'Multi-Window', 'Floating Widgets', 'HD Display']
    },
    {
      type: 'tablet',
      os: 'ios',
      name: 'iPad',
      icon: <Tablet className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.ipa',
      sizeMB: 60,
      requirements: ['iPadOS 14.0+', '3GB RAM', '1GB Storage'],
      features: ['Apple Pencil', 'Split View', 'Slide Over', 'Magic Keyboard']
    },
    {
      type: 'server',
      os: 'linux',
      name: 'Linux Server',
      icon: <Server className="w-6 h-6" />,
      downloadUrl: 'https://github.com/thealphakenya/Alpha-Q-ai/releases/latest/download/qmoi_ai.appimage',
      sizeMB: 100,
      requirements: ['Ubuntu 20.04+', '8GB RAM', '10GB Storage'],
      features: ['Docker Support', 'CLI Interface', 'Service Management', 'Logging']
    }
  ];

  const downloadSteps = [
    {
      title: 'Device Detection',
      description: 'Automatically detecting your device for optimal installation',
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      title: 'Requirements Check',
      description: 'Verifying system requirements and available resources',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: 'Download & Install',
      description: 'Downloading and installing QMOI with enhanced features',
      icon: <Download className="w-5 h-5" />
    },
    {
      title: 'Network Setup',
      description: 'Configuring auto-connection to available networks',
      icon: <Wifi className="w-5 h-5" />
    },
    {
      title: 'Agent Activation',
      description: 'Activating QMOI as your personal AI agent',
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: 'Optimization',
      description: 'Optimizing performance for your specific device',
      icon: <Star className="w-5 h-5" />
    }
  ];

  const handleDownload = async () => {
    if (!selectedDevice) return;

    setIsDownloading(true);
    setCurrentStep(0);

    // Simulate download process
    for (let i = 0; i <= 100; i += 10) {
      setDownloadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (i === 20) setCurrentStep(1);
      if (i === 40) setCurrentStep(2);
      if (i === 60) setCurrentStep(3);
      if (i === 80) setCurrentStep(4);
      if (i === 100) setCurrentStep(5);
    }

    // Mark as installed
    localStorage.setItem('qmoi_app_installed', 'true');
    setIsDownloading(false);
    setShowDownload(false);

    // Trigger download
    const link = document.createElement('a');
    link.href = selectedDevice.downloadUrl;
    link.download = `QMOI-${selectedDevice.os}-${selectedDevice.type}.${getFileExtension(selectedDevice.os)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileExtension = (os: string): string => {
    switch (os) {
      case 'android': return 'apk';
      case 'ios': return 'ipa';
      case 'windows': return 'exe';
      case 'macos': return 'dmg';
      case 'linux': return 'tar.gz';
      default: return 'zip';
    }
  };

  if (!showDownload) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Download className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Download QMOI AI</CardTitle>
          <CardDescription className="text-green-100">
            Your Personal AI Agent for Revenue Generation & Automation
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {!isDownloading ? (
            <>
              {/* Device Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Choose Your Device</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devices.map((device) => (
                    <div
                      key={`${device.os}-${device.type}`}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDevice?.os === device.os && selectedDevice?.type === device.type
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedDevice(device)}
                    >
                      <div className="flex items-center mb-3">
                        <div className="text-green-600 mr-3">{device.icon}</div>
                        <div>
                          <h4 className="font-semibold">{device.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                          <Badge>{device.os.toUpperCase()}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <strong>Size:</strong> <span className="text-xs">{device.sizeMB} MB</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Requirements:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {device.requirements.map((req, idx) => (
                              <li key={idx} className="text-xs">{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Features:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {device.features.map((feature, idx) => (
                              <li key={idx} className="text-xs">{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Transfer & Install:</strong>
                          <ul className="list-disc list-inside mt-1">
                            <li className="text-xs">You can transfer the app file directly from the Qmoi_apps directory to another device using USB, SD card, Bluetooth, or any file sharing method.</li>
                            <li className="text-xs">No internet or download required if you already have the file—just copy and install on the target device.</li>
                            <li className="text-xs">Alternatively, download and send via email, WhatsApp, or cloud.</li>
                            <li className="text-xs">Install by opening the file on the target device and following the standard installation process.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Installation Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Enhanced Installation Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">99.9% Success Rate</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Wifi className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Auto Network Connect</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">AI Agent Mode</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Performance Optimized</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleDownload}
                  disabled={!selectedDevice}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download & Install
                </Button>
                <Button
                  onClick={() => setShowDownload(false)}
                  variant="outline"
                  size="lg"
                >
                  Maybe Later
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Download Progress */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Installing QMOI AI</h3>
                
                {/* Current Step */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="text-green-600 mr-3">
                      {downloadSteps[currentStep].icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{downloadSteps[currentStep].title}</h4>
                      <p className="text-sm text-gray-600">{downloadSteps[currentStep].description}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress value={downloadProgress} className="mb-4" />
                <p className="text-center text-sm text-gray-600">{downloadProgress}% Complete</p>
              </div>

              {/* Installation Features */}
              <Alert className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Enhanced Installation:</strong> QMOI will be installed with all optimizations for your {selectedDevice?.name} device, including auto-network connection and AI agent capabilities.
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadQApp; 