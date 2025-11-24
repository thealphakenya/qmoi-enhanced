import { useState, useEffect } from 'react';

interface TradingStatus {
  isActive: boolean;
  lastTrade: {
    timestamp: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    profit?: number;
  } | null;
  stats: {
    totalTrades: number;
    successRate: number;
    totalProfit: number;
    averageProfit: number;
  };
  settings: {
    autoTrade: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    maxTradeAmount: number;
    stopLoss: number;
    takeProfit: number;
  };
}

export function useTradingAutomation() {
  const [status, setStatus] = useState<TradingStatus>({
    isActive: false,
    lastTrade: null,
    stats: {
      totalTrades: 0,
      successRate: 0,
      totalProfit: 0,
      averageProfit: 0
    },
    settings: {
      autoTrade: false,
      riskLevel: 'medium',
      maxTradeAmount: 100,
      stopLoss: 5,
      takeProfit: 10
    }
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/trading/status');
        if (!res.ok) throw new Error('Failed to fetch trading status');
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch trading status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateSettings = async (newSettings: Partial<TradingStatus['settings']>) => {
    try {
      const res = await fetch('/api/trading/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (!res.ok) throw new Error('Failed to update trading settings');
      const data = await res.json();
      setStatus(prev => ({ ...prev, settings: { ...prev.settings, ...data } }));
    } catch (error) {
      console.error('Failed to update trading settings:', error);
    }
  };

  const toggleAutoTrade = async () => {
    try {
      const res = await fetch('/api/trading/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: !status.isActive })
      });
      if (!res.ok) throw new Error('Failed to toggle auto-trading');
      const data = await res.json();
      setStatus(prev => ({ ...prev, isActive: data.isActive }));
    } catch (error) {
      console.error('Failed to toggle auto-trading:', error);
    }
  };

  return {
    status,
    updateSettings,
    toggleAutoTrade
  };
}