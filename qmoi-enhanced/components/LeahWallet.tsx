import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LeahWallet() {
  const [balance, setBalance] = useState(1000);
  const [history, setHistory] = useState([
    { type: 'credit', amount: 1000, note: 'Initial deposit', date: new Date().toLocaleDateString() }
  ]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  function handleAddFunds() {
    if (!amount) return;
    setBalance(b => b + Number(amount));
    setHistory(h => [{ type: 'credit', amount: Number(amount), note, date: new Date().toLocaleDateString() }, ...h]);
    setAmount('');
    setNote('');
  }

  return (
    <Card className="max-w-md mx-auto my-6">
      <CardHeader>
        <CardTitle>Leah's Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">Balance: ${balance}</div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <input
            type="text"
            placeholder="Note"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <Button onClick={handleAddFunds} size="sm">Add Funds</Button>
        </div>
        <div>
          <h4 className="font-semibold mb-1">History</h4>
          <ul className="text-sm">
            {history.map((h, i) => (
              <li key={i} className="mb-1">
                <span className={h.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                  {h.type === 'credit' ? '+' : '-'}${h.amount}
                </span> - {h.note} <span className="text-gray-400">({h.date})</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Add to LC hub or main dashboard as needed
// Example: import { LeahWallet } from "@/components/LeahWallet"
// <LeahWallet />
