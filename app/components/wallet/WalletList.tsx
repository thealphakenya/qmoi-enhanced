'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletData {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export function WalletList() {
  const [wallets, setWallets] = React.useState<WalletData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch wallets
    const loadWallets = async () => {
      try {
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };
    loadWallets();
  }, []);

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
              {wallet.balance} {wallet.currency}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WalletList;
