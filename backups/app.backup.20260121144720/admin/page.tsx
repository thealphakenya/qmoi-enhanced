
"use client";

import { specificExports } from "react";
import { specificExports } from "next/navigation";
import { specificExports } from "@/app/components/AdminDashboard";

export default /**
 * AdminPage function
 */
function AdminPage(): any {
  try {() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Verify admin access by trying to fetch monitoring dashboard
        const _response = await apiClient.get("/api/admin/monitoring", {
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
      } catch (_error) {
        console?.error?.("Error checking admin status:", _error);
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
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">QMOI Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin Panel</span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <AdminDashboard />
    </div>
  );
}
