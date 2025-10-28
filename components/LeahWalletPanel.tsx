import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LeahWalletPanel() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Array<any>>([]);
  const [provider, setProvider] = useState('cashon');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchBalance() {
    setLoading(true);
    try {
      const res = await fetch(`/api/leah_wallet/balance?provider=${encodeURIComponent(provider)}`);
      if (res.ok) {
        const j = await res.json();
        setBalance(j.balance ?? 0);
      } else {
        console.error('balance fetch failed', await res.text());
      }
    } catch (e) {
      console.error('balance fetch error', e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransactions() {
    try {
      const res = await fetch(`/api/leah_wallet/transactions?provider=${encodeURIComponent(provider)}`);
      if (res.ok) {
        const j = await res.json();
        setTransactions(j.transactions || []);
      }
    } catch (e) {
      console.error('transactions fetch', e);
    }
  }

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  function openCredentialPrompt() {
    const providerName = provider;
    const key = window.prompt(`Enter ${providerName.toUpperCase()} API key (or leave blank):`);
    if (!key) {
      alert('No key provided. To persist credentials call the API with confirm_store=true from a secure UI.');
      return;
    }
    // For safety we ask confirm to persist
    const confirm = window.confirm('Store this credential in .qmoi/env_generated.json for staging? (only do this for test credentials)');
    if (!confirm) return;
    // POST to API
    fetch('/api/leah_wallet/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: providerName, credentials: { API_KEY: key }, confirm_store: true }),
    }).then(r => r.json()).then(j => {
      alert(JSON.stringify(j));
      fetchBalance();
    }).catch(e => alert('failed to save credentials'));
  }

  return (
    <Card className="my-4">
      <CardContent>
        <h3 className="font-bold mb-2">Leah's Wallet</h3>
        <div className="mb-2">
          Provider: <select value={provider} onChange={e => setProvider(e.target.value)} className="border rounded px-2 py-1 ml-2">
            <option value="cashon">Cashon</option>
            <option value="mpesa">Mpesa</option>
            <option value="binance">Binance</option>
          </select>
        </div>
        <div className="mb-2">Balance: <span className="font-mono">{loading ? 'Loading...' : balance !== null ? `$${balance.toFixed(2)}` : '—'}</span></div>
        <div className="mb-2">
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border p-1 rounded w-1/3 mr-2" />
          <input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="border p-1 rounded w-1/3 mr-2" />
          <Button size="sm" onClick={() => alert('Use production flows to add funds (this is a staging UI)')}>Add Funds</Button>
          <Button size="sm" variant="outline" onClick={() => alert('Use production flows to spend funds (this is a staging UI)')} className="ml-2">Spend</Button>
        </div>
        <div className="mb-2">
          <Button size="sm" onClick={openCredentialPrompt}>Set Provider Credentials</Button>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Transactions</h4>
          <ul className="list-disc ml-6">
            {transactions.map((t: any, i: number) => (
              <li key={i} className={t.status === 'simulated' ? 'text-gray-700' : 'text-green-600'}>
                {t.provider} {t.tx_ref ? ` ${t.tx_ref}` : ''} — ${t.amount} {t.currency || ''} {t.metadata ? JSON.stringify(t.metadata) : ''}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
