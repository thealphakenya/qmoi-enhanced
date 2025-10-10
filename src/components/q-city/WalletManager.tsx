import React, { useState, useEffect } from "react";
import { useToast } from "../../../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useTimezone } from "../../hooks/useTimezone";

interface WalletManagerProps {
  isMaster?: boolean;
}

interface WalletRequest {
  email: string;
  username: string;
  requestedAt: string;
  status: "pending" | "approved" | "denied";
}

export const WalletManager: React.FC<WalletManagerProps> = ({
  isMaster = false,
}) => {
  const [pendingRequests, setPendingRequests] = useState<WalletRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletRequested, setWalletRequested] = useState(false);
  const { getCurrentTime, currentTimezone } = useTimezone();
  const { toast } = useToast();

  useEffect(() => {
    if (isMaster) {
      fetchPendingRequests();
    }
  }, [isMaster]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/wallet?pending_wallets=1", {
        headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
      });
      if (!res.ok) throw new Error("Failed to fetch pending requests");
      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      setError("Failed to load pending requests");
      toast({
        title: "Error",
        description: "Failed to load pending wallet requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const email = localStorage.getItem("userEmail");
      const username = localStorage.getItem("username");

      if (!email || !username) {
        throw new Error("Please complete your profile first");
      }

      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": localStorage.getItem("adminToken") || "",
        },
        body: JSON.stringify({
          action: "request_wallet",
          email,
          username,
        }),
      });

      const data = await res.json();

      if (data.status === "pending") {
        setWalletRequested(true);
        toast({
          title: "Success",
          description: "Wallet request sent to master for approval",
        });
      } else {
        throw new Error(data.error || "Failed to request wallet");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWallet = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": localStorage.getItem("adminToken") || "",
          "x-master-token": localStorage.getItem("masterToken") || "",
        },
        body: JSON.stringify({
          action: "approve_wallet",
          email,
        }),
      });

      const data = await res.json();

      if (data.status === "approved") {
        setPendingRequests((prev) => prev.filter((r) => r.email !== email));
        toast({
          title: "Success",
          description: `Wallet approved for ${email}`,
        });
        await fetchPendingRequests(); // Refresh the list
      } else {
        throw new Error(data.error || "Failed to approve wallet");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Wallet Management</h2>
          <p className="text-gray-500">
            {getCurrentTime()} {currentTimezone.emoji}
          </p>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!isMaster && (
        <div className="space-y-4">
          <Button
            onClick={handleRequestWallet}
            disabled={loading || walletRequested}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : walletRequested ? (
              "Wallet Request Pending Approval"
            ) : (
              "Request Wallet"
            )}
          </Button>
        </div>
      )}

      {isMaster && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pending Wallet Requests</h3>
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {!loading && pendingRequests.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No pending requests
            </p>
          )}
          {pendingRequests.map((req) => (
            <Card key={req.email} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{req.username}</p>
                  <p className="text-sm text-gray-500">{req.email}</p>
                  <p className="text-xs text-gray-400">
                    Requested: {new Date(req.requestedAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleApproveWallet(req.email)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Approve"
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
