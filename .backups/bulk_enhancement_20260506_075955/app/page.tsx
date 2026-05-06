import React from 'react';
import Link from "next/link";

const featureLinks = [
  {
    href: "/devices",
    title: "Device Management",
    description: "Monitor and manage connected devices across the QMOI ecosystem.",
  },
  {
    href: "/admin",
    title: "Admin Dashboard",
    description: "Access administrative systems, health metrics, and monitoring tools.",
  },
  {
    href: "/qcity",
    title: "QCity Dashboard",
    description: "Explore QCity operations and spatial interfaces.",
  },
  {
    href: "/qmoi-ai",
    title: "QMOI AI",
    description: "Open the active QMOI AI assistant route in the Next.js application.",
  },
  {
    href: "/qmoi-space",
    title: "QMOI Space",
    description: "Open the active QMOI Space route in the Next.js application.",
  },
  {
    href: "/master/email",
    title: "Master Email Dashboard",
    description: "Master-level communication dashboard for email and messaging.",
  },
  {
    href: "/master/links",
    title: "Master Links Dashboard",
    description: "Manage and monitor master-level link operations.",
  },
  {
    href: "/dev",
    title: "Developer Utilities",
    description: "Developer tools, self-service pages, and automation utilities.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <section className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">QMOI Enhanced</p>
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl">Actual UI Feature Hub</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            This site is built from a large QMOI UI component inventory and application tree. Use the feature links below to access the actual dashboards, tools, and UI flows documented in `COMPONENTS.md`, `UI_COMPONENTS.md`, and `TREE.md`.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureLinks.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group block rounded-3xl border border-slate-800 bg-slate-900/90 p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-500 hover:bg-slate-900"
            >
              <h2 className="text-2xl font-semibold text-white transition group-hover:text-blue-400">
                {feature.title}
              </h2>
              <p className="mt-3 text-slate-400">{feature.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-300">
                Open page
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/90 p-8">
          <h2 className="text-3xl font-bold text-white">Developer & UI Inventory</h2>
          <p className="mt-4 text-slate-300">
            The documented UI inventory and project structure are maintained in root Markdown files. The application routes above connect to actual runtime features and the QMOI component architecture.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-200 transition hover:border-blue-500"
              href="/COMPONENTS.md"
            >
              <strong>COMPONENTS.md</strong>
              <p className="mt-2 text-slate-400">React component inventory and feature categorization.</p>
            </a>
            <a
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-200 transition hover:border-blue-500"
              href="/UI_COMPONENTS.md"
            >
              <strong>UI_COMPONENTS.md</strong>
              <p className="mt-2 text-slate-400">Shared UI primitives inventory for the system.</p>
            </a>
            <a
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-200 transition hover:border-blue-500"
              href="/TREE.md"
            >
              <strong>TREE.md</strong>
              <p className="mt-2 text-slate-400">Repository structure and developer architecture guide.</p>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
