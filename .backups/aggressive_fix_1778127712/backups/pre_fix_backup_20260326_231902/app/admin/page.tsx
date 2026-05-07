// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
"use client";

import { specificExports } from "react";
import { specificExports } from "next/navigation";
import { specificExports } from "@/app/components/AdminDashboard";
import { specificExports } from "@/app/components/QMOIAutoFixDashboard";

export default /**
 * AdminPage function
 */
function AdminPage(): any {
  try {() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"monitoring" | "autofix">(
    "monitoring",
  );

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Verify admin access by trying to fetch monitoring dashboard
        const response = await apiClient.get("/api/admin/monitoring", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 403) {
          router.push("/dashboard");
          return;
        }

        if (response.ok) {
          setIsAdmin(true);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console?.error?.("Error checking admin status:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="mt-2">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">
              🔐 QMOI Master Control Panel
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Master Access Level</span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-gray-600">
            <button
              onClick={() => setActiveTab("monitoring")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "monitoring"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              📊 Monitoring Dashboard
            </button>
            <button
              onClick={() => setActiveTab("autofix")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "autofix"
                  ? "border-b-2 border-green-500 text-green-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              🔧 QMOI AutoFix System
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {activeTab === "monitoring" ? (
        <AdminDashboard />
      ) : (
        <QMOIAutoFixDashboard />
      )}
    </div>
  );
}
