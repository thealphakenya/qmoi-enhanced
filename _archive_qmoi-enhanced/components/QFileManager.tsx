import React from 'react';
import { AIRequestRouter } from '../src/services/AIRequestRouter';
import { MultiUserSessionManager } from '../src/services/MultiUserSessionManager';
import { ContextEngine } from '../src/services/ContextEngine';
import { useMaster } from './MasterContext';

const sessionManager = new MultiUserSessionManager();
const contextEngine = new ContextEngine();
const aiRequestRouter = new AIRequestRouter(sessionManager, contextEngine);

const { isMaster } = useMaster();
const masterUserId = 'master'; // fallback for master actions

// In the master-only features section, add file edit and version info
{isMaster && (
  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="flex items-center mb-2">
      <span className="text-2xl mr-2">👑</span>
      <span className="font-medium text-yellow-800">Master Controls</span>
    </div>
    <div className="text-sm text-yellow-700 mb-2">
      Advanced file operations, AI organization, and system-wide file management available.
    </div>
    <div className="flex flex-col gap-2">
      <input type="text" placeholder="Edit file (path or name)" className="p-1 border rounded" onKeyDown={async e => {
        if (e.key === 'Enter' && e.currentTarget.value) {
          const response = await aiRequestRouter.handleRequest({
            userId: masterUserId,
            source: 'chat',
            message: `edit file ${e.currentTarget.value}`,
          });
          alert(response && response.message ? response.message : 'Edit request sent.');
        }
      }} />
      <input type="text" placeholder="Show version/changelog (file or module)" className="p-1 border rounded" onKeyDown={async e => {
        if (e.key === 'Enter' && e.currentTarget.value) {
          const response = await aiRequestRouter.handleRequest({
            userId: masterUserId,
            source: 'chat',
            message: `version ${e.currentTarget.value}`,
          });
          alert(response && response.message ? response.message : 'Version info requested.');
        }
      }} />
    </div>
  </div>
)} 