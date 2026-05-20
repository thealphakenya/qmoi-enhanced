'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface WalletData {
  id: string;
  name: string;
  balance?: number | null;
  currency?: string;
}

export function WalletList() {
  const { user } = useAuth();
  const isMaster = user?.role === 'master';
  const [wallets, setWallets] = React.useState<WalletData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch wallets from API; server will limit details for non-master
    const loadWallets = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/wallet', { cache: 'no-store' });
        if (!res.ok) {
          setWallets([]);
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        setWallets(data.wallets || []);
      } catch (e) {
        setWallets([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadWallets();
  }, [isMaster]);

  if (isLoading) {
    return <div className="p-4">Loading wallets...</div>;
  }

  if (wallets.length === 0) {
    return (
      <div className="p-4 text-center">
        <Wallet className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-500">No wallets found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{wallet.name}</span>
            <span className="text-lg font-semibold">
              {isMaster ? `${wallet.balance ?? '—'} ${wallet.currency ?? ''}` : '—'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WalletList;
