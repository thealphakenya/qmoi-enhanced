"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { appManagementService } from "@/services/AppManagementService";
import {
  Download,
  RefreshCw,
  Wrench,
  Info,
  MoreVertical,
  Search,
  Grid,
  List,
  CheckCircle,
} from "lucide-react";
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
  lastUpdate: string | Date;
  hasUpdate?: boolean;
}
const AppManager: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [installationProgress, setInstallationProgress] = useState<Record<string, { progress: number; message: string }>>({});
  const [troubleshootingResults, setTroubleshootingResults] = useState<Record<string, Array<{ issue: string; severity: string }>>>({});
  const [activeTab, setActiveTab] = useState<string>("apps");
  const categories = [
    { id: "all", name: "All Apps", icon: "📱" },
    { id: "trading", name: "Trading", icon: "💰" },
    { id: "communication", name: "Communication", icon: "💬" },
    { id: "entertainment", name: "Entertainment", icon: "🎬" },
    { id: "security", name: "Security", icon: "🔒" },
  ];
  useEffect(() => {
    loadApps();
  }, []);
  useEffect(() => {
    filterApps();
  }, [apps, selectedCategory, searchQuery]);
  const loadApps = () => {
    const appList = appManagementService.getApps();
    setApps(appList);
  };
  const setupEventListeners = () => {
    if (typeof appManagementService.onAppStatusChanged === "function") {
      appManagementService.onAppStatusChanged(({ appId, status }) => {
        setApps((prev) =>
          prev.map((app) =>
            app.id === appId ? { ...app, status } : app,
          ),
        );
      });
    }
    if (typeof appManagementService.onDownloadProgress === "function") {
      appManagementService.onDownloadProgress(({ appId, progress }) => {
        setDownloadProgress((prev) => ({ ...prev, [appId]: progress }));
      });
    }
    if (typeof appManagementService.onInstallationProgress === "function") {
      appManagementService.onInstallationProgress((data) => {
        setInstallationProgress((prev) => ({ ...prev, [data.appId]: data }));
      });
    }
    if (typeof appManagementService.onAppInstalled === "function") {
      appManagementService.onAppInstalled((app) => {
        setApps((prev) =>
          prev.map((item) =>
            item.id === app.id
              ? { ...item, isInstalled: true, status: "installed" }
              : item,
          ),
        );
      });
    }
    if (typeof appManagementService.onAppUpdated === "function") {
      appManagementService.onAppUpdated(({ app, updateInfo }) => {
        setApps((prev) =>
          prev.map((item) =>
            item.id === app.id
              ? {
                  ...item,
                  version: updateInfo.newVersion,
                  isUpdating: false,
                }
              : item,
          ),
        );
      });
    }
    if (typeof appManagementService.onTroubleshootingCompleted === "function") {
      appManagementService.onTroubleshootingCompleted(({ appId, issues }) => {
        const normalizedIssues: Array<{ issue: string; severity: string }> = Array.isArray(issues)
          ? issues.filter(
              (item): item is { issue: string; severity: string } =>
                typeof item === "object" &&
                item !== null &&
                typeof (item as any).issue === "string" &&
                typeof (item as any).severity === "string",
            )
          : [];
        setTroubleshootingResults((prev) => ({ ...prev, [appId]: normalizedIssues }));
      });
    }
  };
  const filterApps = () => {
    let filtered = [...apps];
    if (selectedCategory !== "all") {
      filtered = filtered.filter((app) => app.category === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.displayName.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query),
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
  const formatFileSize = (bytes: number): string => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
  };
  const getStatusColor = (status: string) => {
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
  const getStatusText = (status: string) => {
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
        return "Unknown";
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
                Q-latest {app.displayName}
              </CardTitle>
              <CardDescription className="text-sm">
                v{app.version} • {formatFileSize(app.size)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`rounded-full px-2 py-1 text-xs ${getStatusColor(app.status)}`}>
              {getStatusText(app.status)}
            </Badge>
            {app.isInstalled && (
              <Button size="sm" variant="outline" onClick={() => handleUpdate(app.id)}>
                <RefreshCw className="h-4 w-4" />
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
              <span>Downloading</span>
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
            <Progress value={installationProgress[app.id].progress} className="h-2" />
          </div>
        )}
        {troubleshootingResults[app.id] && troubleshootingResults[app.id].length > 0 && (
          <Alert>
            <AlertDescription>
              Found {troubleshootingResults[app.id].length} issues.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {app.isInstalled ? (
              <Button size="sm" variant="outline" onClick={() => handleTroubleshoot(app.id)}>
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
    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="text-2xl">{app.icon}</div>
        <div>
          <h3 className="font-semibold">Q-latest {app.displayName}</h3>
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
            <Button size="sm" variant="outline" onClick={() => handleUpdate(app.id)}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Update
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleTroubleshoot(app.id)}>
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
  const updateApps = apps.filter(
    (app) => app.isInstalled && (app.status === "update-available" || app.hasUpdate),
  );
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Q-latest App Manager</h1>
          <p className="text-muted-foreground">
            Manage, install, and update Q-latest applications
          </p>
        </div>
        <Button variant="outline" onClick={loadApps}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 gap-2">
          <TabsTrigger value="apps">Apps</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="apps" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search apps"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
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
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">No apps found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map(renderAppCard)}
            </div>
          ) : (
            <div className="space-y-4">{filteredApps.map(renderAppList)}</div>
          )}
        </TabsContent>
        <TabsContent value="updates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>App updates</span>
              </CardTitle>
              <CardDescription>Review available updates for installed apps.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {updateApps.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All apps are up to date!</h3>
                    <p className="text-muted-foreground">
                      Your Q-latest apps are running the latest versions.
                    </p>
                  </div>
                ) : (
                  updateApps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{app.icon}</div>
                        <div>
                          <h3 className="font-semibold">Q-latest {app.displayName}</h3>
                          <p className="text-sm text-muted-foreground">Current: v{app.version}</p>
                        </div>
                      </div>
                      <Button onClick={() => handleUpdate(app.id)}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>Inspect recent app issues and resolve them quickly.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apps.filter((app) => troubleshootingResults[app.id]?.length > 0).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No troubleshooting issues detected.</p>
                  </div>
                ) : (
                  apps
                    .filter((app) => troubleshootingResults[app.id]?.length > 0)
                    .map((app) => (
                      <Alert key={app.id}>
                        <AlertDescription>
                          {app.displayName} has {troubleshootingResults[app.id]?.length ?? 0} open issues.
                        </AlertDescription>
                      </Alert>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure app manager behavior and auto-update preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Auto update</h3>
                  <p className="text-sm text-muted-foreground">Automatically download and install updates for installed apps.</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Auto Git sync</h3>
                  <p className="text-sm text-muted-foreground">Keep QMOI application configuration synced with Git.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AppManager;
