"use client";

import { useState, useEffect } from "react";
import QMOIDashboard from "../components/QMOIDashboard";
import { MasterProvider, useMaster } from "../components/MasterContext";
import { NotificationPanel } from "../components/NotificationPanel";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: any;
}

function MainPage() {
  const { isMaster, setRole } = useMaster();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "1",
    name: "Victor Kwemoi",
    email: "victor@qmoi.com",
    role: "Master Administrator",
    avatar: undefined,
  });

  // Check authentication status
  useEffect(() => {
    // In a real implementation, this would check for valid session/token
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("qmoi_authenticated");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
        // Load user data from localStorage or API
        const storedUser = localStorage.getItem("qmoi_user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: unknown) => {
    const u = (userData as Partial<User>) || {};
    setCurrentUser({
      id: String(u.id || "1"),
      name: String(u.name || "Unknown"),
      email: String(u.email || "unknown@qmoi"),
      role: String(u.role || "User"),
      avatar: u.avatar,
    });
    setIsAuthenticated(true);
    localStorage.setItem("qmoi_authenticated", "true");
    localStorage.setItem("qmoi_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({
      id: "1",
      name: "Victor Kwemoi",
      email: "victor@qmoi.com",
      role: "Master Administrator",
      avatar: undefined,
    });
    localStorage.removeItem("qmoi_authenticated");
    localStorage.removeItem("qmoi_user");
  };

  // If not authenticated, show login/auth interface
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">QM</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                QMOI Enhanced
              </h1>
              <p className="text-gray-600 mt-2">Advanced AI System Access</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() =>
                  handleLogin({
                    id: "1",
                    name: "Victor Kwemoi",
                    email: "victor@qmoi.com",
                    role: "Master Administrator",
                  })
                }
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Login as Master Administrator
              </button>

              <button
                onClick={() =>
                  handleLogin({
                    id: "2",
                    name: "Leah Chebet",
                    email: "leah@qmoi.com",
                    role: "Administrator",
                  })
                }
                className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Login as Administrator
              </button>

              <button
                onClick={() =>
                  handleLogin({
                    id: "3",
                    name: "Demo User",
                    email: "demo@qmoi.com",
                    role: "User",
                  })
                }
                className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Login as Demo User
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Enhanced QMOI System with Advanced Security</p>
              <p className="mt-1">
                Biometric Authentication • Parallel Processing • Memory
                Awareness
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <QMOIDashboard user={currentUser} onLogout={handleLogout} />;
}

export default function Page() {
  return (
    <div>
      <NotificationPanel />
      <MasterProvider>
        <MainPage />
      </MasterProvider>
    </div>
  );
}
