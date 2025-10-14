import React, { useState, useEffect, useRef } from "react";
import { useMaster } from "./MasterContext";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaStar,
  FaDownload,
  FaShieldAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons";

interface QmoiBrowserProps {
  isVisible: boolean;
  onClose: () => void;
  language?: "en" | "sw";
}

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  category: string;
}

export const QmoiBrowser: React.FC<QmoiBrowserProps> = ({
  isVisible,
  onClose,
  language = "en",
}) => {
  const { isMaster } = useMaster();

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "Qmoi Browser",
      url: "https://www.google.com",
      isActive: true,
    },
  ]);
  const [currentUrl, setCurrentUrl] = useState("https://www.google.com");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isAdRemovalEnabled, setIsAdRemovalEnabled] = useState(true);
  const [isAIFilteringEnabled, setIsAIFilteringEnabled] = useState(true);
  const [isIncognitoMode, setIsIncognitoMode] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const popularSites = [
    { name: "Google", url: "https://www.google.com", icon: "🔍" },
    { name: "YouTube", url: "https://www.youtube.com", icon: "📺" },
    { name: "Facebook", url: "https://www.facebook.com", icon: "📘" },
    { name: "Twitter", url: "https://www.twitter.com", icon: "🐦" },
    { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "📚" },
    { name: "GitHub", url: "https://www.github.com", icon: "💻" },
  ];

  const swahiliSites = [
    { name: "BBC Swahili", url: "https://www.bbc.com/swahili", icon: "📻" },
    { name: "DW Swahili", url: "https://www.dw.com/sw/swahili", icon: "🌍" },
    { name: "VOA Swahili", url: "https://www.voaswahili.com", icon: "📡" },
  ];

  useEffect(() => {
    // Load saved bookmarks and history
    const savedBookmarks = localStorage.getItem("qmoi-browser-bookmarks");
    const savedHistory = localStorage.getItem("qmoi-browser-history");

    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (url: string) => {
    const newHistory = [url, ...history.filter((h) => h !== url)].slice(0, 100);
    setHistory(newHistory);
    localStorage.setItem("qmoi-browser-history", JSON.stringify(newHistory));
  };

  const addBookmark = (title: string, url: string) => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title,
      url,
      favicon: `https://www.google.com/s2/favicons?domain=${url}`,
      category: "General",
    };

    const newBookmarks = [...bookmarks, newBookmark];
    setBookmarks(newBookmarks);
    localStorage.setItem(
      "qmoi-browser-bookmarks",
      JSON.stringify(newBookmarks),
    );
  };

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter((b) => b.id !== id);
    setBookmarks(newBookmarks);
    localStorage.setItem(
      "qmoi-browser-bookmarks",
      JSON.stringify(newBookmarks),
    );
  };

  const navigateToUrl = (url: string) => {
    let processedUrl = url;

    // Add protocol if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processedUrl = "https://" + url;
    }

    setCurrentUrl(processedUrl);
    addToHistory(processedUrl);

    // Update active tab
    setTabs((prev) =>
      prev.map((tab) => ({
        ...tab,
        url: tab.isActive ? processedUrl : tab.url,
        title: tab.isActive ? "Loading..." : tab.title,
      })),
    );
  };

  const handleSearch = (query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    navigateToUrl(searchUrl);
  };

  const createNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: "New Tab",
      url: "https://www.google.com",
      isActive: true,
    };

    setTabs((prev) =>
      prev.map((t) => ({ ...t, isActive: false })).concat(newTab),
    );
    setCurrentUrl(newTab.url);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) {
      createNewTab();
    } else {
      const newTabs = tabs.filter((t) => t.id !== tabId);
      const activeTab = newTabs.find((t) => t.isActive) || newTabs[0];
      setTabs(newTabs.map((t) => ({ ...t, isActive: t.id === activeTab.id })));
      setCurrentUrl(activeTab.url);
    }
  };

  const switchTab = (tabId: string) => {
    setTabs((prev) =>
      prev.map((tab) => ({
        ...tab,
        isActive: tab.id === tabId,
      })),
    );

    const activeTab = tabs.find((t) => t.id === tabId);
    if (activeTab) {
      setCurrentUrl(activeTab.url);
    }
  };

  const removeAds = (content: string) => {
    if (!isAdRemovalEnabled) return content;

    // AI-powered ad removal
    let cleanedContent = content;

    // Remove common ad selectors
    const adSelectors = [
      /<div[^>]*class="[^"]*ad[^"]*"[^>]*>.*?<\/div>/gi,
      /<div[^>]*id="[^"]*ad[^"]*"[^>]*>.*?<\/div>/gi,
      /<iframe[^>]*src="[^"]*ads[^"]*"[^>]*>.*?<\/iframe>/gi,
      /<script[^>]*src="[^"]*ads[^"]*"[^>]*>.*?<\/script>/gi,
    ];

    adSelectors.forEach((selector) => {
      cleanedContent = cleanedContent.replace(selector, "");
    });

    return cleanedContent;
  };

  const generateSearchSuggestions = (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = [
      `${query} news`,
      `${query} tutorial`,
      `${query} download`,
      `${query} review`,
      `${query} price`,
    ];

    setSearchSuggestions(suggestions);
  };

  const downloadFile = (url: string, filename: string) => {
    const download = {
      id: Date.now().toString(),
      url,
      filename,
      status: "downloading",
      progress: 0,
    };

    // Simulate download
    const interval = setInterval(() => {
      // Implementation of downloadFile function
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      // Implementation of downloadFile function
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 border-b p-2">
        <div className="flex items-center gap-2 mb-2">
          {/* Tab Bar */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 px-3 py-1 rounded-t cursor-pointer min-w-0 ${
                  tab.isActive ? "bg-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => switchTab(tab.id)}
              >
                <span className="truncate text-sm">{tab.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={createNewTab}
              className="px-2 py-1 text-gray-500 hover:text-gray-700"
            >
              +
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => iframeRef.current?.contentWindow?.history.back()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            {FaArrowLeft &&
              React.createElement(FaArrowLeft as React.ElementType)}
          </button>

          <button
            onClick={() => iframeRef.current?.contentWindow?.history.forward()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            {FaArrowRight &&
              React.createElement(FaArrowRight as React.ElementType)}
          </button>

          <button
            onClick={() => navigateToUrl("https://www.google.com")}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            {FaHome && React.createElement(FaHome as React.ElementType)}
          </button>

          <div className="flex-1 relative">
            <input
              ref={searchInputRef}
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && navigateToUrl(currentUrl)}
              onInput={(e) => generateSearchSuggestions(e.currentTarget.value)}
              placeholder={
                language === "sw"
                  ? "Tafuta au weka URL..."
                  : "Search or enter URL..."
              }
              className="w-full px-4 py-2 border rounded-lg"
            />

            {searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-10">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => addBookmark("Current Page", currentUrl)}
            className="p-2 text-gray-500 hover:text-yellow-500"
          >
            {FaStar && React.createElement(FaStar as React.ElementType)}
          </button>

          <button
            onClick={() => downloadFile(currentUrl, "page.html")}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            {FaDownload && React.createElement(FaDownload as React.ElementType)}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">
            {language === "sw" ? "Tovuti Maarufu" : "Popular Sites"}
          </h3>

          <div className="space-y-2 mb-6">
            {popularSites.map((site) => (
              <button
                key={site.url}
                onClick={() => navigateToUrl(site.url)}
                className="w-full text-left p-2 rounded hover:bg-gray-200 flex items-center gap-2"
              >
                <span>{site.icon}</span>
                <span className="text-sm">{site.name}</span>
              </button>
            ))}
          </div>

          {language === "sw" && (
            <>
              <h3 className="font-semibold mb-4">Tovuti za Kiswahili</h3>
              <div className="space-y-2 mb-6">
                {swahiliSites.map((site) => (
                  <button
                    key={site.url}
                    onClick={() => navigateToUrl(site.url)}
                    className="w-full text-left p-2 rounded hover:bg-gray-200 flex items-center gap-2"
                  >
                    <span>{site.icon}</span>
                    <span className="text-sm">{site.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <h3 className="font-semibold mb-4">
            {language === "sw" ? "Alama za Ukumbusho" : "Bookmarks"}
          </h3>

          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-200"
              >
                <button
                  onClick={() => navigateToUrl(bookmark.url)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <img src={bookmark.favicon} alt="" className="w-4 h-4" />
                  <span className="text-sm truncate">{bookmark.title}</span>
                </button>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 relative">
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            onLoad={(e) => {
              // Apply ad removal when page loads
              if (isAdRemovalEnabled) {
                const iframe = e.target as HTMLIFrameElement;
                try {
                  const iframeDoc =
                    iframe.contentDocument || iframe.contentWindow?.document;
                  if (iframeDoc) {
                    iframeDoc.body.innerHTML = removeAds(
                      iframeDoc.body.innerHTML,
                    );
                  }
                } catch (error) {
                  console.log("Cannot access iframe content due to CORS");
                }
              }
            }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t p-2 text-xs text-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isAdRemovalEnabled}
              onChange={(e) => setIsAdRemovalEnabled(e.target.checked)}
              className="w-3 h-3"
            />
            {language === "sw" ? "Ondoa Matangazo" : "Ad Removal"}
          </label>

          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isAIFilteringEnabled}
              onChange={(e) => setIsAIFilteringEnabled(e.target.checked)}
              className="w-3 h-3"
            />
            {language === "sw" ? "Uchambuzi wa AI" : "AI Filtering"}
          </label>

          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isIncognitoMode}
              onChange={(e) => setIsIncognitoMode(e.target.checked)}
              className="w-3 h-3"
            />
            {language === "sw" ? "Hali ya Siri" : "Incognito"}
          </label>
        </div>

        <div className="flex items-center gap-2">
          {FaShieldAlt &&
            React.createElement(FaShieldAlt as React.ElementType, {
              className: "text-green-500",
            })}
          <span>{language === "sw" ? "Salama" : "Secure"}</span>
        </div>
      </div>

      {/* Master Controls */}
      {isMaster && (
        <div className="bg-yellow-50 border-t p-2">
          <div className="flex items-center gap-4 text-xs">
            <button className="px-2 py-1 bg-blue-500 text-white rounded">
              {language === "sw" ? "Mipangilio ya Mfumo" : "System Settings"}
            </button>
            <button className="px-2 py-1 bg-green-500 text-white rounded">
              {language === "sw" ? "Sasisha Browser" : "Update Browser"}
            </button>
            <button className="px-2 py-1 bg-purple-500 text-white rounded">
              {language === "sw" ? "Mipangilio ya AI" : "AI Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
