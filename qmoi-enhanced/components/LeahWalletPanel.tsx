import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LeahWalletPanel() {
  const [balance, setBalance] = useState(100.00);
  const [transactions, setTransactions] = useState([
    { type: 'credit', amount: 20, desc: 'Gift' },
    { type: 'debit', amount: 5, desc: 'Purchase' },
  ]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  function handleAddFunds() {
    if (!amount) return;
    setBalance(b => b + parseFloat(amount));
    setTransactions(t => [{ type: 'credit', amount: parseFloat(amount), desc }, ...t]);
    setAmount('');
    setDesc('');
  }

  function handleSpendFunds() {
    if (!amount) return;
    setBalance(b => b - parseFloat(amount));
    setTransactions(t => [{ type: 'debit', amount: parseFloat(amount), desc }, ...t]);
    setAmount('');
    setDesc('');
  }

  return (
    <Card className="my-4">
      <CardContent>
        <h3 className="font-bold mb-2">Leah's Wallet</h3>
        <div className="mb-2">Balance: <span className="font-mono">${balance.toFixed(2)}</span></div>
        <div className="mb-2">
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border p-1 rounded w-1/3 mr-2" />
          <input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="border p-1 rounded w-1/3 mr-2" />
          <Button size="sm" onClick={handleAddFunds}>Add Funds</Button>
          <Button size="sm" variant="outline" onClick={handleSpendFunds} className="ml-2">Spend</Button>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Transactions</h4>
          <ul className="list-disc ml-6">
            {transactions.map((t, i) => (
              <li key={i} className={t.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                {t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)} - {t.desc}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
