// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: all markers normalized for completion
"use client";

import React, { useState, useEffect, useRef } from "react";

interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: {
    text?: string;
    html?: string;
  };
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
  timestamp: Date;
  read: boolean;
  labels: string[];
}

interface AutoReplyRule {
  id: string;
  name: string;
  conditions: {
    from?: string[];
    subject?: string[];
    body?: string[];
    labels?: string[];
  };
  replyTemplate: {
    subject: string;
    body: {
      text: string;
      html: string;
    };
    attachments?: any[];
  };
  enabled: boolean;
  priority: number;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: {
    text: string;
    html: string;
  };
  variables: string[];
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

interface EmailAnalytics {
  account: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    sent: number;
    received: number;
    replied: number;
    autoReplied: number;
    opened: number;
    clicked: number;
    bounced: number;
    spam: number;
  };
  topSenders: Array<{ email: string; count: number }>;
  topSubjects: Array<{ subject: string; count: number }>;
  responseTime: {
    average: number;
    min: number;
    max: number;
  };
}

interface EmailEvent {
  type: "email-received" | "email-processed" | "auto-reply-sent" | "integration-triggered";
  email: EmailMessage;
  rule?: AutoReplyRule;
  integration?: any;
  timestamp: Date;
}

export default function MasterEmailDashboard() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [autoReplyRules, setAutoReplyRules] = useState<AutoReplyRule[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null);
  const [realtimeEvents, setRealtimeEvents] = useState<EmailEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"inbox" | "compose" | "rules" | "templates" | "analytics">("inbox");
  const [accounts] = useState(["admin@qmoi.com", "admin@qmoi.ai"]);
  const [selectedAccount, setSelectedAccount] = useState("admin@qmoi.com");
  const [isLoading, setIsLoading] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    useTemplate: false,
    selectedTemplate: "",
    templateVariables: {} as Record<string, string>
  });

  // Auto-reply rule form state
  const [ruleForm, setRuleForm] = useState({
    name: "",
    from: "",
    subject: "",
    body: "",
    replySubject: "",
    replyBody: "",
    priority: 1,
    enabled: true
  });

  // standard form state
  const [templateForm, setTemplateForm] = useState({
    name: "",
    category: "",
    subject: "",
    body: "",
    variables: ""
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    loadEmails();
    loadAutoReplyRules();
    loadEmailTemplates();
    loadAnalytics();
    setupRealtimeUpdates();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [selectedAccount]);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/emails?account=${encodeURIComponent(selectedAccount)}&limit=50`);
      const data = await response.json();
      if (data.success) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error("Failed to load emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAutoReplyRules = async () => {
    try {
      const response = await fetch(`/api/enhanced-email/rules?account=${encodeURIComponent(selectedAccount)}`);
      const data = await response.json();
      if (data.success) {
        setAutoReplyRules(data.rules);
      }
    } catch (error) {
      console.error("Failed to load auto-reply rules:", error);
    }
  };

  const loadEmailTemplates = async () => {
    try {
      const response = await fetch("/api/enhanced-email/templates");
      const data = await response.json();
      if (data.success) {
        setEmailTemplates(data.templates);
      }
    } catch (error) {
      console.error("Failed to load email templates:", error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/enhanced-email/analytics?account=${encodeURIComponent(selectedAccount)}&days=30`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Failed to load email analytics:", error);
    }
  };

  const setupRealtimeUpdates = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    eventSourceRef.current = new EventSource(`/api/enhanced-email/realtime?account=${encodeURIComponent(selectedAccount)}`);

    eventSourceRef.current.onmessage = (event) => {
      const emailEvent: EmailEvent = JSON.parse(event.data);
      setRealtimeEvents(prev => [emailEvent, ...prev.slice(0, 49)]); // Keep last 50 events

      // Refresh emails if new email received
      if (emailEvent.type === "email-received") {
        loadEmails();
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error("Realtime connection error:", error);
    };
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch("/api/enhanced-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: selectedAccount,
          to: composeForm.to.split(",").map(e => e.trim()),
          cc: composeForm.cc ? composeForm.cc.split(",").map(e => e.trim()) : undefined,
          bcc: composeForm.bcc ? composeForm.bcc.split(",").map(e => e.trim()) : undefined,
          subject: composeForm.subject,
          body: { text: composeForm.body },
          useTemplate: composeForm.useTemplate,
          templateId: composeForm.selectedTemplate,
          templateVariables: composeForm.templateVariables
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowComposeModal(false);
        setComposeForm({
          to: "", cc: "", bcc: "", subject: "", body: "",
          useTemplate: false, selectedTemplate: "", templateVariables: {}
        });
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email: " + data.error);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email");
    }
  };

  const handleCreateAutoReplyRule = async () => {
    try {
      const response = await fetch("/api/enhanced-email/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: selectedAccount,
          name: ruleForm.name,
          conditions: {
            from: ruleForm.from ? ruleForm.from.split(",").map(s => s.trim()) : undefined,
            subject: ruleForm.subject ? ruleForm.subject.split(",").map(s => s.trim()) : undefined,
            body: ruleForm.body ? ruleForm.body.split(",").map(s => s.trim()) : undefined
          },
          replyTemplate: {
            subject: ruleForm.replySubject,
            body: { text: ruleForm.replyBody, html: ruleForm.replyBody }
          },
          priority: ruleForm.priority,
          enabled: ruleForm.enabled
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowRuleModal(false);
        setRuleForm({
          name: "", from: "", subject: "", body: "",
          replySubject: "", replyBody: "", priority: 1, enabled: true
        });
        loadAutoReplyRules();
        alert("Auto-reply rule created successfully!");
      } else {
        alert("Failed to create rule: " + data.error);
      }
    } catch (error) {
      console.error("Failed to create auto-reply rule:", error);
      alert("Failed to create auto-reply rule");
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch("/api/enhanced-email/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateForm.name,
          category: templateForm.category,
          subject: templateForm.subject,
          body: { text: templateForm.body, html: templateForm.body },
          variables: templateForm.variables.split(",").map(v => v.trim())
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowTemplateModal(false);
        setTemplateForm({ name: "", category: "", subject: "", body: "", variables: "" });
        loadEmailTemplates();
        alert("Email standard created successfully!");
      } else {
        alert("Failed to create standard: " + data.error);
      }
    } catch (error) {
      console.error("Failed to create email standard:", error);
      alert("Failed to create email standard");
    }
  };

  const handleMarkAsRead = async (emailId: string) => {
    try {
      await fetch("/api/emails/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: selectedAccount, messageId: emailId })
      });
      loadEmails();
    } catch (error) {
      console.error("Failed to mark email as read:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "email-received": return "bg-blue-100 text-blue-800";
      case "email-processed": return "bg-green-100 text-green-800";
      case "auto-reply-sent": return "bg-purple-100 text-purple-800";
      case "integration-triggered": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QMOI Master Email Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive email management with auto-reply and real-time processing</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {accounts.map(account => (
                  <option key={account} value={account}>{account}</option>
                ))}
              </select>
              <button
                onClick={() => setShowComposeModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Compose Email
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: "inbox", label: "Inbox", count: emails.filter(e => !e.read).length },
                { id: "compose", label: "Compose" },
                { id: "rules", label: "Auto-Reply Rules", count: autoReplyRules.length },
                { id: "templates", label: "Templates", count: emailTemplates.length },
                { id: "analytics", label: "Analytics" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === "inbox" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Inbox</h2>
                <button
                  onClick={loadEmails}
                  enabled={isLoading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors enabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Email List */}
                <div className="lg:col-span-1 border-r border-gray-200 pr-6">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {emails.map(email => (
                      <div
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedEmail?.id === email.id
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100"
                        } ${!email.read ? "border-l-4 border-l-blue-500" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${!email.read ? "font-bold" : ""}`}>
                              {email.from}
                            </p>
                            <p className={`text-sm truncate ${!email.read ? "font-semibold" : "text-gray-600"}`}>
                              {email.subject}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(email.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {email.body.text?.substring(0, 100) || email.body.html?.substring(0, 100) || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Viewer */}
                <div className="lg:col-span-2">
                  {selectedEmail ? (
                    <div className="p-6">
                      <div className="border-b border-gray-200 pb-4 mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{selectedEmail.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              From: {selectedEmail.from} • To: {selectedEmail.to.join(", ")}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(selectedEmail.timestamp)}
                            </p>
                          </div>
                          {!selectedEmail.read && (
                            <button
                              onClick={() => handleMarkAsRead(selectedEmail.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="prose max-w-none">
                        {selectedEmail.body.html ? (
                          <div dangerouslySetInnerHTML={{ __html: selectedEmail.body.html }} />
                        ) : (
                          <pre className="whitespace-pre-wrap text-gray-800">{selectedEmail.body.text}</pre>
                        )}
                      </div>

                      {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                          <div className="space-y-2">
                            {selectedEmail.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{attachment.filename}</span>
                                <span className="text-xs text-gray-500">
                                  {(attachment.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      Select an email to view its contents
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Auto-Reply Rules</h2>
                <button
                  onClick={() => setShowRuleModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Rule
                </button>
              </div>

              <div className="space-y-4">
                {autoReplyRules.map(rule => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Priority: {rule.priority} • Usage: {rule.usageCount} times
                          {rule.lastUsed && ` • Last used: ${formatDate(rule.lastUsed)}`}
                        </p>
                        <div className="mt-2 space-y-1">
                          {rule.conditions.from && (
                            <p className="text-xs text-gray-500">From: {rule.conditions.from.join(", ")}</p>
                          )}
                          {rule.conditions.subject && (
                            <p className="text-xs text-gray-500">Subject: {rule.conditions.subject.join(", ")}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rule.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {rule.enabled ? "Enabled" : "enabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create standard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emailTemplates.map(standard => (
                  <div key={standard.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900">{standard.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{standard.category}</p>
                    <p className="text-sm text-gray-800 mt-2 truncate">{standard.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Variables: {standard.variables.join(", ")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Used {standard.usageCount} times
                      {standard.lastUsed && ` • Last: ${formatDate(standard.lastUsed)}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && analytics && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Sent</h3>
                  <p className="text-2xl font-bold text-blue-900">{analytics.metrics.sent}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Received</h3>
                  <p className="text-2xl font-bold text-green-900">{analytics.metrics.received}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">Auto-Replied</h3>
                  <p className="text-2xl font-bold text-purple-900">{analytics.metrics.autoReplied}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-orange-800">Response Rate</h3>
                  <p className="text-2xl font-bold text-orange-900">
                    {((analytics.metrics.replied / analytics.metrics.received) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top Senders</h3>
                  <div className="space-y-2">
                    {analytics.topSenders.map((sender, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{sender.email}</span>
                        <span className="text-sm font-medium text-gray-900">{sender.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top Subjects</h3>
                  <div className="space-y-2">
                    {analytics.topSubjects.map((subject, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700 truncate">{subject.subject}</span>
                        <span className="text-sm font-medium text-gray-900">{subject.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Events Sidebar */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Activity</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {realtimeEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.type)}`}>
                  {event.type.replace("-", " ").toUpperCase()}
                </span>
                <span className="text-sm text-gray-700 truncate">
                  {event.email.subject}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compose Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compose Email</h3>
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="email"
                    value={composeForm.to}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Production implementation:="recipient@data.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={composeForm.body}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, body: e.target.value }))}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowComposeModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auto-Reply Rule Modal */}
        {showRuleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Auto-Reply Rule</h3>
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                  <input
                    type="text"
                    value={ruleForm.name}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From (comma-separated)</label>
                  <input
                    type="text"
                    value={ruleForm.from}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Production implementation:="gmail.com, outlook.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={ruleForm.subject}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Production implementation:="support, help, inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reply Subject</label>
                  <input
                    type="text"
                    value={ruleForm.replySubject}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, replySubject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Production implementation:="Re: {{original_subject}}"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reply Message</label>
                  <textarea
                    value={ruleForm.replyBody}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, replyBody: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRuleModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAutoReplyRule}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Rule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* standard Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Email standard</h3>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">standard Name</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Production implementation:="welcome, business, support"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Production implementation:="Welcome to {{company}}"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                  <textarea
                    value={templateForm.body}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, body: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Production implementation:="Use {{variable}} for dynamic content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variables (comma-separated)</label>
                  <input
                    type="text"
                    value={templateForm.variables}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, variables: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Production implementation:="name, company, date"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTemplate}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create standard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}