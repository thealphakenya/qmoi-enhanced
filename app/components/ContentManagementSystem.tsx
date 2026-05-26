import React from 'react';
export default function ContentManagementSystem() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Content Management System</h3>
      <p className="text-slate-400 mb-4">Content creation, editing, and publishing tools.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Content Library</span>
            <span className="text-blue-400 font-semibold">1,247 items</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">892</div>
              <div className="text-xs text-slate-400">Published</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">234</div>
              <div className="text-xs text-slate-400">Draft</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">121</div>
              <div className="text-xs text-slate-400">Archived</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Recent Content</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QMOI AI Update</div>
                <div className="text-slate-400 text-xs">Blog Post • Published 2 hours ago</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs">Live</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Space Optimization Guide</div>
                <div className="text-slate-400 text-xs">Documentation • Draft</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-400 text-xs">Draft</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QCity Features</div>
                <div className="text-slate-400 text-xs">Feature Article • Published 1 day ago</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs">Live</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Create Content
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            Manage Media
          </button>
        </div>
      </div>
    </div>
  );
}
