import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Account {
  id: number;
  username: string;
  email: string;
  platform: string;
  status: string;
  verified: boolean;
  createdAt: string;
}

const AccountAutomationPanel: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({ username: "", email: "", platform: "" });
  const [status, setStatus] = useState<string>("");
  const [idToCheck, setIdToCheck] = useState("");

  const createAccount = async () => {
    const res = await fetch("/api/account-automation/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.account) setAccounts((a) => [...a, data.account]);
    setStatus(data.success ? "Account created" : "Error creating account");
  };

  const login = async () => {
    const res = await fetch("/api/account-automation/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        platform: form.platform,
      }),
    });
    const data = await res.json();
    setStatus(data.success ? "Login successful" : "Login failed");
  };

  const verify = async (id: number, email: string) => {
    const res = await fetch("/api/account-automation/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email }),
    });
    const data = await res.json();
    setStatus(data.success ? "Verification triggered" : "Verification failed");
    if (data.account)
      setAccounts((accs) => accs.map((a) => (a.id === id ? data.account : a)));
  };

  const checkStatus = async () => {
    const res = await fetch(`/api/account-automation/status?id=${idToCheck}`);
    const data = await res.json();
    setStatus(
      data.status
        ? `Status: ${data.status}, Verified: ${data.verified}`
        : "Status check failed",
    );
  };

  return (
    <Card className="space-y-4 mt-4">
      <CardHeader>
        <CardTitle>Account Automation & Security</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
            className="mb-2"
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mb-2"
          />
          <Input
            placeholder="Platform (e.g. WhatsApp, Telegram)"
            value={form.platform}
            onChange={(e) =>
              setForm((f) => ({ ...f, platform: e.target.value }))
            }
            className="mb-2"
          />
          <Button onClick={createAccount} className="mr-2">
            Create Account
          </Button>
          <Button onClick={login} variant="secondary">
            Login
          </Button>
        </div>
        <div className="mb-4">
          <Input
            placeholder="Account ID to check status"
            value={idToCheck}
            onChange={(e) => setIdToCheck(e.target.value)}
            className="mb-2"
          />
          <Button onClick={checkStatus}>Check Status</Button>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Accounts</h4>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t">
                  <td>{a.id}</td>
                  <td>{a.username}</td>
                  <td>{a.email}</td>
                  <td>{a.platform}</td>
                  <td>{a.status}</td>
                  <td>{a.verified ? "Yes" : "No"}</td>
                  <td>
                    {!a.verified && (
                      <Button size="sm" onClick={() => verify(a.id, a.email)}>
                        Trigger Verification
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-green-700 font-semibold">{status}</div>
        {/* TODO: Modular platform support, shell/VPN/security enhancements */}
      </CardContent>
    </Card>
  );
};

export default AccountAutomationPanel;
