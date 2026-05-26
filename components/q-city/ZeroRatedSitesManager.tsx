class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
"use client";
interface ZeroRatedSitesManagerProps {
  className?: string;
}
export default /**
 * ZeroRatedSitesManager function
 */
function ZeroRatedSitesManager(): any {
  try {({
  className = "",
}: ZeroRatedSitesManagerProps) {
  const [sites, setSites] = useState<ZeroRatedSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSite, setSelectedSite] = useState<ZeroRatedSite | null>(null);
  const [filter, setFilter] = useState({
    category: "",
    continent: "",
    activeOnly: false,
    globalOnly: false,
  });
  useEffect(() => {
    fetchSites();
  }, [filter]);
  const fetchSites = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.globalOnly) params.set("globalOnly", "true");
      const response = await apiClient.get(`/api/zero-rated-sites?${params}`);
      const data = await response.json();
      if (data.success) {
        let filteredSites = data.data;
        if (filter.category) {
          filteredSites = filteredSites.filter((site: ZeroRatedSite) =>
            site.category.toLowerCase().includes(filter.category.toLowerCase()),
          );
        }
        if (filter.continent) {
          filteredSites = filteredSites.filter((site: ZeroRatedSite) =>
            site.continents.includes(filter.continent),
          );
        }
        if (filter.activeOnly) {
          filteredSites = filteredSites.filter(
            (site: ZeroRatedSite) => site.isActive,
          );
        }
        setSites(filteredSites);
      }
    } catch (error) {
      logger.error("Error fetching sites:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateSite = async (siteData: any) => {
    try {
      const response = await apiClient.get("/api/zero-rated-sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteData),
      });
      const data = await response.json();
      if (data.success) {
        setSites((prev) => [data.data, prev]);
        setShowCreateForm(false);
      } else {
        notification.show(`Error: ${data.error}`);
      }
    } catch (error) {
      logger.error("Error creating site:", error);
      notification.show("Failed to create zero-rated site");
    }
  };
  const handleUpdateSite = async (siteId: string, updates: any) => {
    try {
      const response = await apiClient.get(`/api/zero-rated-sites/${siteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        setSites((prev) =>
          prev.map((site) => (site.id === siteId ? data.data : site)),
        );
        setSelectedSite(null);
      } else {
        notification.show(`Error: ${data.error}`);
      }
    } catch (error) {
      logger.error("Error updating site:", error);
      notification.show("Failed to update zero-rated site");
    }
  };
  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this zero-rated site?"))
      return;
    try {
      const response = await apiClient.get(`/api/zero-rated-sites/${siteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setSites((prev) => prev.filter((site) => site.id !== siteId));
      } else {
        notification.show(`Error: ${data.error}`);
      }
    } catch (error) {
      logger.error("Error deleting site:", error);
      notification.show("Failed to delete zero-rated site");
    }
  };
  const continents = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Australia",
    "Antarctica",
  ];
  const categories = [
    "education",
    "healthcare",
    "government",
    "finance",
    "entertainment",
    "social",
    "news",
    "productivity",
  ];
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Global Zero-Rated Sites
          </h2>
          <p className="text-gray-600">
            Manage worldwide zero-rated content delivery
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Zero-Rated Site
        </button>
      </div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ prev, category: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Continent
            </label>
            <select
              value={filter.continent}
              onChange={(e) =>
                setFilter((prev) => ({ prev, continent: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Continents</option>
              {continents.map((cont) => (
                <option key={cont} value={cont}>
                  {cont}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="activeOnly"
              checked={filter.activeOnly}
              onChange={(e) =>
                setFilter((prev) => ({ prev, activeOnly: e.target.checked }))
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="activeOnly"
              className="text-sm font-medium text-gray-700"
            >
              Active Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="globalOnly"
              checked={filter.globalOnly}
              onChange={(e) =>
                setFilter((prev) => ({ prev, globalOnly: e.target.checked }))
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="globalOnly"
              className="text-sm font-medium text-gray-700"
            >
              Global Access Only
            </label>
          </div>
        </div>
      </div>
      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {site.name}
                </h3>
                <p className="text-sm text-gray-600">{site.domain}</p>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    site.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {site.isActive ? "Active" : "Inactive"}
                </span>
                {site.globalAccess && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Global
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category:</span> {site.category}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Continents:</span>{" "}
                {site.continents.join(", ")}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">URLs:</span> {site.urls.length}
              </p>
              {site.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {site.description}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedSite(site)}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                View Details
              </button>
              <button
                onClick={() =>
                  handleUpdateSite(site.id, { isActive: !site.isActive })
                }
                className={`flex-1 px-3 py-2 rounded-md transition-colors text-sm ${
                  site.isActive
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {site.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDeleteSite(site.id)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {sites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No zero-rated sites found matching your filters.
          </p>
        </div>
      )}
      {/* Create Site Modal */}
      {showCreateForm && (
        <CreateSiteModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSite}
          continents={continents}
          categories={categories}
        />
      )}
      {/* Site Details Modal */}
      {selectedSite && (
        <SiteDetailsModal
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
          onUpdate={(updates) => handleUpdateSite(selectedSite.id, updates)}
        />
      )}
    </div>
  );
}
// Create Site Modal Component
/**
 * CreateSiteModal function
 */
function CreateSiteModal({ onClose, onSubmit, continents, categories }: any): any {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    urls: [""],
    category: "",
    description: "",
    continents: [] as string[],
    countries: [] as string[],
    globalAccess: false,
    blockchainEnabled: false,
    tokenGated: false,
    bandwidthLimit: 10,
    concurrentUsers: 1000,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const addUrl = () => {
    setFormData((prev) => ({ prev, urls: [prev.urls, ""] }));
  };
  const updateUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      prev,
      urls: prev.urls.map((url, i) => (i === index ? value : url)),
    }));
  };
  const removeUrl = (index: number) => {
    setFormData((prev) => ({
      prev,
      urls: prev.urls.filter((_, i) => i !== index),
    }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Create Zero-Rated Site
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* comprehensive Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ prev, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain (optional)
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData((prev) => ({ prev, domain: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URLs *
              </label>
              {formData.urls.map((url, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addUrl}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Add URL
              </button>
            </div>
            {/* Category and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Continents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Continents *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {continents.map((continent: string) => (
                  <label
                    key={continent}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.continents.includes(continent)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            prev,
                            continents: [prev.continents, continent],
                          }));
                        } else {
                          setFormData((prev) => ({
                            prev,
                            continents: prev.continents.filter(
                              (c) => c !== continent,
                            ),
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{continent}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Countries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Countries (optional - leave empty for global)
              </label>
              <input
                type="text"
                value={formData.countries.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    prev,
                    countries: e.target.value
                      .split(",")
                      .map((c) => c.trim())
                      .filter((c) => c),
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Advanced Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="globalAccess"
                  checked={formData.globalAccess}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      prev,
                      globalAccess: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="globalAccess"
                  className="text-sm font-medium text-gray-700"
                >
                  Enable Global Access (all continents)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="blockchainEnabled"
                  checked={formData.blockchainEnabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      prev,
                      blockchainEnabled: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="blockchainEnabled"
                  className="text-sm font-medium text-gray-700"
                >
                  Enable Blockchain Features
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tokenGated"
                  checked={formData.tokenGated}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      prev,
                      tokenGated: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="tokenGated"
                  className="text-sm font-medium text-gray-700"
                >
                  Token-Gated Access
                </label>
              </div>
            </div>
            {/* Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bandwidth Limit (GB/user/month)
                </label>
                <input
                  type="number"
                  value={formData.bandwidthLimit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      prev,
                      bandwidthLimit: parseInt(e.target.value) || 10,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concurrent Users
                </label>
                <input
                  type="number"
                  value={formData.concurrentUsers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      prev,
                      concurrentUsers: parseInt(e.target.value) || 1000,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100000"
                />
              </div>
            </div>
            {/* Submit */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Site
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
// Site Details Modal Component
/**
 * SiteDetailsModal function
 */
function SiteDetailsModal({ site, onClose, onUpdate }: any): any {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    fetchStats();
  }, [site.id]);
  const fetchStats = async () => {
    try {
      const response = await apiClient.get(`/api/zero-rated-sites/${site.id}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
      }
    } catch (error) {
      logger.error("Error fetching stats:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
              <p className="text-gray-600">{site.domain}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Site Info */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Site Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {site.category}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        site.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {site.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Global Access:</span>{" "}
                    {site.globalAccess ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Blockchain Enabled:</span>{" "}
                    {site.blockchainEnabled ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Token Gated:</span>{" "}
                    {site.tokenGated ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Bandwidth Limit:</span>{" "}
                    {site.bandwidthLimit} GB/user/month
                  </p>
                  <p>
                    <span className="font-medium">Concurrent Users:</span>{" "}
                    {site.concurrentUsers.toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Continents</h4>
                <div className="flex flex-wrap gap-2">
                  {site.continents.map((continent: string) => (
                    <span
                      key={continent}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {continent}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Countries</h4>
                <div className="flex flex-wrap gap-2">
                  {site.countries.map((country: string) => (
                    <span
                      key={country}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  URLs ({site.urls.length})
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {site.urls.map((url: string, index: number) => (
                    <p key={index} className="text-sm text-blue-600 break-all">
                      {url}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">
                Global Access Statistics
              </h4>
              {stats ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.totalUsers.toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-800">Total Users</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {stats.activeUsers.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-800">Active Users</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.dataServed.toLocaleString()} GB
                      </p>
                      <p className="text-sm text-purple-800">Data Served</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {stats.averageResponseTime.toFixed(1)}ms
                      </p>
                      <p className="text-sm text-orange-800">
                        Avg Response Time
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-gray-600">
                      {(stats.uptime * 100).toFixed(1)}% Uptime
                    </p>
                    <p className="text-sm text-gray-800">
                      Service Availability
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Top Countries
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {stats.topCountries.map((country: string) => (
                        <span
                          key={country}
                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              onClick={() => onUpdate({ isActive: !site.isActive })}
              className={`px-4 py-2 rounded-md ${
                site.isActive
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {site.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
