import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Home, 
  Bookmark, 
  Download,
  Settings,
  Shield,
  Eye,
  EyeOff,
  Search,
  Mic,
  Camera,
  Volume2,
  Monitor,
  Code,
  Network,
  Activity,
  Zap,
  Play,
  Pause,
  Maximize,
  Minimize,
  X,
  Plus,
  MoreVertical,
  Star,
  History,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Globe2,
  Tv,
  Radio,
  Video,
  Music,
  FileText,
  Image,
  Film,
  Headphones,
  Smartphone,
  Tablet,
  Laptop,
  Monitor as MonitorIcon
} from 'lucide-react';
import { browserService } from '../services/BrowserService';

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  isActive: boolean;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

interface LiveContent {
  type: string;
  title: string;
  description: string;
  channels: string[];
  quality: string;
}

export default function BrowserInterface() {
  const [tabs, setTabs] = useState<BrowserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [aiFeatures, setAiFeatures] = useState<any[]>([]);
  const [liveContent, setLiveContent] = useState<LiveContent | null>(null);
  const [developerTools, setDeveloperTools] = useState<boolean>(false);
  const [incognitoMode, setIncognitoMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('browser');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [contentSummary, setContentSummary] = useState<string>('');
  const [securityReport, setSecurityReport] = useState<any>(null);
  const [voiceSearch, setVoiceSearch] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBrowserData();
    setupEventListeners();
  }, []);

  const loadBrowserData = () => {
    setTabs(browserService.getTabs());
    setActiveTabId(browserService.getActiveTab()?.id || null);
    setBookmarks(browserService.getBookmarks());
    setHistory(browserService.getHistory());
    setDownloads(browserService.getDownloads());
    setSettings(browserService.getSettings());
    setAiFeatures(browserService.getAIFeatures());
  };

  const setupEventListeners = () => {
    browserService.onTabCreated((tab) => {
      setTabs(prev => [...prev, tab]);
    });

    browserService.onTabActivated(({ tabId }) => {
      setActiveTabId(tabId);
      setTabs(prev => prev.map(tab => ({ ...tab, isActive: tab.id === tabId })));
    });

    browserService.onTabClosed(({ tabId }) => {
      setTabs(prev => prev.filter(tab => tab.id !== tabId));
    });

    browserService.onNavigationStarted(({ tabId, url }) => {
      setTabs(prev => prev.map(tab => 
        tab.id === tabId ? { ...tab, isLoading: true, url } : tab
      ));
    });

    browserService.onNavigationCompleted(({ tabId, url }) => {
      setTabs(prev => prev.map(tab => 
        tab.id === tabId ? { ...tab, isLoading: false, url } : tab
      ));
      setUrlInput(url);
    });

    browserService.onSearchSuggestions(({ tabId, suggestions }) => {
      setSearchSuggestions(suggestions);
    });

    browserService.onContentSummary(({ tabId, summary }) => {
      setContentSummary(summary);
    });

    browserService.onLiveContent(({ tabId, content }) => {
      setLiveContent(content);
    });

    browserService.onBookmarkAdded((bookmark) => {
      setBookmarks(prev => [...prev, bookmark]);
    });

    browserService.onDownloadStarted((download) => {
      setDownloads(prev => [...prev, download]);
    });

    browserService.onDownloadProgress(({ downloadId, progress }) => {
      setDownloads(prev => prev.map(d => 
        d.id === downloadId ? { ...d, progress } : d
      ));
    });

    browserService.onDownloadCompleted((download) => {
      setDownloads(prev => prev.map(d => 
        d.id === download.id ? { ...d, status: 'completed' } : d
      ));
    });
  };

  const handleCreateTab = () => {
    const tabId = browserService.createTab();
    setActiveTabId(tabId);
  };

  const handleCloseTab = (tabId: string) => {
    browserService.closeTab(tabId);
  };

  const handleActivateTab = (tabId: string) => {
    browserService.activateTab(tabId);
  };

  const handleNavigate = async () => {
    if (!activeTabId || !urlInput) return;
    
    try {
      await browserService.navigateToUrl(activeTabId, urlInput);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const handleGoBack = () => {
    if (!activeTabId) return;
    browserService.goBack(activeTabId);
  };

  const handleGoForward = () => {
    if (!activeTabId) return;
    browserService.goForward(activeTabId);
  };

  const handleRefresh = () => {
    if (!activeTabId) return;
    browserService.refresh(activeTabId);
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    if (activeTabId) {
      browserService.navigateToUrl(activeTabId, searchUrl);
    }
  };

  const handleVoiceSearch = () => {
    setVoiceSearch(true);
    setIsRecording(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsRecording(false);
      setVoiceSearch(false);
      const recognizedText = "Q-Alpha AI features";
      setSearchQuery(recognizedText);
      handleSearch();
    }, 3000);
  };

  const handleToggleDeveloperTools = () => {
    if (!activeTabId) return;
    browserService.toggleDeveloperTools(activeTabId);
    setDeveloperTools(!developerTools);
  };

  const handleToggleIncognito = () => {
    if (incognitoMode) {
      browserService.disableIncognitoMode();
    } else {
      browserService.enableIncognitoMode();
    }
    setIncognitoMode(!incognitoMode);
  };

  const handleAddBookmark = () => {
    const activeTab = browserService.getActiveTab();
    if (!activeTab) return;
    
    browserService.addBookmark(activeTab.id, activeTab.title, activeTab.url);
  };

  const handleDownloadFile = async (url: string, filename: string) => {
    try {
      await browserService.downloadFile(url, filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleUpdateSettings = (newSettings: any) => {
    browserService.updateSettings(newSettings);
    setSettings({ ...settings, ...newSettings });
  };

  const handleUpdateAIFeature = (featureId: string, updates: any) => {
    browserService.updateAIFeature(featureId, updates);
    setAiFeatures(prev => prev.map(f => 
      f.id === featureId ? { ...f, ...updates } : f
    ));
  };

  const getActiveTab = () => tabs.find(tab => tab.id === activeTabId);

  const renderTab = (tab: BrowserTab) => (
    <div
      key={tab.id}
      className={`flex items-center space-x-2 px-3 py-2 border-b-2 cursor-pointer ${
        tab.isActive ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-100'
      }`}
      onClick={() => handleActivateTab(tab.id)}
    >
      <span className="text-sm">{tab.favicon}</span>
      <span className={`text-sm truncate max-w-32 ${tab.isActive ? 'font-medium' : ''}`}>
        {tab.title}
      </span>
      {tab.isLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          handleCloseTab(tab.id);
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );

  const renderLiveTVContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveContent?.channels.map((channel, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Tv className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">{channel}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Live streaming • {liveContent.quality}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Browser Header */}
      <div className="border-b bg-white">
        {/* Tab Bar */}
        <div className="flex items-center bg-gray-50 border-b">
          <div className="flex items-center space-x-1 px-2 py-1">
            <Button size="sm" variant="ghost" onClick={handleCreateTab}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 flex overflow-x-auto">
            {tabs.map(renderTab)}
          </div>
          <div className="flex items-center space-x-1 px-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleIncognito}
              className={incognitoMode ? 'text-purple-600' : ''}
            >
              {incognitoMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center space-x-2 p-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleGoBack}
            disabled={!getActiveTab()?.canGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleGoForward}
            disabled={!getActiveTab()?.canGoForward}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => browserService.navigateToUrl(activeTabId!, settings.homepage)}>
            <Home className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={urlInputRef}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
              placeholder="Search or enter URL"
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleVoiceSearch}
                className={isRecording ? 'text-red-500 animate-pulse' : ''}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleAddBookmark}>
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleToggleDeveloperTools}>
                <Code className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button size="sm" variant="ghost" onClick={() => setActiveTab('settings')}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="browser">Browser</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="live-tv">Live TV</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="flex-1 p-4">
            <div className="h-full border rounded-lg bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Q-Alpha Browser</h3>
                <p className="text-muted-foreground mb-4">
                  AI-powered browsing experience
                </p>
                <div className="flex items-center space-x-2 justify-center">
                  <Button onClick={() => setActiveTab('search')}>
                    <Search className="h-4 w-4 mr-2" />
                    Start Searching
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('live-tv')}>
                    <Tv className="h-4 w-4 mr-2" />
                    Live TV
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="flex-1 p-4">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">AI-Powered Search</h2>
                <p className="text-muted-foreground">
                  Search with voice, get smart suggestions, and AI summaries
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 pr-20 text-lg py-3"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleVoiceSearch}
                      className={isRecording ? 'text-red-500 animate-pulse' : ''}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={handleSearch}>
                      Search
                    </Button>
                  </div>
                </div>

                {searchSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">AI Suggestions</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start"
                          onClick={() => {
                            setSearchQuery(suggestion);
                            handleSearch();
                          }}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {contentSummary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>AI Content Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{contentSummary}</p>
                    </CardContent>
                  </Card>
                )}

                {securityReport && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Security score: {securityReport.score}/100. 
                      {securityReport.isSafe ? ' Site is safe to visit.' : ' Exercise caution.'}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="live-tv" className="flex-1 p-4">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Live TV & Streaming</h2>
                <p className="text-muted-foreground">
                  Watch live TV, movies, and streaming content with AI recommendations
                </p>
              </div>

              {liveContent ? (
                renderLiveTVContent()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['YouTube Live', 'Twitch', 'Netflix', 'Hulu', 'Disney+', 'Katn TV'].map((service, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                          <Video className="h-5 w-5 text-red-500" />
                          <CardTitle className="text-lg">{service}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                          <Play className="h-12 w-12 text-gray-400" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Click to access {service}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="flex-1 p-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Downloads</h2>
              {downloads.length > 0 ? (
                <div className="space-y-2">
                  {downloads.map((download) => (
                    <Card key={download.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Download className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{download.filename}</p>
                              <p className="text-sm text-muted-foreground">{download.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={download.status === 'completed' ? 'default' : 'secondary'}>
                              {download.status}
                            </Badge>
                            {download.status === 'downloading' && (
                              <Progress value={download.progress} className="w-20" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No downloads</h3>
                  <p className="text-muted-foreground">
                    Your downloads will appear here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="flex-1 p-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Bookmarks</h2>
              {bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <div className="flex-1">
                            <p className="font-medium">{bookmark.title}</p>
                            <p className="text-sm text-muted-foreground">{bookmark.url}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(bookmark.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookmarks</h3>
                  <p className="text-muted-foreground">
                    Your bookmarks will appear here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold">Browser Settings</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Features</CardTitle>
                  <CardDescription>
                    Configure AI-powered browser features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">{feature.name}</Label>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <Switch
                        checked={feature.isEnabled}
                        onCheckedChange={(enabled) => 
                          handleUpdateAIFeature(feature.id, { isEnabled: enabled })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Incognito Mode</Label>
                      <p className="text-sm text-muted-foreground">Browse privately</p>
                    </div>
                    <Switch
                      checked={incognitoMode}
                      onCheckedChange={handleToggleIncognito}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Clear History on Exit</Label>
                      <p className="text-sm text-muted-foreground">Automatically clear browsing history</p>
                    </div>
                    <Switch
                      checked={settings.privacy?.clearHistoryOnExit || false}
                      onCheckedChange={(enabled) => 
                        handleUpdateSettings({ privacy: { ...settings.privacy, clearHistoryOnExit: enabled } })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 