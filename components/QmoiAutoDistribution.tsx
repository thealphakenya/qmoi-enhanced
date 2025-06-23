import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  Globe, 
  Share2, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Download,
  ExternalLink,
  GitBranch,
  Code,
  Package,
  Smartphone,
  Monitor,
  Zap,
  Target,
  Users,
  Eye,
  Heart,
  Star,
  GitCommit,
  GitPullRequest,
  GitMerge,
  GitBranch as GitBranchIcon,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Telegram,
  Mail as MailIcon,
  MessageCircle,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Globe as GlobeIcon,
  Wifi,
  Cloud,
  Database,
  Shield,
  Lock,
  Unlock,
  Key,
  User,
  Settings as SettingsIcon,
  RefreshCw,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  ShoppingCart,
  Tag,
  Hash,
  AtSign,
  Hash as HashIcon,
  Link,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Home,
  Folder,
  File,
  Image,
  Video,
  Music,
  Archive,
  Book,
  Newspaper,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileBook,
  FileNewspaper,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderSearch,
  FolderHeart,
  FolderStar,
  FolderGit2,
  FolderGit,
  FolderKanban,
  FolderSymlink,
  FolderTree,
  FolderUp,
  FolderDown,
  FolderInput,
  FolderOutput,
  FolderRoot,
  FolderSearch2,
  FolderHeart2,
  FolderStar2,
  FolderGit22,
  FolderGit2 as FolderGit22Icon,
  FolderKanban2,
  FolderSymlink2,
  FolderTree2,
  FolderUp2,
  FolderDown2,
  FolderInput2,
  FolderOutput2,
  FolderRoot2,
  FolderSearch3,
  FolderHeart3,
  FolderStar3,
  FolderGit23,
  FolderGit2 as FolderGit23Icon,
  FolderKanban3,
  FolderSymlink3,
  FolderTree3,
  FolderUp3,
  FolderDown3,
  FolderInput3,
  FolderOutput3,
  FolderRoot3
} from 'lucide-react';
import { PlatformDiscoveryService, PlatformCandidate } from '../scripts/services/platform_discovery';
import { AssetGenerationService } from '../scripts/services/asset_generation';
import { AnalyticsOptimizationService, AnalyticsData } from '../scripts/services/analytics_optimization';

interface DistributionPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  lastUpdated?: Date;
}

interface MarketingCampaign {
  id: string;
  name: string;
  platform: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  reach: number;
  engagement: number;
  conversion: number;
  budget: number;
  spent: number;
}

interface AppBuild {
  id: string;
  name: string;
  version: string;
  platform: 'android' | 'ios' | 'web' | 'desktop';
  status: 'building' | 'testing' | 'ready' | 'deployed';
  size: string;
  buildDate: Date;
}

