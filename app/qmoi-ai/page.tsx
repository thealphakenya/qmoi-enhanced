"use client";

import React from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { persistUserToStorage } from '@/app/lib/auth/persistence';
import { log as logger } from '@/lib/logger';
import QMOIChat from '@/src/components/qmoi/QMOIChat';
import AvatarDisplay from '@/src/components/qmoi/AvatarDisplay';

export default function Page() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login?.('user');
      persistUserToStorage(user);
      logger.info('User logged in via qmoi-ai page');
    } catch (err) {
      logger.error('Login failed', err as any);
    }
  };

  const handleLogout = async () => {
    try {
      await logout?.();
      logger.info('User logged out via qmoi-ai page');
    } catch (err) {
      logger.error('Logout failed', err as any);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="qmoi-ai-route p-4">
      {!isAuthenticated ? (
        <div>
          <button onClick={handleLogin} className="btn">Sign in</button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <button onClick={handleLogout} className="btn">Sign out</button>
          </div>
          <QMOIChat />
          <AvatarDisplay name={user?.name || "QMOI User"} isActive={isAuthenticated} />
        </div>
      )}
    </div>
  );
}
