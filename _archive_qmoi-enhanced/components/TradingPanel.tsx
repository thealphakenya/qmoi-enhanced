import React from 'react';
import { useTrading } from '../hooks/useTrading';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FaChartLine, FaRobot, FaHistory } from 'react-icons/fa';

export function TradingPanel() {
  useTrading();

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(FaChartLine as React.ElementType, { className: "w-5 h-5" })}
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            Trading data is currently unavailable.
          </div>
        </CardContent>
      </Card>

      {/* Active Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(FaRobot as React.ElementType, { className: "w-5 h-5" })}
            Active Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            Trading data is currently unavailable.
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(FaHistory as React.ElementType, { className: "w-5 h-5" })}
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            Trading data is currently unavailable.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}