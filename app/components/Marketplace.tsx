import React from 'react';

export default function Marketplace() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Marketplace</h3>
      <p className="text-slate-400 mb-4">Digital marketplace for plugins, templates, and extensions.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Available Items</span>
            <span className="text-blue-400 font-semibold">1,247 listings</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">892</div>
              <div className="text-xs text-slate-400">Plugins</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">234</div>
              <div className="text-xs text-slate-400">Templates</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">89</div>
              <div className="text-xs text-slate-400">Themes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">32</div>
              <div className="text-xs text-slate-400">Integrations</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Featured Items</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Advanced AI Analytics Plugin</div>
                <div className="text-slate-400 text-xs">By QMOI Labs • ⭐ 4.8 • $49.99</div>
              </div>
              <div className="text-green-400 text-xs">Popular</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QMOI Space Optimization Template</div>
                <div className="text-slate-400 text-xs">By Space Experts • ⭐ 4.9 • $29.99</div>
              </div>
              <div className="text-blue-400 text-xs">New</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QCity Dark Theme Pack</div>
                <div className="text-slate-400 text-xs">By Theme Masters • ⭐ 4.7 • $19.99</div>
              </div>
              <div className="text-purple-400 text-xs">Trending</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QVillage Data Integration</div>
                <div className="text-slate-400 text-xs">By DataFlow Inc • ⭐ 4.6 • $79.99</div>
              </div>
              <div className="text-yellow-400 text-xs">Premium</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Your Purchases</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-slate-300 text-sm">AI Enhancement Suite</div>
                <div className="text-slate-400 text-xs">Purchased 2 days ago • $99.99</div>
              </div>
              <div className="text-green-400 text-xs">Active</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-slate-300 text-sm">Space Analytics Dashboard</div>
                <div className="text-slate-400 text-xs">Purchased 1 week ago • $59.99</div>
              </div>
              <div className="text-green-400 text-xs">Active</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Browse Marketplace
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            Sell Items
          </button>
        </div>
      </div>
    </div>
  );
}
