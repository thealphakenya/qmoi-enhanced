import React, { useState, useEffect } from 'react';
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
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Target,
  Timer,
  Activity,
  Wallet,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Server,
  Database,
  Network,
  Globe,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Timer as TimerIcon,
  Activity as ActivityIcon,
  Wallet as WalletIcon,
  CreditCard as CreditCardIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Network as NetworkIcon,
  Globe as GlobeIcon
} from 'lucide-react';
import { enhancedTradingService } from '../services/EnhancedTradingService';

interface TradingAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  leverage: number;
  marginLevel: number;
  isActive: boolean;
  riskLevel: string;
  maxDrawdown: number;
  dailyPnL: number;
  totalPnL: number;
}

interface TradingPosition {
  id: string;
  symbol: string;
  side: string;
  size: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  margin: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: Date;
  status: string;
}

interface TradingSignal {
  id: string;
  symbol: string;
  action: string;
  confidence: number;
  price: number;
  stopLoss: number;
  takeProfit: number;
  reason: string;
  timestamp: Date;
  strategy: string;
}

export default function EnhancedTradingPanel() {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [positions, setPositions] = useState<TradingPosition[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [riskManagement, setRiskManagement] = useState<any>({});
  const [isTrading, setIsTrading] = useState<boolean>(false);
  const [autoTrading, setAutoTrading] = useState<boolean>(false);
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [orderForm, setOrderForm] = useState({
    symbol: '',
    side: 'buy',
    size: 0.001,
    price: 0,
    stopLoss: 0,
    takeProfit: 0
  });

  useEffect(() => {
    loadTradingData();
    setupEventListeners();
  }, []);

  const loadTradingData = () => {
    setAccounts(enhancedTradingService.getAccounts());
    setPositions(enhancedTradingService.getPositions());
    setSignals(enhancedTradingService.getSignals());
    setMarketData(enhancedTradingService.getMarketData());
    setStrategies(enhancedTradingService.getStrategies());
    setRiskManagement(enhancedTradingService.getRiskManagement());
    setIsTrading(enhancedTradingService.isTradingActive());
    setAutoTrading(enhancedTradingService.isAutoTradingEnabled());
    setAiEnabled(enhancedTradingService.isAIEnabled());
  };

  const setupEventListeners = () => {
    enhancedTradingService.onTradingStarted(() => {
      setIsTrading(true);
    });

    enhancedTradingService.onTradeExecuted(({ position, accountId }) => {
      setPositions(prev => [...prev, position]);
    });

    enhancedTradingService.onSignalGenerated((signal) => {
      setSignals(prev => [signal, ...prev.slice(0, 9)]); // Keep last 10 signals
    });

    enhancedTradingService.onMarketDataUpdate((data) => {
      setMarketData(prev => {
        const existing = prev.find(m => m.symbol === data.symbol);
        if (existing) {
          return prev.map(m => m.symbol === data.symbol ? data : m);
        }
        return [...prev, data];
      });
    });

    enhancedTradingService.onAutoTradingToggled((enabled) => {
      setAutoTrading(enabled);
    });

    enhancedTradingService.onAIToggled((enabled) => {
      setAiEnabled(enabled);
    });

    enhancedTradingService.onRiskManagementUpdated((risk) => {
      setRiskManagement(risk);
    });
  };

  const handleStartTrading = async () => {
    try {
      await enhancedTradingService.startTrading();
    } catch (error) {
      console.error('Failed to start trading:', error);
    }
  };

  const handleExecuteTrade = async () => {
    if (!selectedAccount || !orderForm.symbol) return;

    try {
      const signal: TradingSignal = {
        id: `signal_${Date.now()}`,
        symbol: orderForm.symbol,
        action: orderForm.side,
        confidence: 0.8,
        price: orderForm.price,
        stopLoss: orderForm.stopLoss,
        takeProfit: orderForm.takeProfit,
        reason: 'Manual trade',
        timestamp: new Date(),
        strategy: 'Manual'
      };

      await enhancedTradingService.executeTrade(signal, selectedAccount);
      
      // Reset form
      setOrderForm({
        symbol: '',
        side: 'buy',
        size: 0.001,
        price: 0,
        stopLoss: 0,
        takeProfit: 0
      });
    } catch (error) {
      console.error('Trade execution failed:', error);
    }
  };

  const handleToggleAutoTrading = () => {
    enhancedTradingService.setAutoTrading(!autoTrading);
  };

  const handleToggleAI = () => {
    enhancedTradingService.setAIEnabled(!aiEnabled);
  };

  const handleUpdateRiskManagement = (updates: any) => {
    enhancedTradingService.updateRiskManagement(updates);
  };

  const formatCurrency = (amount: number, currency = 'USDT'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getPnLColor = (pnl: number): string => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'closed': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getActiveAccount = () => accounts.find(acc => acc.id === selectedAccount);

  const renderAccountCard = (account: TradingAccount) => (
    <Card key={account.id} className={`cursor-pointer transition-all ${
      selectedAccount === account.id ? 'ring-2 ring-blue-500' : ''
    }`} onClick={() => setSelectedAccount(account.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              account.type === 'futures' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <Wallet className={`h-5 w-5 ${
                account.type === 'futures' ? 'text-purple-600' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <CardTitle className="text-lg">{account.name}</CardTitle>
              <CardDescription className="text-sm">
                {account.type.toUpperCase()} • {account.currency}
              </CardDescription>
            </div>
          </div>
          <Badge variant={account.isActive ? 'default' : 'secondary'}>
            {account.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="font-semibold">{formatCurrency(account.balance, account.currency)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Leverage</p>
            <p className="font-semibold">{account.leverage}x</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Daily P&L</p>
            <p className={`font-semibold ${getPnLColor(account.dailyPnL)}`}>
              {formatCurrency(account.dailyPnL, account.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <p className={`font-semibold ${getPnLColor(account.totalPnL)}`}>
              {formatCurrency(account.totalPnL, account.currency)}
            </p>
          </div>
        </div>
        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Risk Level</span>
            <span className="capitalize">{account.riskLevel}</span>
          </div>
          <Progress value={account.maxDrawdown * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  const renderPositionCard = (position: TradingPosition) => (
    <Card key={position.id} className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              position.side === 'long' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {position.side === 'long' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{position.symbol}</h3>
              <p className="text-sm text-muted-foreground capitalize">{position.side}</p>
            </div>
          </div>
          <Badge className={getStatusColor(position.status)}>
            {position.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Size</p>
            <p className="font-medium">{position.size}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Entry Price</p>
            <p className="font-medium">{formatCurrency(position.entryPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="font-medium">{formatCurrency(position.currentPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Unrealized P&L</p>
            <p className={`font-medium ${getPnLColor(position.unrealizedPnL)}`}>
              {formatCurrency(position.unrealizedPnL)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {new Date(position.timestamp).toLocaleString()}
          </div>
          <div className="flex items-center space-x-2">
            {position.stopLoss && (
              <Badge variant="outline" className="text-xs">
                SL: {formatCurrency(position.stopLoss)}
              </Badge>
            )}
            {position.takeProfit && (
              <Badge variant="outline" className="text-xs">
                TP: {formatCurrency(position.takeProfit)}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSignalCard = (signal: TradingSignal) => (
    <Card key={signal.id} className="border-l-4 border-l-purple-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              signal.action === 'buy' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {signal.action === 'buy' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{signal.symbol}</h3>
              <p className="text-sm text-muted-foreground capitalize">{signal.action}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(signal.price)}</p>
            <p className="text-sm text-muted-foreground">
              {formatPercentage(signal.confidence)} confidence
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">{signal.reason}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Stop Loss</p>
            <p className="font-medium">{formatCurrency(signal.stopLoss)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Take Profit</p>
            <p className="font-medium">{formatCurrency(signal.takeProfit)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {new Date(signal.timestamp).toLocaleString()}
          </div>
          <Badge variant="outline" className="text-xs">
            {signal.strategy}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Q-Alpha Enhanced Trading</h1>
          <p className="text-muted-foreground">
            AI-powered trading with minimal balance support
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isTrading ? 'destructive' : 'default'}
            onClick={handleStartTrading}
            disabled={isTrading}
          >
            {isTrading ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Trading Active
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Trading
              </>
            )}
          </Button>
          <Button variant="outline" onClick={loadTradingData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {accounts.length} accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  getPnLColor(accounts.reduce((sum, acc) => sum + acc.totalPnL, 0))
                }`}>
                  {formatCurrency(accounts.reduce((sum, acc) => sum + acc.totalPnL, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(accounts.reduce((sum, acc) => sum + acc.totalPnL, 0) / 
                    Math.max(accounts.reduce((sum, acc) => sum + acc.balance, 0), 1))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{positions.filter(p => p.status === 'open').length}</div>
                <p className="text-xs text-muted-foreground">
                  {positions.filter(p => p.status === 'open').reduce((sum, p) => sum + p.unrealizedPnL, 0) >= 0 ? '+' : ''}
                  {formatCurrency(positions.filter(p => p.status === 'open').reduce((sum, p) => sum + p.unrealizedPnL, 0))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Signals</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{signals.length}</div>
                <p className="text-xs text-muted-foreground">
                  {signals.filter(s => s.confidence > 0.7).length} high confidence
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {signals.slice(0, 5).map(renderSignalCard)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {positions.filter(p => p.status === 'open').slice(0, 5).map(renderPositionCard)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(renderAccountCard)}
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <div className="space-y-4">
            {positions.length > 0 ? (
              positions.map(renderPositionCard)
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No positions</h3>
                <p className="text-muted-foreground">
                  Your trading positions will appear here
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <div className="space-y-4">
            {signals.length > 0 ? (
              signals.map(renderSignalCard)
            ) : (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No signals</h3>
                <p className="text-muted-foreground">
                  AI trading signals will appear here
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trade" className="space-y-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Trade</CardTitle>
                <CardDescription>
                  Execute manual trades with minimal balance support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Account</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                      <option value="">Select Account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.name} ({formatCurrency(account.balance, account.currency)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Symbol</Label>
                    <Input
                      placeholder="e.g., BTCUSDT"
                      value={orderForm.symbol}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, symbol: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Side</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={orderForm.side}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, side: e.target.value }))}
                    >
                      <option value="buy">Buy (Long)</option>
                      <option value="sell">Sell (Short)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Size</Label>
                    <Input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="0.001"
                      value={orderForm.size}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, size: parseFloat(e.target.value) || 0.001 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={orderForm.price}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Stop Loss</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={orderForm.stopLoss}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Take Profit</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={orderForm.takeProfit}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleExecuteTrade}
                  disabled={!selectedAccount || !orderForm.symbol}
                >
                  Execute Trade
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Trading</Label>
                    <p className="text-sm text-muted-foreground">Automatically execute AI signals</p>
                  </div>
                  <Switch
                    checked={autoTrading}
                    onCheckedChange={handleToggleAutoTrading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Trading</Label>
                    <p className="text-sm text-muted-foreground">Enable AI-powered trading</p>
                  </div>
                  <Switch
                    checked={aiEnabled}
                    onCheckedChange={handleToggleAI}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Max Position Size (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={riskManagement.maxPositionSize * 100}
                      onChange={(e) => handleUpdateRiskManagement({
                        maxPositionSize: (parseFloat(e.target.value) || 0) / 100
                      })}
                    />
                  </div>
                  <div>
                    <Label>Max Daily Loss (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={riskManagement.maxDailyLoss * 100}
                      onChange={(e) => handleUpdateRiskManagement({
                        maxDailyLoss: (parseFloat(e.target.value) || 0) / 100
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Stop Loss (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={riskManagement.stopLossPercentage * 100}
                      onChange={(e) => handleUpdateRiskManagement({
                        stopLossPercentage: (parseFloat(e.target.value) || 0) / 100
                      })}
                    />
                  </div>
                  <div>
                    <Label>Take Profit (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={riskManagement.takeProfitPercentage * 100}
                      onChange={(e) => handleUpdateRiskManagement({
                        takeProfitPercentage: (parseFloat(e.target.value) || 0) / 100
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 