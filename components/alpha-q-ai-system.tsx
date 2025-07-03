"use client"

import React from 'react';
import Image from 'next/image';
import '../app/globals.css';
import QCityDevicePanel from './q-city/QCityDevicePanel';

export default function AlphaQAILoading() {
  return (
    <div className="qai-loading">
      <span className="qai-emoji">🚀</span>
      <Image src="/placeholder-logo.svg" alt="Q-A Logo" width={80} height={80} />
      <div style={{ marginTop: 16, fontWeight: 'bold' }}>
        Loading Alpha-Q-AI System...<br />
        <span style={{ color: 'var(--luminous-green)' }}>Loyal. Dependable. Powerful.</span>
      </div>
    </div>
  );
}
