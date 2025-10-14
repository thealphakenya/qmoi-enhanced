import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  Update,
  Settings,
  Wrench,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  Star,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Info,
  Shield,
  Zap,
} from "lucide-react";
import { appManagementService } from "@/services/AppManagementService";

interface App {
  id: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  category: string;
  icon: string;
  size: number;
  isInstalled: boolean;
  isUpdating: boolean;
  status: string;
  lastUpdate: Date;
}

export default function AppManager() {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [autoGit, setAutoGit] = useState<boolean>(true);
  const [downloadProgress, setDownloadProgress] = useState<
    Record<string, number>
  >({});
  const [installationProgress, setInstallationProgress] = useState<
    Record<string, any>
  >({});
  const [troubleshootingResults, setTroubleshootingResults] = useState<
    Record<string, any>
  >({});
  const [activeTab, setActiveTab] = useState<string>("apps");

  const categories = [
    { id: "all", name: "All Apps", icon: "📱" },
    { id: "trading", name: "Trading", icon: "💰" },
    { id: "communication", name: "Communication", icon: "💬" },
    { id: "entertainment", name: "Entertainment", icon: "🎬" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "development", name: "Development", icon: "💻" },
  ];

  useEffect(() => {
    loadApps();
    setupEventListeners();
  }, []);

  useEffect(() => {
    filterApps();
  }, [apps, selectedCategory, searchQuery]);

  const loadApps = () => {
    const appList = appManagementService.getApps();
    setApps(appList);
  };

  const setupEventListeners = () => {
    appManagementService.onAppStatusChanged(({ appId, status }) => {
      setApps((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status } : app)),
      );
    });

    appManagementService.onDownloadProgress(({ appId, progress, message }) => {
      setDownloadProgress((prev) => ({ ...prev, [appId]: progress }));
    });

    appManagementService.onInstallationProgress((data) => {
      setInstallationProgress((prev) => ({ ...prev, [data.appId]: data }));
    });

    appManagementService.onAppInstalled((app) => {
      setApps((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? { ...a, isInstalled: true, status: "installed" }
            : a,
        ),
      );
    });

    appManagementService.onAppUpdated(({ app, updateInfo }) => {
      setApps((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? { ...a, version: updateInfo.newVersion, isUpdating: false }
            : a,
        ),
      );
    });

    appManagementService.onAppError(({ appId, error }) => {
      console.error(`App error for ${appId}:`, error);
    });

    appManagementService.onUpdateAvailable(({ app, update }) => {
      // Show update notification
      console.log(
        `Update available for ${app.displayName}: v${update.newVersion}`,
      );
    });

    appManagementService.onTroubleshootingCompleted(({ appId, issues }) => {
      setTroubleshootingResults((prev) => ({ ...prev, [appId]: issues }));
    });
  };

  const filterApps = () => {
    let filtered = apps;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((app) => app.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredApps(filtered);
  };

  const handleDownload = async (appId: string) => {
    try {
      await appManagementService.downloadApp(appId);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleUpdate = async (appId: string) => {
    try {
      await appManagementService.updateApp(appId);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleTroubleshoot = async (appId: string) => {
    try {
      await appManagementService.troubleshootApp(appId);
    } catch (error) {
      console.error("Troubleshooting failed:", error);
    }
  };

  const handleAutoGitToggle = (enabled: boolean) => {
    setAutoGit(enabled);
    appManagementService.setAutoGitEnabled(enabled);
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "installed":
        return "bg-green-500";
      case "downloading":
        return "bg-blue-500";
      case "installing":
        return "bg-yellow-500";
      case "updating":
        return "bg-purple-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "installed":
        return "Installed";
      case "downloading":
        return "Downloading";
      case "installing":
        return "Installing";
      case "updating":
        return "Updating";
      case "error":
        return "Error";
      default:
        return "Available";
    }
  };

  const renderAppCard = (app: App) => (
    <Card key={app.id} className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{app.icon}</div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Q-Alpha {app.displayName}
              </CardTitle>
              <CardDescription className="text-sm">
                v{app.version} • {formatFileSize(app.size)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(app.status)}>
              {getStatusText(app.status)}
            </Badge>
            {app.isInstalled && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdate(app.id)}
              >
                <Update className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{app.description}</p>

        {downloadProgress[app.id] !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Downloading...</span>
              <span>{downloadProgress[app.id]}%</span>
            </div>
            <Progress value={downloadProgress[app.id]} className="h-2" />
          </div>
        )}

        {installationProgress[app.id] && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{installationProgress[app.id].message}</span>
              <span>{installationProgress[app.id].progress}%</span>
            </div>
            <Progress
              value={installationProgress[app.id].progress}
              className="h-2"
            />
          </div>
        )}

        {troubleshootingResults[app.id] && (
          <Alert>
            <Wrench className="h-4 w-4" />
            <AlertDescription>
              Found {troubleshootingResults[app.id].length} issues.
              {troubleshootingResults[app.id].some(
                (issue: any) => issue.severity === "high",
              ) && " High priority issues detected."}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {app.isInstalled ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTroubleshoot(app.id)}
              >
                <Wrench className="h-4 w-4 mr-1" />
                Troubleshoot
              </Button>
            ) : (
              <Button size="sm" onClick={() => handleDownload(app.id)}>
                <Download className="h-4 w-4 mr-1" />
                Install
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Button size="sm" variant="ghost">
              <Info className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAppList = (app: App) => (
    <div
      key={app.id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="text-2xl">{app.icon}</div>
        <div>
          <h3 className="font-semibold">Q-Alpha {app.displayName}</h3>
          <p className="text-sm text-muted-foreground">{app.description}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className="text-xs">
              v{app.version}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatFileSize(app.size)}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(app.status)}`}>
              {getStatusText(app.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {app.isInstalled ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpdate(app.id)}
            >
              <Update className="h-4 w-4 mr-1" />
              Update
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTroubleshoot(app.id)}
            >
              <Wrench className="h-4 w-4 mr-1" />
              Fix
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => handleDownload(app.id)}>
            <Download className="h-4 w-4 mr-1" />
            Install
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Q-Alpha App Manager</h1>
          <p className="text-muted-foreground">
            Manage, install, and update Q-Alpha applications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadApps}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="apps">Apps</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="apps" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Apps Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map(renderAppCard)}
            </div>
          ) : (
            <div className="space-y-4">{filteredApps.map(renderAppList)}</div>
          )}

          {filteredApps.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">No apps found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="updates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Update className="h-5 w-5" />
                <span>Available Updates</span>
              </CardTitle>
              <CardDescription>
                Apps with available updates will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apps
                  .filter(
                    (app) => app.isInstalled && app.status === "available",
                  )
                  .map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{app.icon}</div>
                        <div>
                          <h3 className="font-semibold">
                            Q-Alpha {app.displayName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Current: v{app.version}
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => handleUpdate(app.id)}>
                        <Update className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  ))}

                {apps.filter(
                  (app) => app.isInstalled && app.status === "available",
                ).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      All apps are up to date!
                    </h3>
                    <p className="text-muted-foreground">
                      Your Q-Alpha apps are running the latest versions
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>App Troubleshooting</span>
              </CardTitle>
              <CardDescription>
                Diagnose and fix issues with installed apps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apps
                  .filter((app) => app.isInstalled)
                  .map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{app.icon}</div>
                        <div>
                          <h3 className="font-semibold">
                            Q-Alpha {app.displayName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            v{app.version}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleTroubleshoot(app.id)}
                      >
                        <Wrench className="h-4 w-4 mr-1" />
                        Troubleshoot
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>App Manager Settings</span>
              </CardTitle>
              <CardDescription>
                Configure app management preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-update apps</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically download and install app updates
                    </p>
                  </div>
                  <Switch
                    checked={autoUpdate}
                    onCheckedChange={setAutoUpdate}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Git commits</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically commit app changes to Git repository
                    </p>
                  </div>
                  <Switch
                    checked={autoGit}
                    onCheckedChange={handleAutoGitToggle}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Q-Alpha branding</Label>
                    <p className="text-sm text-muted-foreground">
                      All apps are branded as Q-Alpha applications
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
