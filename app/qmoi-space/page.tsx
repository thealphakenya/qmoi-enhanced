"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import AdminDashboard from "../components/AdminDashboard";
import ChatMessaging from "../components/ChatMessaging";
import QMOIAutoFixDashboard from "../components/QMOIAutoFixDashboard";
import QMOIAutoSetup from "../components/QMOIAutoSetup";
import FileUploadDownload from "../components/FileUploadDownload";
import VisualEnhancement from "../components/VisualEnhancement";
import AudibleConversation from "../components/AudibleConversation";
import ClientUISettings from "../components/ClientUISettings";
import { QMOIMasterDashboard } from "../components/QMOIMasterDashboard";
import SponsoredUsersManager from "../components/SponsoredUsersManager";
import UserProfile from "../components/user/UserProfile";
import WalletList from "../components/wallet/WalletList";
import RegisterForm from "../components/auth/RegisterForm";
import QiSpaces from "../components/QiSpaces";
import LcSpaces from "../components/LcSpaces";
import FloatingPreviewWindow from "../components/FloatingPreviewWindow";
import WalletPanel from "../components/WalletPanel";
import CollaborationHub from "../components/CollaborationHub";
import IntegrationManager from "../components/IntegrationManager";
import WorkflowAutomationEngine from "../components/WorkflowAutomationEngine";
import ContentManagementSystem from "../components/ContentManagementSystem";

const defaultStats = {
  supportedPlatforms: '12+',
  totalBuilds: '40+',
  validationSuccess: '100%',
  packageSize: '2.5GB',
};

const defaultMarketplace = [
  { id: 'MKT-01', title: 'Premium Dataset Exchange', price: '$99', access: 'subscription' },
  { id: 'MKT-02', title: 'AI Model Hosting', price: '$149', access: 'monthly' },
  { id: 'MKT-03', title: 'Workflow Automation Pack', price: '$49', access: 'one-time' },
];

