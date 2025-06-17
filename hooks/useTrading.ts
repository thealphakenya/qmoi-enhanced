import { useState, useEffect, useCallback } from 'react';
import { TradingService } from '../lib/trading-service';
import { Trade, TradingStrategy, WalletTransaction, TradingStats } from '../types/trading';

export function useTrading() {
  const [tradingService] = useState(() => new TradingService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeStrategies, setActiveStrategies] = useState<TradingStrategy[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<WalletTransaction[]>([]);
  const [tradingStats, setTradingStats] = useState<TradingStats>({
    analytics: {
      totalTrades: 0,
      successRate: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0
    },
    trades: []
  });

  useEffect(() => {
    const init = async () => {
      try {
        await tradingService.initialize();
        setIsInitialized(true);
        updateState();
      } catch (error) {
        console.error('Failed to initialize trading service:', error);
      }
    };

    init();
  }, [tradingService]);

  const updateState = useCallback(() => {
    setActiveStrategies(tradingService.getActiveStrategies());
    setTransactionHistory(tradingService.getTransactionHistory());
  }, [tradingService]);

  const executeTrade = useCallback(async (trade: Trade) => {
    try {
      const success = await tradingService.executeTrade(trade);
      if (success) {
        updateState();
      }
      return success;
    } catch (error) {
      console.error('Failed to execute trade:', error);
      return false;
    }
  }, [tradingService, updateState]);

  const updateStrategy = useCallback(async (strategyId: string, updates: Partial<TradingStrategy>) => {
    try {
      // Implement strategy update logic
      updateState();
    } catch (error) {
      console.error('Failed to update strategy:', error);
    }
  }, [tradingService, updateState]);

  return {
    isInitialized,
    activeStrategies,
    transactionHistory,
    tradingStats,
    executeTrade,
    updateStrategy
  };
} 