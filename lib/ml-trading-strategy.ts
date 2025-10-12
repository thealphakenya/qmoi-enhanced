import { TradingStrategy } from '../types/trading';
import * as tf from '@tensorflow/tfjs';
import { MarketData, OrderBook } from '../types/trading';

export class MLTradingStrategy implements TradingStrategy {
  private model: tf.LayersModel;
  private isModelLoaded: boolean = false;
  private predictionThreshold: number = 0.7;
  private confidenceThreshold: number = 0.8;
  private maxPositionSize: number = 0.1;
  private stopLoss: number = 0.02;
  private takeProfit: number = 0.04;

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      // Load pre-trained model or create new one
      this.model = await tf.loadLayersModel('indexeddb://trading-model');
      this.isModelLoaded = true;
    } catch (error) {
      console.error('Failed to load model, creating new one:', error);
      this.createNewModel();
    }
  }

  private createNewModel() {
    // Create a new model architecture
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 64,
          returnSequences: true,
          inputShape: [60, 10] // 60 time steps, 10 features
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({
          units: 32,
          returnSequences: false
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    // Compile model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.isModelLoaded = true;
  }

  private async preprocessData(marketData: MarketData[], orderBook: OrderBook): Promise<tf.Tensor> {
    // Combine market data and order book features
    const features = marketData.map(data => [
      data.price,
      data.volume,
      data.change24h,
      data.high24h,
      data.low24h,
      // Add order book features
      this.calculateOrderBookImbalance(orderBook),
      this.calculateSpread(orderBook),
      this.calculateVolumeProfile(orderBook),
      this.calculatePriceImpact(orderBook),
      this.calculateVolatility(marketData)
    ]);

    // Convert to tensor and normalize
    const tensor = tf.tensor2d(features);
    return this.normalizeData(tensor);
  }

  private calculateOrderBookImbalance(orderBook: OrderBook): number {
    const bidVolume = orderBook.bids.reduce((sum, [_, volume]) => sum + volume, 0);
    const askVolume = orderBook.asks.reduce((sum, [_, volume]) => sum + volume, 0);
    return (bidVolume - askVolume) / (bidVolume + askVolume);
  }

  private calculateSpread(orderBook: OrderBook): number {
    const bestBid = orderBook.bids[0][0];
    const bestAsk = orderBook.asks[0][0];
    return (bestAsk - bestBid) / bestBid;
  }

  private calculateVolumeProfile(orderBook: OrderBook): number {
    const totalVolume = orderBook.bids.reduce((sum, [_, volume]) => sum + volume, 0) +
                       orderBook.asks.reduce((sum, [_, volume]) => sum + volume, 0);
    return totalVolume;
  }

  private calculatePriceImpact(orderBook: OrderBook): number {
    // Calculate price impact for a standard order size
    const standardSize = 1.0;
    let impact = 0;
    let remainingSize = standardSize;
    
    for (const [price, volume] of orderBook.asks) {
      if (remainingSize <= 0) break;
      const executed = Math.min(remainingSize, volume);
      impact += executed * price;
      remainingSize -= executed;
    }
    
    return impact / standardSize;
  }

  private calculateVolatility(marketData: MarketData[]): number {
    const returns = marketData.slice(1).map((data, i) => 
      (data.price - marketData[i].price) / marketData[i].price
    );
    return Math.sqrt(returns.reduce((sum, ret) => sum + ret * ret, 0) / returns.length);
  }

  private normalizeData(tensor: tf.Tensor): tf.Tensor {
    const { mean, variance } = tf.moments(tensor);
    return tensor.sub(mean).div(tf.sqrt(variance));
  }

  async predict(marketData: MarketData[], orderBook: OrderBook): Promise<{
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
    positionSize: number;
  }> {
    if (!this.isModelLoaded) {
      throw new Error('Model not loaded');
    }

    // Preprocess data
    const input = await this.preprocessData(marketData, orderBook);
    
    // Make prediction
    const prediction = this.model.predict(input) as tf.Tensor;
    const [confidence] = await prediction.data();
    
    // Determine action based on prediction and thresholds
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    if (confidence > this.predictionThreshold) {
      action = 'buy';
    } else if (confidence < (1 - this.predictionThreshold)) {
      action = 'sell';
    }

    // Calculate position size based on confidence
    const positionSize = Math.min(
      this.maxPositionSize,
      this.maxPositionSize * (confidence / this.confidenceThreshold)
    );

    return {
      action,
      confidence,
      positionSize
    };
  }

  async updateModel(newData: MarketData[], orderBook: OrderBook, actualResult: number) {
    if (!this.isModelLoaded) {
      throw new Error('Model not loaded');
    }

    // Prepare training data
    const input = await this.preprocessData(newData, orderBook);
    const target = tf.tensor2d([[actualResult]]);

    // Train model
    await this.model.fit(input, target, {
      epochs: 1,
      batchSize: 32,
      shuffle: true
    });

    // Save updated model
    await this.model.save('indexeddb://trading-model');
  }

  getStrategyInfo(): TradingStrategy {
    return {
      id: 'ml-strategy',
      name: 'ML-Based Trading Strategy',
      type: 'ml-based',
      status: 'active',
      performance: {
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        totalTrades: 0,
        netProfit: 0
      },
      settings: {
        riskLevel: 'medium',
        maxDrawdown: 0.1,
        positionSize: this.maxPositionSize,
        stopLoss: this.stopLoss,
        takeProfit: this.takeProfit
      }
    };
  }
} 