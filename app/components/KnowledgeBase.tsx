import React from 'react';
export default function KnowledgeBase() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Knowledge Base</h3>
      <p className="text-slate-400 mb-4">Centralized documentation and knowledge management system.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Knowledge Repository</span>
            <span className="text-blue-400 font-semibold">2,847 articles</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">1,923</div>
              <div className="text-xs text-slate-400">Published</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">456</div>
              <div className="text-xs text-slate-400">In Review</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">468</div>
              <div className="text-xs text-slate-400">Drafts</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Popular Categories</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QMOI AI Documentation</div>
                <div className="text-slate-400 text-xs">245 articles • Updated yesterday</div>
              </div>
              <div className="text-blue-400 text-xs">Most Viewed</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QMOI Space Guides</div>
                <div className="text-slate-400 text-xs">189 articles • Updated 3 days ago</div>
              </div>
              <div className="text-green-400 text-xs">Trending</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QCity API Reference</div>
                <div className="text-slate-400 text-xs">156 articles • Updated last week</div>
              </div>
              <div className="text-purple-400 text-xs">Technical</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Troubleshooting</div>
                <div className="text-slate-400 text-xs">98 articles • Updated 2 weeks ago</div>
              </div>
              <div className="text-yellow-400 text-xs">Helpful</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Recent Updates</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-slate-300 text-sm">QMOI AI v2.1 Release Notes</div>
                <div className="text-slate-400 text-xs">Published 2 hours ago</div>
              </div>
              <div className="text-green-400 text-xs">New</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-slate-300 text-sm">Space Optimization Best Practices</div>
                <div className="text-slate-400 text-xs">Updated 1 day ago</div>
              </div>
              <div className="text-blue-400 text-xs">Updated</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Search Knowledge Base
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            Contribute
          </button>
        </div>
      </div>
    </div>
  );
}
