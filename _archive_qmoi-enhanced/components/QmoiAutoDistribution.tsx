import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import {
  Upload,
  Globe,
  MessageSquare,
  Mail,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw,
  CheckCircle,
  Download,
  ExternalLink,
  Eye,
  Heart,
  Star,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Cloud,
  Rocket,
  Code,
  Terminal,
  Shield,
  Zap
} from 'lucide-react';
import { PlatformDiscoveryService } from '../scripts/services/platform_discovery';
import { AssetGenerationService } from '../scripts/services/asset_generation';
import { AnalyticsOptimizationService } from '../scripts/services/analytics_optimization';
import axios from 'axios';

export const QmoiAutoDistribution: React.FC = () => {
  const [isDistributing, setIsDistributing] = useState(false);
  const [isMarketing, setIsMarketing] = useState(false);
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [autoMarketing, setAutoMarketing] = useState(true);
  const [whatsappIntegration, setWhatsappIntegration] = useState(true);
  const [emailAccount] = useState('rovicviccy@gmail.com');
  const [customPlatform, setCustomPlatform] = useState('');
  const [distributionLog, setDistributionLog] = useState<string[]>([]);
  const [platformCandidates, setPlatformCandidates] = useState<any[]>([]);
  const [assetPreview, setAssetPreview] = useState<{trailer?: string, doc?: string, banner?: string, ad?: string}>({});
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [deal, setDeal] = useState({ price: '', description: '' });
  const [dealLog, setDealLog] = useState<string[]>([]);
  const [autoFixLoading, setAutoFixLoading] = useState(false);
  const [autoFixResult, setAutoFixResult] = useState<any>(null);
  const [autoFixError, setAutoFixError] = useState<string | null>(null);
  
  // GitHub Integration State
  const [gitStatus, setGitStatus] = useState<any>(null);
  const [gitLoading, setGitLoading] = useState(false);
  const [gitBranch, setGitBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('');
  const [prTitle, setPrTitle] = useState('');
  const [prDescription, setPrDescription] = useState('');
  
  // Vercel Deployment State
  const [vercelStatus, setVercelStatus] = useState<any>(null);
  const [vercelLoading, setVercelLoading] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [autoRedeploy, setAutoRedeploy] = useState(true);
  
  // Permissions State
  const [hasGitHubAccess, setHasGitHubAccess] = useState(true);
  const [hasVercelAccess, setHasVercelAccess] = useState(true);
  const [hasDeployPermissions, setHasDeployPermissions] = useState(true);
  
  const isMaster = true; // Replace with actual master check logic

  useEffect(() => {
    // Discover new platforms on mount
    PlatformDiscoveryService.discoverPlatforms().then(setPlatformCandidates);
    // Fetch analytics
    AnalyticsOptimizationService.trackAnalytics().then(setAnalytics);
    // Fetch Git status
    fetchGitStatus();
    // Fetch Vercel status
    fetchVercelStatus();
  }, []);

  const fetchGitStatus = async () => {
    try {
      const response = await axios.get('/api/git/status');
      setGitStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch Git status:', error);
    }
  };

  const fetchVercelStatus = async () => {
    try {
      const response = await axios.get('/api/deployment-status');
      setVercelStatus(response.data);
      if (response.data.url) {
        setDeploymentUrl(response.data.url);
      }
    } catch (error) {
      console.error('Failed to fetch Vercel status:', error);
    }
  };

  const handleGitCommit = async () => {
    if (!commitMessage.trim()) return;
    setGitLoading(true);
    try {
      const response = await axios.post('/api/git/commit', {
        message: commitMessage,
        files: ['*'] // Commit all changes
      });
      setCommitMessage('');
      await fetchGitStatus();
      setDistributionLog(prev => [
        `Git commit: ${response.data.commitId} at ${new Date().toLocaleString()}`,
        ...prev
      ]);
    } catch (error: any) {
      console.error('Git commit failed:', error);
    } finally {
      setGitLoading(false);
    }
  };

  const handleGitPush = async () => {
    setGitLoading(true);
    try {
      const response = await axios.post('/api/git/push', {
        branch: gitBranch
      });
      await fetchGitStatus();
      setDistributionLog(prev => [
        `Git push to ${gitBranch} at ${new Date().toLocaleString()}`,
        ...prev
      ]);
    } catch (error: any) {
      console.error('Git push failed:', error);
    } finally {
      setGitLoading(false);
    }
  };

  const handleCreatePR = async () => {
    if (!prTitle.trim()) return;
    setGitLoading(true);
    try {
      const response = await axios.post('/api/git/pr', {
        title: prTitle,
        description: prDescription,
        baseBranch: 'main',
        headBranch: gitBranch
      });
      setPrTitle('');
      setPrDescription('');
      setDistributionLog(prev => [
        `Created PR: ${response.data.prNumber} at ${new Date().toLocaleString()}`,
        ...prev
      ]);
    } catch (error: any) {
      console.error('PR creation failed:', error);
    } finally {
      setGitLoading(false);
    }
  };

  const handleVercelDeploy = async () => {
    setVercelLoading(true);
    try {
      const response = await axios.post('/api/deploy', {
        platform: 'vercel',
        autoRedeploy
      });
      setVercelStatus(response.data);
      if (response.data.url) {
        setDeploymentUrl(response.data.url);
      }
      setDistributionLog(prev => [
        `Vercel deployment: ${response.data.deploymentId} at ${new Date().toLocaleString()}`,
        ...prev
      ]);
    } catch (error: any) {
      console.error('Vercel deployment failed:', error);
    } finally {
      setVercelLoading(false);
    }
  };

  const handleAutoRedeploy = async () => {
    setVercelLoading(true);
    try {
      const response = await axios.post('/api/deploy/auto-redeploy', {
        enabled: autoRedeploy
      });
      setDistributionLog(prev => [
        `Auto-redeploy ${autoRedeploy ? 'enabled' : 'disabled'} at ${new Date().toLocaleString()}`,
        ...prev
      ]);
    } catch (error: any) {
      console.error('Auto-redeploy toggle failed:', error);
    } finally {
      setVercelLoading(false);
    }
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

  const startDistribution = () => { setIsDistributing(true); setTimeout(() => setIsDistributing(false), 1000); };
  const startMarketing = () => { setIsMarketing(true); setTimeout(() => setIsMarketing(false), 1000); };
  const deployToWhatsApp = () => { alert('Deployed to WhatsApp!'); };

  const handleAutoFix = async () => {
    setAutoFixLoading(true);
    setAutoFixResult(null);
    setAutoFixError(null);
    try {
      const res = await axios.post('/api/auto-fix');
      setAutoFixResult(res.data);
    } catch (err: any) {
      setAutoFixError(err.message || 'Auto-fix failed');
    } finally {
      setAutoFixLoading(false);
    }
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
            <p className="text-gray-600">Automated app distribution, deployment, and AI-powered marketing</p>
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
              {platformCandidates.map((platform) => (
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
                  <Button size="sm" className="bg-green-100 text-green-700">Approve</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
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

        {/* Auto Fix Errors */}
        {isMaster && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-red-600">🛠️</span>
                Master: Auto Fix Errors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleAutoFix} disabled={autoFixLoading} className="mb-2">
                {autoFixLoading ? 'Auto-fixing...' : 'Auto Fix Errors'}
              </Button>
              {autoFixError && <div className="text-red-600">{autoFixError}</div>}
              {autoFixResult && (
                <div className="bg-gray-50 p-2 rounded text-xs max-h-64 overflow-y-auto">
                  <div><b>Fixed Issues:</b> {autoFixResult.fixedIssues}</div>
                  <div><b>Remaining Issues:</b> {autoFixResult.remainingIssues}</div>
                  <div><b>Logs:</b><pre>{autoFixResult.logs}</pre></div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* GitHub Integration */}
        {isMaster && hasGitHubAccess && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-6 w-6 text-green-600" />
                GitHub Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current Branch</Label>
                  <Input
                    value={gitBranch}
                    onChange={(e) => setGitBranch(e.target.value)}
                    placeholder="main"
                  />
                </div>
                <div>
                  <Label>Commit Message</Label>
                  <Input
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="feat: auto-deploy updates"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleGitCommit}
                  disabled={gitLoading || !commitMessage.trim()}
                  className="flex items-center gap-2"
                >
                  <GitCommit className="h-4 w-4" />
                  Commit
                </Button>
                <Button
                  onClick={handleGitPush}
                  disabled={gitLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Push
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>PR Title</Label>
                  <Input
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    placeholder="Auto-deploy feature"
                  />
                </div>
                <div>
                  <Label>PR Description</Label>
                  <Input
                    value={prDescription}
                    onChange={(e) => setPrDescription(e.target.value)}
                    placeholder="Automated deployment updates"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleCreatePR}
                disabled={gitLoading || !prTitle.trim()}
                className="flex items-center gap-2"
              >
                <GitPullRequest className="h-4 w-4" />
                Create PR
              </Button>

              {gitStatus && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm">
                    <div><strong>Status:</strong> {gitStatus.status}</div>
                    <div><strong>Last Commit:</strong> {gitStatus.lastCommit}</div>
                    <div><strong>Branch:</strong> {gitStatus.currentBranch}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Vercel Deployment */}
        {isMaster && hasVercelAccess && hasDeployPermissions && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-6 w-6 text-blue-600" />
                Vercel Deployment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span>Auto Redeploy</span>
                  <Switch checked={autoRedeploy} onCheckedChange={setAutoRedeploy} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Production Ready</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleVercelDeploy}
                  disabled={vercelLoading}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  {vercelLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Rocket className="h-4 w-4" />
                  )}
                  {vercelLoading ? 'Deploying...' : 'Deploy to Vercel'}
                </Button>
                <Button
                  onClick={handleAutoRedeploy}
                  disabled={vercelLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Toggle Auto-Redeploy
                </Button>
              </div>

              {deploymentUrl && (
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm">
                    <div><strong>Live URL:</strong></div>
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {deploymentUrl}
                    </a>
                  </div>
                </div>
              )}

              {vercelStatus && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm">
                    <div><strong>Status:</strong> {vercelStatus.status}</div>
                    <div><strong>Last Deploy:</strong> {vercelStatus.lastDeploy}</div>
                    <div><strong>Environment:</strong> {vercelStatus.environment}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QmoiAutoDistribution; 