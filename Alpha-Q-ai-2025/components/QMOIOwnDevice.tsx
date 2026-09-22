import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Shield, 
  Unlock, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Smartphone,
  Wifi,
  CreditCard,
  MapPin,
  Eye,
  Settings,
  Crown,
  Zap,
  Target,
  ArrowRight,
  RefreshCw,
  Play,
  Stop,
  RotateCcw
} from 'lucide-react';

interface DeviceRestriction {
  type: 'mkopa' | 'watu' | 'carrier' | 'mdm' | 'payment' | 'location' | 'app' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  organization: string;
  restrictions: string[];
  unlockMethods: string[];
}

interface UnlockResult {
  success: boolean;
  message: string;
  methodUsed: string;
  durationSeconds: number;
  errors: string[];
  warnings: string[];
}

interface QMOIOwnDeviceProps {
  detectedRestrictions: DeviceRestriction[];
  onUnlockAttempt: (restriction: DeviceRestriction) => Promise<UnlockResult>;
  onMasterMode: () => Promise<UnlockResult>;
  onRefreshDetection: () => Promise<DeviceRestriction[]>;
}

const QMOIOwnDevice: React.FC<QMOIOwnDeviceProps> = ({
  detectedRestrictions,
  onUnlockAttempt,
  onMasterMode,
  onRefreshDetection
}) => {
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [unlockResults, setUnlockResults] = useState<UnlockResult[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [autoDetection, setAutoDetection] = useState(true);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);

  // Auto-detection effect
  useEffect(() => {
    if (autoDetection) {
      const interval = setInterval(async () => {
        setIsDetecting(true);
        try {
          await onRefreshDetection();
        } catch (error) {
          console.error('Auto-detection failed:', error);
        } finally {
          setIsDetecting(false);
        }
      }, 300000); // Check every 5 minutes
      
      setDetectionInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (detectionInterval) {
        clearInterval(detectionInterval);
        setDetectionInterval(null);
      }
    }
  }, [autoDetection, onRefreshDetection]);

  const handleQMOIOwnDevice = async () => {
    setIsUnlocking(true);
    setUnlockProgress(0);
    setCurrentStep('🔍 Analyzing device restrictions...');
    setUnlockResults([]);

    try {
      // Step 1: Analyze restrictions
      setCurrentStep('📋 Detected restrictions:');
      detectedRestrictions.forEach((restriction, index) => {
        setCurrentStep(prev => prev + `\n- ${restriction.organization}: ${restriction.description}`);
      });
      setUnlockProgress(10);

      // Step 2: Attempt automatic unlock for each restriction
      setCurrentStep('🔓 Attempting automatic unlock...');
      const results: UnlockResult[] = [];
      
      for (const restriction of detectedRestrictions) {
        setCurrentStep(`🔓 Unlocking ${restriction.organization} restrictions...`);
        const result = await onUnlockAttempt(restriction);
        results.push(result);
        setUnlockProgress(prev => prev + (40 / detectedRestrictions.length));
      }
      
      setUnlockResults(results);

      // Step 3: Enable master mode
      setCurrentStep('👑 Enabling QMOI master mode...');
      const masterResult = await onMasterMode();
      results.push(masterResult);
      setUnlockProgress(90);

      // Step 4: Final verification
      setCurrentStep('✅ Verifying device freedom...');
      setUnlockProgress(100);
      
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        setCurrentStep('🎉 Device successfully liberated! QMOI now has full control.');
      } else {
        setCurrentStep(`⚠️ Partial success: ${successCount}/${totalCount} unlock attempts succeeded.`);
      }

    } catch (error) {
      setCurrentStep(`❌ Unlock failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleRefreshDetection = async () => {
    setIsDetecting(true);
    try {
      await onRefreshDetection();
    } catch (error) {
      console.error('Manual detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRestrictionIcon = (type: string) => {
    switch (type) {
      case 'mkopa': return <CreditCard className="w-4 h-4" />;
      case 'watu': return <CreditCard className="w-4 h-4" />;
      case 'carrier': return <Wifi className="w-4 h-4" />;
      case 'mdm': return <Settings className="w-4 h-4" />;
      case 'payment': return <CreditCard className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'app': return <Smartphone className="w-4 h-4" />;
      case 'network': return <Wifi className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getUnlockMethodIcon = (method: string) => {
    switch (method) {
      case 'remove_device_admin': return <Unlock className="w-4 h-4" />;
      case 'clear_policies': return <Settings className="w-4 h-4" />;
      case 'bypass_payment_lock': return <CreditCard className="w-4 h-4" />;
      case 'remove_app_restrictions': return <Smartphone className="w-4 h-4" />;
      case 'network_unlock': return <Wifi className="w-4 h-4" />;
      case 'location_unlock': return <MapPin className="w-4 h-4" />;
      case 'master_mode': return <Crown className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="qmoi-own-device-panel space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            QMOI Own Device
          </CardTitle>
          <CardDescription>
            Advanced device liberation system for organizational restrictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Auto-detection toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Auto-detection</span>
            </div>
            <Button
              variant={autoDetection ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoDetection(!autoDetection)}
            >
              {autoDetection ? "Enabled" : "Disabled"}
            </Button>
          </div>

          {/* Detection status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isDetecting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Target className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isDetecting ? "Detecting..." : "Detection Status"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshDetection}
              disabled={isDetecting}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Restrictions detected */}
          {detectedRestrictions.length > 0 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{detectedRestrictions.length}</strong> device restriction(s) detected
              </AlertDescription>
            </Alert>
          )}

          {/* Restrictions list */}
          {detectedRestrictions.length > 0 && (
            <div className="space-y-3 mb-4">
              <h3 className="text-sm font-medium">Detected Restrictions:</h3>
              {detectedRestrictions.map((restriction, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getRestrictionIcon(restriction.type)}
                      <span className="font-medium">{restriction.organization}</span>
                      <Badge className={getSeverityColor(restriction.severity)}>
                        {restriction.severity}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {restriction.detectedAt.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{restriction.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {restriction.restrictions.map((r, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* QMOI Own Device button */}
          {detectedRestrictions.length > 0 && (
            <Button
              onClick={handleQMOIOwnDevice}
              disabled={isUnlocking}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              {isUnlocking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  🔓 QMOI Own Device
                </>
              )}
            </Button>
          )}

          {/* No restrictions detected */}
          {detectedRestrictions.length === 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                No device restrictions detected. Your device is free! 🎉
              </AlertDescription>
            </Alert>
          )}

          {/* Unlock progress */}
          {isUnlocking && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unlock Progress</span>
                <span className="text-sm text-gray-500">{unlockProgress}%</span>
              </div>
              <Progress value={unlockProgress} className="w-full" />
              <p className="text-sm text-gray-600">{currentStep}</p>
            </div>
          )}

          {/* Unlock results */}
          {unlockResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Unlock Results</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </Button>
              </div>
              
              {showDetails && (
                <div className="space-y-2">
                  {unlockResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium">{result.methodUsed}</span>
                        <span className="text-xs text-gray-500">
                          ({result.durationSeconds.toFixed(1)}s)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                      
                      {result.errors.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-red-600">Errors:</p>
                          <ul className="text-xs text-red-600 list-disc list-inside">
                            {result.errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.warnings.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-yellow-600">Warnings:</p>
                          <ul className="text-xs text-yellow-600 list-disc list-inside">
                            {result.warnings.map((warning, i) => (
                              <li key={i}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Summary */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Summary:</span>
                <span className="text-sm">
                  {unlockResults.filter(r => r.success).length}/{unlockResults.length} successful
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            Master Controls
          </CardTitle>
          <CardDescription>
            Advanced device control and management features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Monitor Device
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Device Settings
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Device
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Performance Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QMOIOwnDevice; 