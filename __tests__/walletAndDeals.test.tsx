import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import WalletPanel from "../components/WalletPanel";

describe("WalletPanel", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            analytics: {
              overview: {
                totalWallets: 2,
                totalBalance: 1250.5,
                currencyDistribution: {
                  USD: {
                    currency: "USD",
                    walletCount: 1,
                    totalBalance: 950.5,
                    averageBalance: 950.5,
                  },
                  EUR: {
                    currency: "EUR",
                    walletCount: 1,
                    totalBalance: 300,
                    averageBalance: 300,
                  },
                },
                walletUtilization: 100,
                transactionStats: {
                  totalTransactions: 6,
                  averageTransactionSize: 208.42,
                },
              },
              growth: {
                newWalletsLast30Days: 0,
                transactionsLast30Days: 2,
              },
              wallets: [
                {
                  id: "wallet-1",
                  currency: "USD",
                  balance: 950.5,
                  transactionCount: 4,
                  status: "active",
                  createdAt: "2026-05-10T12:00:00.000Z",
                },
                {
                  id: "wallet-2",
                  currency: "EUR",
                  balance: 300,
                  transactionCount: 2,
                  status: "active",
                  createdAt: "2026-05-15T12:00:00.000Z",
                },
              ],
            },
          }),
      }) as any,
    ) as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the WalletPanel and displays wallet analytics", async () => {
    render(<WalletPanel />);

    expect(screen.getByText(/Wallet Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Refresh/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Total Balance/i)).toBeInTheDocument();
      expect(screen.getByText(/Wallets/i)).toBeInTheDocument();
      expect(screen.getByText(/Transactions/i)).toBeInTheDocument();
    });
  });
});
