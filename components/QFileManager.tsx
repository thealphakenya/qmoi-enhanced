import React, { useMemo, useState } from 'react';
import { AIRequestRouter } from '../src/services/AIRequestRouter';
import { MultiUserSessionManager } from '../src/services/MultiUserSessionManager';
import { ContextEngine } from '../src/services/ContextEngine';
import { useMaster } from './MasterContext';

export default function QFileManager(): JSX.Element {
  const { isMaster, adminToken } = useMaster();
  const [editTarget, setEditTarget] = useState('');
  const [versionTarget, setVersionTarget] = useState('');

  const sessionManager = useMemo(() => new MultiUserSessionManager(), []);
  const contextEngine = useMemo(() => new ContextEngine(), []);
  const aiRequestRouter = useMemo(() => new AIRequestRouter(sessionManager, contextEngine), [sessionManager, contextEngine]);

  const masterUserId = 'master'; // fallback id used when routing master chat requests

  async function sendMasterRequest(message: string) {
    try {
      // route via AIRequestRouter (server-side handling expected)
      const response = await aiRequestRouter.handleRequest({ userId: masterUserId, source: 'chat', message, token: adminToken });
      return response;
    } catch (err) {
      console.error('master request failed', err);
      return { ok: false, message: String(err) };
    }
  }

  return (
    <div>
      {isMaster && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">👑</span>
            <span className="font-medium text-yellow-800">Master Controls</span>
          </div>
          <div className="text-sm text-yellow-700 mb-2">Advanced file operations, AI organization, and system-wide file management available.</div>
          <div className="flex flex-col gap-2">
            <input
              value={editTarget}
              onChange={(e) => setEditTarget(e.target.value)}
              type="text"
              placeholder="Edit file (path or name)"
              className="p-1 border rounded"
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && editTarget) {
                  const res = await sendMasterRequest(`edit file ${editTarget}`);
                  alert(res && res.message ? res.message : 'Edit request sent.');
                }
              }}
            />
            <input
              value={versionTarget}
              onChange={(e) => setVersionTarget(e.target.value)}
              type="text"
              placeholder="Show version/changelog (file or module)"
              className="p-1 border rounded"
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && versionTarget) {
                  const res = await sendMasterRequest(`version ${versionTarget}`);
                  alert(res && res.message ? res.message : 'Version info requested.');
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}