export default function QMoiSpacePage() {
  const [showComponents, setShowComponents] = useState(true);
  const [stats, setStats] = useState(defaultStats);
  const [marketplace, setMarketplace] = useState(defaultMarketplace);
  const [activeProjects, setActiveProjects] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchSpaceData() {
      try {
        const res = await fetch('/api/qi-spaces', { cache: 'no-store' });
        const data = await res.json();
        if (!active) return;
        if (data?.success) {
          setStats(data.stats || defaultStats);
          setMarketplace(data.marketplace || defaultMarketplace);
          setActiveProjects(data.activeProjects || []);
          setLastUpdated(data.lastUpdated || '');
        }
      } catch (error) {
        console.error('Failed to load QMOI Space data:', error);
      }
    }

    fetchSpaceData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">QMOI Space 🌐</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">Spatial Collaboration Hub</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                Advanced AI platform for production, gaming, and revenue generation with dataset management and model deployment.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active UI</p>
              <p className="mt-2 text-3xl font-semibold text-violet-300">Next.js App</p>
            </div>
          </div>
        </section>

        {/* Welcome Card */}
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Welcome to QMOI Space</h2>
          <p className="text-slate-300 text-lg">
            Advanced AI platform for production, gaming, and revenue generation with comprehensive dataset management and collaborative model deployment.
          </p>
        </section>

        {/* Platform Statistics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-violet-400">{stats.supportedPlatforms}</div>
            <div className="text-slate-400">Supported Platforms</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-violet-400">{stats.totalBuilds}</div>
            <div className="text-slate-400">Total Builds</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.validationSuccess}</div>
            <div className="text-slate-400">Validation Success</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-violet-400">{stats.packageSize}</div>
            <div className="text-slate-400">Package Size</div>
          </div>
        </section>

        {/* Core Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-2">production</h3>
            <p className="text-slate-400">Full production environment with automated deployment and scaling.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2">Gaming</h3>
            <p className="text-slate-400">Advanced gaming platform with AI-driven experiences and multiplayer support.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Revenue</h3>
            <p className="text-slate-400">Revenue generation tools with marketplace integration and monetization analytics.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-xl font-semibold mb-2">Cloud</h3>
            <p className="text-slate-400">Cloud integration ready with multi-provider support and auto-scaling.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Security</h3>
            <p className="text-slate-400">Enterprise security with encryption, access control, and compliance monitoring.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
            <p className="text-slate-400">Works everywhere with responsive design and progressive web app capabilities.</p>
          </div>
        </section>

        {/* Dataset Management Panel */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Dataset Catalog</h2>
          <p className="text-slate-400 mb-4">Manage, share, and analyze data generated across the QMOI ecosystem.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Community Dataset Catalog</h4>
              <p className="text-sm text-slate-400">Browse and access shared datasets from the community.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Secure Sharing Controls</h4>
              <p className="text-sm text-slate-400">Manage permissions and access to your datasets.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">AI-Powered Recommendations</h4>
              <p className="text-sm text-slate-400">Get intelligent suggestions for dataset usage.</p>
            </div>
          </div>
        </section>

        {/* Model Deployment Interface */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">AI Model Staging</h2>
          <p className="text-slate-400 mb-4">Collaborative AI model development with production sync and inference.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Model Discovery</h4>
              <p className="text-sm text-slate-400">Find and explore available AI models.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Continuous Training</h4>
              <p className="text-sm text-slate-400">Automated model training pipelines.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Deployment History</h4>
              <p className="text-sm text-slate-400">Track model versions and deployments.</p>
            </div>
          </div>
        </section>

        {/* Marketplace Dashboard */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Revenue Generation</h2>
              <p className="text-slate-400">Monetization tools with marketplace integration and analytics.</p>
            </div>
            {lastUpdated && (
              <span className="text-sm text-slate-500">Updated {new Date(lastUpdated).toLocaleString()}</span>
            )}
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketplace.map((item) => (
              <div key={item.id} className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-slate-400 mb-2">{item.access}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded">{item.price}</span>
                  <button className="text-xs bg-blue-600 px-2 py-1 rounded">Buy</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Projects */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
          <p className="text-slate-400 mb-4">Monitor current QMOI Space collaboration and deployment initiatives.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeProjects.length > 0 ? (
              activeProjects.map((project) => (
                <div key={project.id} className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{project.name}</h4>
                  <p className="text-sm text-slate-400 mb-2">Status: {project.status}</p>
                  <button className="text-xs bg-violet-600 px-2 py-1 rounded">View Project</button>
                </div>
              ))
            ) : (
              <div className="bg-slate-800 p-4 rounded-lg text-slate-300">No active projects available yet.</div>
            )}
          </div>
        </section>

        {/* QVillage Integration */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Community Workspace</h2>
          <p className="text-slate-400 mb-4">Collaborative dataset sharing and model development coordination.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Dataset Sharing</h4>
              <p className="text-sm text-slate-400">Share datasets with the community securely.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Model Collaboration</h4>
              <p className="text-sm text-slate-400">Work together on AI model development.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Workflow Templates</h4>
              <p className="text-sm text-slate-400">Access shared workflow templates and best practices.</p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="rounded-3xl bg-violet-600 hover:bg-violet-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">Open Dashboard</div>
          </button>
          <button className="rounded-3xl bg-blue-600 hover:bg-blue-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🎮</div>
            <div className="font-semibold">Gaming Hub</div>
          </button>
          <button className="rounded-3xl bg-green-600 hover:bg-green-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">💰</div>
            <div className="font-semibold">Revenue Tools</div>
          </button>
          <button className="rounded-3xl bg-slate-600 hover:bg-slate-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold">Documentation</div>
          </button>
          <button className="rounded-3xl bg-orange-600 hover:bg-orange-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🗃️</div>
            <div className="font-semibold">Dataset Manager</div>
          </button>
          <button className="rounded-3xl bg-purple-600 hover:bg-purple-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-semibold">Model Deployer</div>
          </button>
          <button className="rounded-3xl bg-red-600 hover:bg-red-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🏪</div>
            <div className="font-semibold">Marketplace</div>
          </button>
          <Link href="/qvillage" className="rounded-3xl bg-emerald-600 hover:bg-emerald-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-semibold">QVillage</div>
          </Link>
        </section>

        {/* Navigation */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">Interactive Links</h2>
            <p className="mt-3 text-slate-400">Follow the active route to access QMOI system pages and avoid the old static asset path.</p>
            <Link href="/qmoi-ai" className="mt-6 inline-flex rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500">
              Open QMOI AI
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">Developer Tools</h2>
            <p className="mt-3 text-slate-400">Use the developer utilities for tracing, diagnostics, and internal tooling in this workspace.</p>
            <Link href="/dev" className="mt-6 inline-flex rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-600">
              Open Dev Tools
            </Link>
          </div>
        </section>

        {/* Integrated UI Components */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Embedded UI Modules</h2>
              <p className="mt-2 text-sm text-slate-400">Show components documented for QMOI Space integration.</p>
            </div>
            <button
              onClick={() => setShowComponents((current) => !current)}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              {showComponents ? 'Hide Components' : 'Show Components'}
            </button>
          </div>
          {showComponents ? (
            <div className="mt-6 space-y-6">
              <AdminDashboard />
              <ChatMessaging />
              <QMOIAutoFixDashboard />
              <QMOIAutoSetup />
              <AudibleConversation />
              <FileUploadDownload />
              <VisualEnhancement />
              <ClientUISettings />
              <div className="grid gap-6 md:grid-cols-2">
                <UserProfile />
                <WalletList />
              </div>
              <RegisterForm />
              <SponsoredUsersManager />
              <QMOIMasterDashboard />
              <QiSpaces />
              <LcSpaces />
              <FloatingPreviewWindow />
              <WalletPanel />
              <CollaborationHub />
              <IntegrationManager />
              <WorkflowAutomationEngine />
              <ContentManagementSystem />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-slate-300">
              These components are the documented UI building blocks for the QMOI Space experience.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
