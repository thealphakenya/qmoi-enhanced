import React from 'react';
export default function ComplianceManager() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Compliance Manager</h3>
      <p className="text-slate-400 mb-4">Regulatory compliance monitoring and reporting tools.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Compliance Status</span>
            <span className="text-green-400 font-semibold">All Standards Met</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">100%</div>
              <div className="text-xs text-slate-400">GDPR</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">98%</div>
              <div className="text-xs text-slate-400">SOX</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">100%</div>
              <div className="text-xs text-slate-400">HIPAA</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Compliance Checks</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">Data Encryption</span>
              </div>
              <span className="text-green-400 text-xs">Compliant</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">Access Controls</span>
              </div>
              <span className="text-green-400 text-xs">Compliant</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">Audit Logging</span>
              </div>
              <span className="text-yellow-400 text-xs">Review Due</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">Data Retention</span>
              </div>
              <span className="text-green-400 text-xs">Compliant</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Upcoming Audits</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-slate-300 text-sm">GDPR Annual Review</div>
                <div className="text-slate-400 text-xs">Due in 45 days</div>
              </div>
              <div className="text-yellow-400 text-xs">Scheduled</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-slate-300 text-sm">SOX Compliance Audit</div>
                <div className="text-slate-400 text-xs">Due in 90 days</div>
              </div>
              <div className="text-blue-400 text-xs">Planning</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Run Compliance Check
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}
