import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Badge } from './ui/badge';
import { useMaster } from './MasterContext';
import { FaCog, FaLanguage, FaFont, FaNetworkWired, FaDownload, FaSync, FaUserShield, FaRobot, FaPalette, FaMobile } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FontSettings {
  family: string;
  size: number;
  weight: string;
}

interface NetworkSettings {
  autoConnect: boolean;
  zeroRatedSites: boolean;
  aiDecides: boolean;
  maxConnections: number;
  preferredNetworks: string[];
}

interface AISettings {
  autoTheme: boolean;
  autoWallpaper: boolean;
  autoNotifications: boolean;
  autoLauncher: boolean;
  autoAdRemoval: boolean;
  language: 'en' | 'sw';
  swahiliSupport: boolean;
}

interface QmoiAppSettings {
  browser: boolean;
  dialer: boolean;
  messaging: boolean;
  launcher: boolean;
  keyboard: boolean;
  settings: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { isMaster } = useMaster();
  
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    family: 'Inter',
    size: 14,
    weight: 'normal'
  });
  
  const [networkSettings, setNetworkSettings] = useState<NetworkSettings>({
    autoConnect: true,
    zeroRatedSites: true,
    aiDecides: true,
    maxConnections: 5,
    preferredNetworks: []
  });
  
  const [aiSettings, setAISettings] = useState<AISettings>({
    autoTheme: true,
    autoWallpaper: true,
    autoNotifications: true,
    autoLauncher: true,
    autoAdRemoval: true,
    language: 'en',
    swahiliSupport: true
  });
  
  const [qmoiApps, setQmoiApps] = useState<QmoiAppSettings>({
    browser: true,
    dialer: true,
    messaging: true,
    launcher: true,
    keyboard: true,
    settings: true
  });

  // Apply font settings globally
  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', fontSettings.family);
    document.documentElement.style.setProperty('--font-size', `${fontSettings.size}px`);
    document.documentElement.style.setProperty('--font-weight', fontSettings.weight);
  }, [fontSettings]);

  // Apply language settings
  useEffect(() => {
    document.documentElement.lang = aiSettings.language;
    localStorage.setItem('qmoi-language', aiSettings.language);
  }, [aiSettings.language]);

  const handleFontChange = (key: keyof FontSettings, value: string | number) => {
    setFontSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNetworkChange = (key: keyof NetworkSettings, value: any) => {
    setNetworkSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAIChange = (key: keyof AISettings, value: any) => {
    setAISettings(prev => ({ ...prev, [key]: value }));
  };

  const handleQmoiAppToggle = (app: keyof QmoiAppSettings) => {
    setQmoiApps(prev => ({ ...prev, [app]: !prev[app] }));
  };

  const updateQmoiApp = async () => {
    // Simulate update process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const downloadQmoiApp = async (appName: string) => {
    console.log(`Downloading ${appName}...`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {React.createElement(FaCog as React.ElementType, { className: 'text-blue-600', size: 20 }) as React.ReactNode}
            {React.createElement(FaLanguage as React.ElementType, { className: 'mr-2', size: 20 }) as React.ReactNode}
            {aiSettings.language === 'sw' ? 'Mipangilio ya Qmoi' : 'Qmoi Settings'}
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            ✕
          </Button>
        </div>

        <div className="flex h-full">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">
                {React.createElement(FaLanguage as React.ElementType, { className: 'mr-2', size: 20 }) as React.ReactNode}
                {aiSettings.language === 'sw' ? 'Jumla' : 'General'}
              </TabsTrigger>
              <TabsTrigger value="appearance">
                {React.createElement(FaPalette as React.ElementType, { className: 'mr-2', size: 20 }) as React.ReactNode}
                {aiSettings.language === 'sw' ? 'Muonekano' : 'Appearance'}
              </TabsTrigger>
              <TabsTrigger value="network">
                {React.createElement(FaNetworkWired as React.ElementType, { className: 'mr-2', size: 20 }) as React.ReactNode}
                {aiSettings.language === 'sw' ? 'Mtandao' : 'Network'}
              </TabsTrigger>
              <TabsTrigger value="ai">
                {React.createElement(FaRobot as React.ElementType, { className: 'mr-2', size: 20 }) as React.ReactNode}
                AI
              </TabsTrigger>
              <TabsTrigger value="qmoi-apps">
                {React.createElement(FaMobile as React.ElementType, { className: 'mr-2', size: 20 }) as React.ReactNode}
                {aiSettings.language === 'sw' ? 'Programu za Qmoi' : 'Qmoi Apps'}
              </TabsTrigger>
              {isMaster && (
                <TabsTrigger value="master">
                  {React.createElement(FaUserShield as React.ElementType, { className: 'mr-2', size: 20 }) as React.ReactNode}
                  {aiSettings.language === 'sw' ? 'Mkuu' : 'Master'}
                </TabsTrigger>
              )}
            </TabsList>

            <div className="p-4 overflow-y-auto h-full">
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {React.createElement(FaLanguage as React.ElementType, { size: 20 }) as React.ReactNode}
                      {aiSettings.language === 'sw' ? 'Lugha na Mipangilio' : 'Language & Settings'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Lugha' : 'Language'}</Label>
                      <Select value={aiSettings.language} onValueChange={(value: 'en' | 'sw') => handleAIChange('language', value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="sw">Kiswahili</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Msaada wa Kiswahili' : 'Swahili Support'}</Label>
                      <Switch 
                        checked={aiSettings.swahiliSupport}
                        onCheckedChange={(checked: boolean) => handleAIChange('swahiliSupport', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {React.createElement(FaFont as React.ElementType, { size: 20 }) as React.ReactNode}
                      {aiSettings.language === 'sw' ? 'Fonti na Muonekano' : 'Font & Appearance'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{aiSettings.language === 'sw' ? 'Aina ya Fonti' : 'Font Family'}</Label>
                        <Select value={fontSettings.family} onValueChange={(value: string) => handleFontChange('family', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>{aiSettings.language === 'sw' ? 'Ukubwa wa Fonti' : 'Font Size'}</Label>
                        <Input 
                          type="number" 
                          value={fontSettings.size}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFontChange('size', parseInt(e.target.value))}
                          min="8"
                          max="32"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Muonekano wa Kiotomatiki' : 'Auto Appearance'}</Label>
                      <Switch 
                        checked={aiSettings.autoTheme}
                        onCheckedChange={(checked: boolean) => handleAIChange('autoTheme', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="network" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {React.createElement(FaNetworkWired as React.ElementType, { size: 20 }) as React.ReactNode}
                      {aiSettings.language === 'sw' ? 'Mipangilio ya Mtandao' : 'Network Settings'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Uunganisho wa Kiotomatiki' : 'Auto Connect'}</Label>
                      <Switch 
                        checked={networkSettings.autoConnect}
                        onCheckedChange={(checked: boolean) => handleNetworkChange('autoConnect', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Tovuti za Bure' : 'Zero-Rated Sites'}</Label>
                      <Switch 
                        checked={networkSettings.zeroRatedSites}
                        onCheckedChange={(checked: boolean) => handleNetworkChange('zeroRatedSites', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'AI Inaamua' : 'AI Decides'}</Label>
                      <Switch 
                        checked={networkSettings.aiDecides}
                        onCheckedChange={(checked: boolean) => handleNetworkChange('aiDecides', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {React.createElement(FaRobot as React.ElementType, { size: 20 }) as React.ReactNode}
                      {aiSettings.language === 'sw' ? 'Mipangilio ya AI' : 'AI Settings'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Muonekano wa Kiotomatiki' : 'Auto Theme'}</Label>
                      <Switch 
                        checked={aiSettings.autoTheme}
                        onCheckedChange={(checked: boolean) => handleAIChange('autoTheme', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Picha ya Ukuta ya Kiotomatiki' : 'Auto Wallpaper'}</Label>
                      <Switch 
                        checked={aiSettings.autoWallpaper}
                        onCheckedChange={(checked: boolean) => handleAIChange('autoWallpaper', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Arifa za Kiotomatiki' : 'Auto Notifications'}</Label>
                      <Switch 
                        checked={aiSettings.autoNotifications}
                        onCheckedChange={(checked: boolean) => handleAIChange('autoNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Launcher ya Kiotomatiki' : 'Auto Launcher'}</Label>
                      <Switch 
                        checked={aiSettings.autoLauncher}
                        onCheckedChange={(checked: boolean) => handleAIChange('autoLauncher', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>{aiSettings.language === 'sw' ? 'Kuondoa Matangazo' : 'Ad Removal'}</Label>
                      <Switch 
                        checked={aiSettings.autoAdRemoval}
                        onCheckedChange={(checked: boolean) => handleAIChange('autoAdRemoval', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qmoi-apps" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {React.createElement(FaMobile as React.ElementType, { size: 20 }) as React.ReactNode}
                      {aiSettings.language === 'sw' ? 'Programu za Qmoi' : 'Qmoi Apps'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(qmoiApps).map(([app, enabled]) => (
                      <div key={app} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={enabled}
                              onCheckedChange={() => handleQmoiAppToggle(app as keyof QmoiAppSettings)}
                            />
                            <Label className="capitalize">
                              {aiSettings.language === 'sw' 
                                ? app === 'browser' ? 'Q-Kivinjari' :
                                  app === 'dialer' ? 'Q-Simu' :
                                  app === 'messaging' ? 'Q-Ujumbe' :
                                  app === 'launcher' ? 'Q-Kuzindua' :
                                  app === 'keyboard' ? 'Q-Kibodi' :
                                  app === 'settings' ? 'Q-Mipangilio' : app
                                : `Q-${app.charAt(0).toUpperCase() + app.slice(1)}`}
                            </Label>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateQmoiApp()}>
                              {React.createElement(FaSync as React.ElementType, { className: 'mr-1', size: 16 }) as React.ReactNode}
                              {aiSettings.language === 'sw' ? 'Sasisha' : 'Update'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadQmoiApp(app)}>
                              {React.createElement(FaDownload as React.ElementType, { className: 'mr-1', size: 16 }) as React.ReactNode}
                              {aiSettings.language === 'sw' ? 'Pakua' : 'Download'}
                            </Button>
                          </div>
                        </div>
                        <Badge variant={enabled ? 'default' : 'secondary'}>
                          {enabled ? (aiSettings.language === 'sw' ? 'Imewezeshwa' : 'Enabled') : (aiSettings.language === 'sw' ? 'Imelazimishwa' : 'Disabled')}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {isMaster && (
                <TabsContent value="master" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {React.createElement(FaUserShield as React.ElementType, { size: 20 }) as React.ReactNode}
                        {aiSettings.language === 'sw' ? 'Mkuu' : 'Master'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>{aiSettings.language === 'sw' ? 'Udhibiti wa Mfumo' : 'System Control'}</Label>
                        <Button size="sm" variant="destructive">
                          {aiSettings.language === 'sw' ? 'Funga Mfumo' : 'Shutdown System'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;