export const QmoiAutoDistribution: React.FC = () => {
  const [isDistributing, setIsDistributing] = useState(false);
  const [isMarketing, setIsMarketing] = useState(false);
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [autoMarketing, setAutoMarketing] = useState(true);
  const [whatsappIntegration, setWhatsappIntegration] = useState(true);
  const [emailAccount] = useState('rovicviccy@gmail.com');
  const [customPlatform, setCustomPlatform] = useState('');
  const [distributionLog, setDistributionLog] = useState<string[]>([]);
  const [platformCandidates, setPlatformCandidates] = useState<PlatformCandidate[]>([]);
  const [approvedPlatforms, setApprovedPlatforms] = useState<PlatformCandidate[]>([]);
  const [assetPreview, setAssetPreview] = useState<{trailer?: string, doc?: string, banner?: string, ad?: string}>({});
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [deal, setDeal] = useState({ price: '', description: '' });
  const [dealLog, setDealLog] = useState<string[]>([]);
  const isMaster = true; // Replace with actual master check logic

  useEffect(() => {
    // Discover new platforms on mount
    PlatformDiscoveryService.discoverPlatforms().then(setPlatformCandidates);
    // Fetch analytics
    AnalyticsOptimizationService.trackAnalytics().then(setAnalytics);
  }, []);

  const approvePlatform = (platform: PlatformCandidate) => {
    setApprovedPlatforms(prev => [...prev, platform]);
    setPlatformCandidates(prev => prev.filter(p => p.url !== platform.url));
    setDistributionLog(prev => [
      `Approved and added platform: ${platform.name} (${platform.url}) at ${new Date().toLocaleString()}`,
      ...prev
    ]);
  };

  const rejectPlatform = (platform: PlatformCandidate) => {
    setPlatformCandidates(prev => prev.filter(p => p.url !== platform.url));
    setDistributionLog(prev => [
      `Rejected platform: ${platform.name} (${platform.url}) at ${new Date().toLocaleString()}`,
      ...prev
    ]);
  };

  const previewAssets = async () => {
    // Simulate a project object
    const project = { name: 'QMOI Example Project' };
    const trailer = await AssetGenerationService.generateTrailer(project);
    const doc = await AssetGenerationService.generateDocumentation(project);
    const banner = await AssetGenerationService.generateBanner(project);
    const ad = await AssetGenerationService.generateAdCopy(project);
    setAssetPreview({ trailer, doc, banner, ad });
  };

  const approveDeal = () => {
    setDealLog(prev => [
      `Approved deal: ${deal.description} at price ${deal.price} on ${new Date().toLocaleString()}`,
      ...prev
    ]);
    setDeal({ price: '', description: '' });
  };

  const distributeToCustomPlatform = () => {
    if (!customPlatform.trim()) return;
    setDistributionLog(prev => [
      `Distributed to custom platform: ${customPlatform} at ${new Date().toLocaleString()}`,
      ...prev
    ]);
    setCustomPlatform('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
              <Upload className="h-8 w-8 text-purple-600" />
              QMOI Auto Distribution & Marketing
            </CardTitle>
            <p className="text-gray-600">Automated app distribution and AI-powered marketing</p>
          </CardHeader>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={startDistribution}
                disabled={isDistributing}
                className="flex items-center gap-2"
                size="lg"
              >
                {isDistributing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {isDistributing ? 'Distributing...' : 'Start Distribution'}
              </Button>

              <Button
                onClick={startMarketing}
                disabled={isMarketing}
                variant="outline"
                className="flex items-center gap-2"
                size="lg"
              >
                {isMarketing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
                {isMarketing ? 'Marketing...' : 'Start Marketing'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>Auto Deploy</span>
                <Switch checked={autoDeploy} onCheckedChange={setAutoDeploy} />
              </div>
              <div className="flex items-center justify-between">
                <span>Auto Marketing</span>
                <Switch checked={autoMarketing} onCheckedChange={setAutoMarketing} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-green-600" />
              Distribution Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platforms.map((platform) => (
                <Card key={platform.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {platform.icon}
                      <span className="font-semibold">{platform.name}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">{platform.status}</span>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <Progress value={platform.progress} className="h-2" />
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Marketing Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">{campaign.platform}</p>
                      </div>
                      <Badge variant="default">{campaign.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Reach</p>
                        <p className="font-semibold">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Engagement</p>
                        <p className="font-semibold">{campaign.engagement.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Conversion</p>
                        <p className="font-semibold">{campaign.conversion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-green-600" />
              WhatsApp Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Auto Share to WhatsApp</span>
              <Switch checked={whatsappIntegration} onCheckedChange={setWhatsappIntegration} />
            </div>
            <Button onClick={deployToWhatsApp} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Send to WhatsApp
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-red-600" />
              Email Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <p>Connected to: {emailAccount}</p>
              <p>Used for: Platform account creation, notifications, and marketing</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">24.5K</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">1.2K</p>
                <p className="text-sm text-gray-600">Downloads</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Heart className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">856</p>
                <p className="text-sm text-gray-600">Likes</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">4.8</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Master Approval for New Platforms */}
        {isMaster && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-blue-600">🔒</span>
                Master Approval: New Platforms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {platformCandidates.length === 0 && <p className="text-sm text-gray-500">No new platforms found.</p>}
              {platformCandidates.map((platform, idx) => (
                <div key={platform.url + idx} className="flex items-center gap-4 border-b py-2">
                  <div className="flex-1">
                    <div className="font-semibold">{platform.name}</div>
                    <div className="text-xs text-gray-500">{platform.url} ({platform.type})</div>
                    <div className="text-xs text-gray-400">{platform.description}</div>
                  </div>
                  <Button onClick={() => approvePlatform(platform)} size="sm" className="bg-green-100 text-green-700">Approve</Button>
                  <Button onClick={() => rejectPlatform(platform)} size="sm" variant="destructive">Reject</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Asset Preview */}
        {isMaster && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-purple-600">🎬</span>
                Asset Preview (Before Distribution)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={previewAssets} className="mb-4">Generate Preview</Button>
              {assetPreview.trailer && <div><Label>Trailer:</Label><video src={assetPreview.trailer} controls className="w-full max-w-md" /></div>}
              {assetPreview.doc && <div><Label>Documentation:</Label><pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{assetPreview.doc}</pre></div>}
              {assetPreview.banner && <div><Label>Banner:</Label><img src={assetPreview.banner} alt="Banner" className="w-full max-w-xs" /></div>}
              {assetPreview.ad && <div><Label>Ad Copy:</Label><div className="bg-gray-50 p-2 rounded text-sm">{assetPreview.ad}</div></div>}
            </CardContent>
          </Card>
        )}

        {/* Deal Management */}
        {isMaster && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-yellow-600">💸</span>
                Deal Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={deal.price}
                  onChange={e => setDeal(d => ({ ...d, price: e.target.value }))}
                  placeholder="Price (e.g. $9.99)"
                />
                <Input
                  value={deal.description}
                  onChange={e => setDeal(d => ({ ...d, description: e.target.value }))}
                  placeholder="Deal Description"
                />
                <Button onClick={approveDeal} disabled={!deal.price || !deal.description}>Approve Deal</Button>
              </div>
              <div className="mt-4">
                <Label>Recent Deals</Label>
                <ul className="text-xs mt-2 space-y-1">
                  {dealLog.map((log, idx) => (
                    <li key={idx}>{log}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Custom Platform Distribution */}
        {isMaster && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-blue-600">🔒</span>
                Master-Only: Custom Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={customPlatform}
                  onChange={e => setCustomPlatform(e.target.value)}
                  placeholder="Enter platform name or URL"
                />
                <Button onClick={distributeToCustomPlatform} disabled={!customPlatform.trim()}>
                  Distribute
                </Button>
              </div>
              <div className="mt-4">
                <Label>Recent Custom Distributions</Label>
                <ul className="text-xs mt-2 space-y-1">
                  {distributionLog.map((log, idx) => (
                    <li key={idx}>{log}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Dashboard */}
        {isMaster && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-purple-600">📊</span>
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {analytics.map((a, idx) => (
                  <div key={a.platform + idx} className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-700">{a.platform}</div>
                    <div className="text-xs text-gray-500">Updated: {a.lastUpdated.toLocaleDateString()}</div>
                    <div className="mt-2 text-sm">Downloads: <span className="font-bold">{a.downloads}</span></div>
                    <div className="text-sm">Views: <span className="font-bold">{a.views}</span></div>
                    <div className="text-sm">Revenue: <span className="font-bold">${a.revenue}</span></div>
                    <div className="text-sm">Engagement: <span className="font-bold">{a.engagement}</span></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QmoiAutoDistribution; 