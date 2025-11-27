"use client"
import React from 'react';
import { AIRequestRouter } from '../src/services/AIRequestRouter';
import { MultiUserSessionManager } from '../src/services/MultiUserSessionManager';
import { ContextEngine } from '../src/services/ContextEngine';
import { useMaster } from './MasterContext';

const sessionManager = new MultiUserSessionManager();
const contextEngine = new ContextEngine();
const aiRequestRouter = new AIRequestRouter(sessionManager, contextEngine);

const masterUserId = 'master'; // fallback for master actions

export default function QFileManager() {
  const { isMaster } = useMaster() || { isMaster: false };

  const handleEditKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value;
      if (!val) return;
      const response = await aiRequestRouter.handleRequest({ userId: masterUserId, source: 'chat', message: `edit file ${val}` });
      alert(response && (response as any).message ? (response as any).message : 'Edit request sent.');
    }
  };

  const handleVersionKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value;
      if (!val) return;
      const response = await aiRequestRouter.handleRequest({ userId: masterUserId, source: 'chat', message: `version ${val}` });
      alert(response && (response as any).message ? (response as any).message : 'Version info requested.');
    }
  };

  if (!isMaster) return null;

  return (
    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">👑</span>
        <span className="font-medium text-yellow-800">Master Controls</span>
      </div>
      <div className="text-sm text-yellow-700 mb-2">Advanced file operations, AI organization, and system-wide file management available.</div>
      <div className="flex flex-col gap-2">
        <input type="text" placeholder="Edit file (path or name)" aria-label="Edit file" className="p-1 border rounded" onKeyDown={handleEditKey} />
        <input type="text" placeholder="Show version/changelog (file or module)" aria-label="Show version" className="p-1 border rounded" onKeyDown={handleVersionKey} />
      </div>
    </div>
  );
}