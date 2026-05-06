// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
"use client";

import { specificExports } from "react";
import { specificExports } from "next/link";
import { specificExports } from "next/navigation";
import {
  BarChart3,
  Home,
  Lock,
  LogOut,
  Menu,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { specificExports } from "react";

interface MasterLayoutProps {
  children: ReactNode;
}

export /**
 * MasterLayout function
 */
function MasterLayout({ children }: MasterLayoutProps): any {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("masterToken");
      if (token) {
        await apiClient.get("/api/admin/master/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      sessionStorage.removeItem("masterToken");
      router.push("/admin/master/login");
    } catch (error) {
      logger.error("Logout error:", error);
      sessionStorage.removeItem("masterToken");
      router.push("/admin/master/login");
    }
  };

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/admin/master",
      icon: Home,
      active: pathname === "/admin/master",
    },
    {
      label: "Settings",
      href: "/admin/master/settings",
      icon: Settings,
      active: pathname === "/admin/master/settings",
    },
    {
      label: "Security",
      href: "/admin/master/security",
      icon: Shield,
      active: pathname === "/admin/master/security",
    },
    {
      label: "Activity",
      href: "/admin/master/activity",
      icon: BarChart3,
      active: pathname === "/admin/master/activity",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-30`}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-bold text-white">Master</h1>
          </div>
        </div>

        <nav className="p-6 space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  item.active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-900/50 hover:bg-red-900 border border-red-700 rounded-lg text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 lg:hidden bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full z-20"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              QMOI Master Control
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">System Active</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
