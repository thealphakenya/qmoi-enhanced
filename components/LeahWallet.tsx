import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LeahWallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<any>>([]);
  const [provider, setProvider] = useState('cashon');

  async function fetchBalance() {
    try {
      const res = await fetch(`/api/leah_wallet/balance?provider=${encodeURIComponent(provider)}`);
      if (res.ok) {
        const j = await res.json();
        setBalance(j.balance ?? 0);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchHistory() {
    try {
      const res = await fetch(`/api/leah_wallet/transactions?provider=${encodeURIComponent(provider)}`);
      if (res.ok) {
        const j = await res.json();
        setHistory(j.transactions || []);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, [provider]);

  return (
    <Card className="max-w-md mx-auto my-6">
      <CardHeader>
        <CardTitle>Leah's Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">Provider: <select value={provider} onChange={e => setProvider(e.target.value)} className="border rounded px-2 py-1 ml-2"><option value="cashon">Cashon</option><option value="mpesa">Mpesa</option><option value="binance">Binance</option></select></div>
        <div className="text-2xl font-bold mb-2">Balance: {balance !== null ? `$${balance}` : 'Loading...'}</div>
        <div className="mb-4">
          <Button onClick={() => alert('Use the Leah Wallet Panel to set credentials and perform actions')} size="sm">Manage</Button>
        </div>
        <div>
          <h4 className="font-semibold mb-1">History</h4>
          <ul className="text-sm">
            {history.map((h, i) => (
              <li key={i} className="mb-1">
                <span className={h.status === 'simulated' ? 'text-gray-600' : 'text-green-600'}>
                  {h.provider} {h.tx_ref ? ` ${h.tx_ref}` : ''} — ${h.amount}
                </span>
                {h.metadata ? ` ${JSON.stringify(h.metadata)}` : ''}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
