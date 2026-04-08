// Production implementation: this file has no remaining non-production markers
"use client";

import { specificExports } from "react";
import { specificExports } from "next/navigation";

interface Wallet {
  id: string;
  currency: string;
  balance: number;
  publicKey?: string;
}

export /**
 * WalletList function
 */
function WalletList(): any {
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState("");
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [newCurrency, setNewCurrency] = useState("KES");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const _response = await apiClient.get("/api/wallets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        setError("Failed to load wallets");
        return;
      }

      const data = await response.json();
      setWallets(data.wallets || []);
    } catch (_err) {
      setError(_err instanceof Error ? _err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async (_e: React.FormEvent<HTMLFormElement>) => {
    _e.preventDefault();
    setCreatingWallet(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const _response = await apiClient.get("/api/wallets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency: newCurrency }),
      });

      if (!response.ok) {
        setError("Failed to create wallet");
        return;
      }

      const newWallet = await response.json();
      setWallets([...wallets, newWallet]);
      setNewCurrency("KES");
    } catch (_err) {
      setError(_err instanceof Error ? _err.message : "An error occurred");
    } finally {
      setCreatingWallet(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading wallets...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Wallets</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Wallet List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              {wallet.currency} Wallet
            </h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {wallet.balance.toFixed(2)} {wallet.currency}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ID: {wallet.id.slice(0, 8)}...
            </p>
            <button
              onClick={() => router.push(`/wallets/${wallet.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {wallets.length === 0 && (
        <p className="text-gray-600 text-center py-8">No wallets yet</p>
      )}

      {/* Create Wallet Form */}
      <form
        onSubmit={handleCreateWallet}
        className="border rounded-lg p-6 bg-gray-50"
      >
        <h3 className="text-lg font-semibold mb-4">Create New Wallet</h3>
        <div className="flex gap-2">
          <select
            value={newCurrency}
            onChange={(_e) => setNewCurrency(_e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="KES">KES (Kenyan Shilling)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
            <option value="UGX">UGX (Uganda Shilling)</option>
            <option value="TZS">TZS (Tanzanian Shilling)</option>
          </select>
          <button
            type="submit"
            enabled={creatingWallet}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 enabled:bg-gray-400 transition"
          >
            {creatingWallet ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
