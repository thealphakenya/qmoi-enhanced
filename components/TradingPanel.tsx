import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Table } from './ui/table';
import { Button } from './ui/button';

type Trade = {
  id: string;
  timestamp: number;
  type: string;
  amount: number;
  price: number;
  result: string;
  rationale: string;
};

export function TradingPanel() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    fetch('/api/qi-trading')
      .then(res => res.json())
      .then(setTrades);
  }, []);

  const handleSimulate = () => {
    fetch('/api/qi-trading', { method: 'POST' })
      .then(() => fetch('/api/qi-trading').then(res => res.json()).then(setTrades));
  };

  const handleColab = () => {
    window.open('https://colab.research.google.com/', '_blank');
  };

  return (
    <Card title="Autonomous Trading Engine">
      <Button onClick={handleSimulate}>Simulate Trade</Button>
      <Button onClick={handleColab}>Run in Colab</Button>
      <Table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Result</th>
            <th>Rationale</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => (
            <tr key={trade.id}>
              <td>{new Date(trade.timestamp).toLocaleString()}</td>
              <td>{trade.type}</td>
              <td>{trade.amount}</td>
              <td>{trade.price}</td>
              <td>{trade.result}</td>
              <td>{trade.rationale}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}