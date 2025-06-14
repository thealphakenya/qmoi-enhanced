"use client"
import React, { useState, useRef } from "react"
import { Chatbot } from "@/components/Chatbot"
import { motion, AnimatePresence } from "framer-motion"
import { AIProvider, useAIContext } from "./AIContext";

export const FloatingAQ: React.FC = () => {
  const {
    chatHistory, setChatHistory,
    aiHealth, deviceHealth
  } = useAIContext();

  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 40, y: 40 })
  const dragRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  // Chatbot state
  const [selectedModel, setSelectedModel] = useState<string>("Auto")

  // Modal state for advanced features
  const [modal, setModal] = useState<
    null | 'image' | 'wallet' | 'automation' | 'settings' | 'device-health' | 'bluetooth' | 'globalcall' | 'globalvideocall' | 'globalmail' | 'globalfiletransfer' | 'wifi'
    | 'price-product' | 'download' | 'farm-business' | 'map-location'
    | 'emergency' | 'file-categorizer' | 'file-explorer'
  >(null)

  // Wallet/Finance state
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState<string|null>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  // Define a type for wallet transactions
  interface WalletTransaction {
    id?: string | number;
    type?: string;
    side?: string;
    amount?: number;
    price?: number;
    result?: string;
    status?: string;
    rationale?: string;
    timestamp?: string | number | Date;
  }
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

  // Automation/Marketing state
  const [automationLoading, setAutomationLoading] = useState(false)
  const [automationError, setAutomationError] = useState<string|null>(null)
  // Define a type for automation jobs
  interface AutomationJob {
    id?: string | number;
    [key: string]: unknown;
  }
  const [automationJobs, setAutomationJobs] = useState<AutomationJob[]>([]);

  // AI Image/Animation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string|null>(null);
  const [imageUrl, setImageUrl] = useState<string|null>(null);

  // Floating A-Q settings state
  const [alwaysOn, setAlwaysOn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aq-always-on') === 'true';
    }
    return false;
  });
  const [autoStart, setAutoStart] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aq-auto-start') === 'true';
    }
    return false;
  });

  // Speak/Voice state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aq-voice-uri') || null;
    }
    return null;
  });
  const [showVoicePicker, setShowVoicePicker] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aq-dark-mode') === 'true';
    }
    return false;
  });

  // Device/AI health state
  const [healthScanRunning, setHealthScanRunning] = useState(false);
  const [healthScanResult, setHealthScanResult] = useState<string|null>(null);
  const [selfHealRunning, setSelfHealRunning] = useState(false);
  const [selfHealResult, setSelfHealResult] = useState<string|null>(null);

  // Persist settings
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aq-always-on', alwaysOn ? 'true' : 'false');
      localStorage.setItem('aq-auto-start', autoStart ? 'true' : 'false');
    }
  }, [alwaysOn, autoStart]);

  // Persist dark mode
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aq-dark-mode', darkMode ? 'true' : 'false');
      document.body.classList.toggle('aq-dark', darkMode);
    }
  }, [darkMode]);

  // Auto-open Floating A-Q if alwaysOn or autoStart is enabled
  React.useEffect(() => {
    if ((alwaysOn || autoStart) && !open) {
      setOpen(true);
    }
  }, [alwaysOn, autoStart])

  // Load available voices
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const populateVoices = () => {
        const v = window.speechSynthesis.getVoices();
        setVoices(v);
        // If no voice selected, show picker
        if (!selectedVoiceURI && v.length > 0) setShowVoicePicker(true);
      };
      populateVoices();
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
  }, []);

  // Persist selected voice
  React.useEffect(() => {
    if (selectedVoiceURI && typeof window !== 'undefined') {
      localStorage.setItem('aq-voice-uri', selectedVoiceURI);
    }
  }, [selectedVoiceURI]);

  // Speak text with selected voice
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.voiceURI === selectedVoiceURI) || voices[0];
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  };

  // Find last AI message
  const lastAIMessage = chatHistory.slice().reverse().find(m => m.type === 'ai')?.text || '';

  // Drag handlers (with useCallback for performance, and touch support)
  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [pos.x, pos.y]);

  const onMouseMove = React.useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  }, []);

  const onMouseUp = React.useCallback(() => {
    dragging.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  // Touch drag support
  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - pos.x,
      y: touch.clientY - pos.y,
    };
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  }, [pos.x, pos.y]);

  const onTouchMove = React.useCallback((e: TouchEvent) => {
    if (!dragging.current) return;
    const touch = e.touches[0];
    setPos({ x: touch.clientX - offset.current.x, y: touch.clientY - offset.current.y });
  }, []);

  const onTouchEnd = React.useCallback(() => {
    dragging.current = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }, [onTouchMove]);

  // Keyboard accessibility: open/close with Ctrl+Shift+A
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Modal close handler
  const closeModal = () => setModal(null)

  // Fetch wallet data when modal opens
  React.useEffect(() => {
    if (modal === 'wallet') {
      setWalletLoading(true)
      setWalletError(null)
      Promise.all([
        fetch('/api/qi-trading?action=account').then(r => r.json()),
        fetch('/api/qi-trading').then(r => r.json())
      ]).then(([balance, txs]) => {
        setWalletBalance(balance.balance || balance || null)
        setWalletTransactions(Array.isArray(txs) ? txs : (txs.trades || []))
        setWalletLoading(false)
      }).catch(e => {
        setWalletError('Could not load wallet data.')
        setWalletLoading(false)
      })
    }
  }, [modal])

  // Fetch automation jobs when modal opens
  React.useEffect(() => {
    if (modal === 'automation') {
      setAutomationLoading(true)
      setAutomationError(null)
      fetch('/api/colab-job')
        .then(r => r.json())
        .then(jobs => {
          setAutomationJobs(Array.isArray(jobs) ? jobs : [])
          setAutomationLoading(false)
        })
        .catch(e => {
          setAutomationError('Could not load automation jobs.')
          setAutomationLoading(false)
        })
    }
  }, [modal])

  // Trigger a new automation job (simulated)
  const triggerAutomationJob = async () => {
    setAutomationLoading(true)
    setAutomationError(null)
    try {
      await fetch('/api/colab-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'automation', name: 'Social Media Campaign' })
      })
      // Refresh jobs
      const jobs = await fetch('/api/colab-job').then(r => r.json())
      setAutomationJobs(Array.isArray(jobs) ? jobs : [])
    } catch (e) {
      setAutomationError('Failed to trigger automation job.')
    }
    setAutomationLoading(false)
  }

  // Handle image/animation generation
  const handleImageGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageLoading(true);
    setImageError(null);
    setImageUrl(null);
    try {
      // Try to call a real API endpoint if available
      const res = await fetch('/api/qmoi-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-image', prompt: imagePrompt })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.imageUrl) setImageUrl(data.imageUrl);
      else if (data.image) setImageUrl(data.image); // fallback
      else setImageError('No image returned.');
    } catch (err: any) {
      setImageError('Failed to generate image. (Simulated)');
      // Simulate a placeholder image for demo
      setImageUrl('/placeholder.jpg');
    }
    setImageLoading(false);
  };

  // Device health/optimization actions (simulated)
  const runHealthScan = async () => {
    setHealthScanRunning(true);
    setHealthScanResult(null);
    setTimeout(() => {
      setHealthScanResult("No critical errors or viruses detected. System is healthy.");
      setHealthScanRunning(false);
    }, 1800);
  };
  const runSelfHeal = async () => {
    setSelfHealRunning(true);
    setSelfHealResult(null);
    setTimeout(() => {
      setSelfHealResult("All detected issues have been auto-fixed. Device optimized.");
      setSelfHealRunning(false);
    }, 2000);
  };

  return (
    <>
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          zIndex: 9999,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: open ? "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)" : "#1a1a2e",
          boxShadow: open ? "0 4px 32px 4px #00f2fe99, 0 2px 12px rgba(0,0,0,0.2)" : "0 2px 16px 2px #00f2fe55, 0 2px 12px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "grab",
          userSelect: "none",
          transition: "box-shadow 0.2s, background 0.2s",
          outline: open ? "2px solid #00f2fe" : undefined,
        }}
        title="A-Q Assistant"
        aria-label="Drag to move A-Q Assistant"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setOpen(v => !v)
          }
        }}
      >
        <button
          aria-label="Open A-Q Chat"
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 32,
            cursor: "pointer",
            outline: "none",
            width: 48,
            height: 48,
            borderRadius: 24,
            boxShadow: open ? "0 0 16px 4px #00f2fe88" : "0 0 8px 2px #00f2fe44",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "box-shadow 0.2s",
            position: "relative",
          }}
          onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
          tabIndex={-1}
        >
          <motion.span
            role="img"
            aria-label="A-Q"
            style={{ filter: open ? "drop-shadow(0 0 6px #00f2fe)" : undefined }}
            animate={open ? { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          >🤖</motion.span>
          <span style={{
            position: "absolute",
            bottom: -24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            fontSize: 12,
            borderRadius: 6,
            padding: "2px 8px",
            opacity: open ? 0 : 0.9,
            pointerEvents: "none",
            transition: "opacity 0.2s",
            whiteSpace: "nowrap",
          }}>A-Q Assistant</span>
        </button>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 12,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          background: open ? "#00f2fe77" : "#00f2fe33",
          cursor: "grab",
          borderBottom: open ? "2px solid #4facfe" : undefined,
          boxShadow: open ? "0 2px 8px #00f2fe33" : undefined,
        }}
        aria-label="Drag handle for A-Q Assistant"
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "fixed",
              left: pos.x + 64,
              top: pos.y,
              zIndex: 10000,
              width: 340,
              maxWidth: "90vw",
              height: 480,
              maxHeight: "90vh",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              border: "2px solid #00f2fe33",
              resize: "both",
              minWidth: 260,
              minHeight: 320,
            }}
            aria-modal="true"
            role="dialog"
          >
            {/* Menu bar for advanced features */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)",
              padding: "6px 12px",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
            }}>
              <span>A-Q Assistant</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  title="AI Image/Animation"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('image')}
                >🖼️</button>
                <button
                  title="Wallet/Finance"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('wallet')}
                >💸</button>
                <button
                  title="Automation/Marketing"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('automation')}
                >🤖</button>
                <button
                  title="Device Health/Optimization"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('device-health')}
                >🩺</button>
                <button
                  title="Bluetooth Devices"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('bluetooth')}
                >📶</button>
                <button
                  title="Global Call"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('globalcall')}
                >📞</button>
                <button
                  title="Global Video Call"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('globalvideocall')}
                >🎥</button>
                <button
                  title="Global Mail"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('globalmail')}
                >✉️</button>
                <button
                  title="Global File Transfer"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('globalfiletransfer')}
                >📁</button>
                <button
                  title="Quick Settings"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('settings')}
                >⚙️</button>
                <button
                  title="WiFi/Zero-Rated Auto-Connect"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('wifi')}
                >📶</button>
                <button
                  title="Price/Product Verification"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('price-product')}
                >🛒</button>
                <button
                  title="Download Manager"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('download')}
                >⬇️</button>
                <button
                  title="Farm/Business Manager"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('farm-business')}
                >🌾</button>
                <button
                  title="Map/Location Awareness"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('map-location')}
                >🗺️</button>
                <button
                  title="Emergency Protocols"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('emergency')}
                >🚨</button>
                <button
                  title="File Categorization"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('file-categorizer')}
                >🗂️</button>
                <button
                  title="File Explorer"
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
                  onClick={() => setModal('file-explorer')}
                >📁</button>
                <button
                  aria-label="Close Chat"
                  style={{ background: "none", border: "none", fontSize: 20, color: "#fff", cursor: "pointer", marginLeft: 4 }}
                  onClick={() => setOpen(false)}
                  tabIndex={0}
                >✖️</button>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <Chatbot
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
              {/* Speak button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 0 0', justifyContent: 'flex-end' }}>
                <button
                  title="Speak last AI message"
                  style={{ background: '#00f2fe', color: '#222', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                  onClick={() => speak(lastAIMessage)}
                  disabled={!lastAIMessage || voices.length === 0}
                >🔊 Speak</button>
                <button
                  title="Change Voice"
                  style={{ background: 'none', border: 'none', color: '#00f2fe', fontWeight: 600, cursor: 'pointer', fontSize: 15, textDecoration: 'underline' }}
                  onClick={() => setShowVoicePicker(v => !v)}
                >{selectedVoiceURI ? 'Change Voice' : 'Pick Voice'}</button>
              </div>
              {/* Voice picker dialog */}
              {showVoicePicker && (
                <div style={{ position: 'absolute', right: 12, top: 60, background: '#fff', border: '1px solid #00f2fe', borderRadius: 8, boxShadow: '0 2px 12px #00f2fe33', padding: 16, zIndex: 10001 }}>
                  <b>Choose A-Q Voice</b>
                  <select
                    style={{ width: '100%', margin: '12px 0', padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
                    value={selectedVoiceURI || ''}
                    onChange={e => setSelectedVoiceURI(e.target.value)}
                  >
                    <option value="">-- Select Voice --</option>
                    {voices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                    ))}
                  </select>
                  <button
                    onClick={() => speak('This is a preview of the selected voice.')}
                    style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 15, marginRight: 8 }}
                    disabled={!selectedVoiceURI}
                  >Preview</button>
                  <button onClick={() => setShowVoicePicker(false)} style={{ background: '#00f2fe', color: '#222', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>Close</button>
                </div>
              )}
            </div>
            {/* Advanced Feature Modals */}
            <AnimatePresence>
              {modal === 'image' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 260,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>AI Image/Animation Enhancements</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <form onSubmit={handleImageGenerate} style={{ width: '100%' }}>
                      <label htmlFor="image-prompt"><b>Prompt:</b></label>
                      <input id="image-prompt" name="prompt" type="text" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="Describe your image or animation..." style={{ width: '100%', margin: '8px 0', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                      <button type="submit" style={{ background: '#00f2fe', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }} disabled={imageLoading || !imagePrompt}>Generate</button>
                    </form>
                    {imageLoading && <div style={{ marginTop: 16 }}>Generating image...</div>}
                    {imageError && <div style={{ marginTop: 16, color: 'red' }}>{imageError}</div>}
                    {imageUrl && (
                      <div style={{ marginTop: 16 }}>
                        <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8, border: '1px solid #eee' }} />
                        <div style={{ fontSize: 12, color: '#888' }}>Preview (AI generated or placeholder)</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              {modal === 'wallet' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 260,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Wallet & Finance Integration</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    {walletLoading ? (
                      <div>Loading wallet data...</div>
                    ) : walletError ? (
                      <div style={{ color: 'red' }}>{walletError}</div>
                    ) : (
                      <>
                        <div style={{ marginBottom: 12 }}>
                          <b>Balance:</b> {walletBalance ? (Array.isArray(walletBalance) ? walletBalance.map((b: any) => `${b.coin}: $${b.available || b.balance || 0}`).join(', ') : `$${walletBalance.available || walletBalance.balance || 0}`) : '$0.00'}
                        </div>
                        <div><b>Recent Transactions:</b></div>
                        <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none', fontSize: 15, maxHeight: 120, overflowY: 'auto' }}>
                          {walletTransactions.length === 0 && <li>No transactions found.</li>}
                          {walletTransactions.map((tx, i) => (
                            <li key={typeof tx.id === 'string' || typeof tx.id === 'number' ? tx.id : i}>
                              {tx.type || tx.side || 'TX'} {tx.amount ? `: ${tx.amount}` : ''} @ {tx.price ? `$${tx.price}` : ''} <span style={{ color: tx.type === 'BUY' || tx.side === 'BUY' ? '#0a0' : '#a00' }}>({tx.result || tx.status || 'Simulated'})</span>
                              <span style={{ color: '#888', marginLeft: 8 }}>{tx.rationale ? `- ${tx.rationale}` : ''}</span>
                              <span style={{ color: '#888', marginLeft: 8, fontSize: 12 }}>{tx.timestamp ? new Date(typeof tx.timestamp === 'string' || typeof tx.timestamp === 'number' ? tx.timestamp : '').toLocaleString() : ''}</span>
                            </li>
                          ))}
                        </ul>
                        <div style={{ marginTop: 16, fontStyle: 'italic', color: '#888' }}>Multi-wallet/service support coming soon.</div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
              {modal === 'automation' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 260,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Automation & Marketing Tools</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <button onClick={triggerAutomationJob} style={{ background: '#00f2fe', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', marginBottom: 12 }} disabled={automationLoading}>Trigger Social Media Campaign</button>
                    {automationLoading ? (
                      <div>Loading automation jobs...</div>
                    ) : automationError ? (
                      <div style={{ color: 'red' }}>{automationError}</div>
                    ) : (
                      <>
                        <div><b>Recent Automation Jobs:</b></div>
                        <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none', fontSize: 15, maxHeight: 120, overflowY: 'auto' }}>
                          {automationJobs.length === 0 && <li>No jobs found.</li>}
                          {automationJobs.map((job, i) => (
                            <li key={typeof job.id === 'string' || typeof job.id === 'number' ? job.id : i}>
                              <b>{job.name || job.type}</b> — <span>{job.status || 'pending'}</span> <span style={{ color: '#888', marginLeft: 8 }}>{job.started ? new Date(job.started).toLocaleString() : ''}</span>
                            </li>
                          ))}
                        </ul>
                        <div style={{ marginTop: 16, fontStyle: 'italic', color: '#888' }}>Full automation and integration coming soon.</div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
              {modal === 'device-health' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 260,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Device Health & Optimization</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <div style={{ marginBottom: 10 }}>
                      <b>Device Status:</b>
                      <ul style={{ fontSize: 15, margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li>CPU Cores: {deviceHealth.cpu ?? 'Unknown'}</li>
                        <li>Memory: {deviceHealth.memory ? deviceHealth.memory + ' GB' : 'Unknown'}</li>
                        <li>Battery: {deviceHealth.battery !== null ? deviceHealth.battery + '%' : 'Unknown'}</li>
                        <li>Online: {deviceHealth.online ? 'Yes' : 'No'}</li>
                      </ul>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <b>AI System Health:</b>
                      <ul style={{ fontSize: 15, margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li>Status: {aiHealth.status}</li>
                        <li>Last Check: {new Date(aiHealth.lastCheck).toLocaleString()}</li>
                        {aiHealth.error && <li style={{ color: 'red' }}>Error: {aiHealth.error}</li>}
                      </ul>
                    </div>
                    <div style={{ margin: '16px 0 8px 0' }}>
                      <button
                        style={{ background: '#00f2fe', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}
                        onClick={runHealthScan}
                        disabled={healthScanRunning}
                      >{healthScanRunning ? 'Scanning...' : 'Run Error/Virus Scan'}</button>
                      <button
                        style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}
                        onClick={runSelfHeal}
                        disabled={selfHealRunning}
                      >{selfHealRunning ? 'Self-Healing...' : 'Run Self-Healing'}</button>
                    </div>
                    {healthScanResult && <div style={{ marginTop: 8, color: '#0a0' }}>{healthScanResult}</div>}
                    {selfHealResult && <div style={{ marginTop: 8, color: '#22c55e' }}>{selfHealResult}</div>}
                    <div style={{ marginTop: 16, fontStyle: 'italic', color: '#888' }}>Device optimization and self-healing routines are simulated. For advanced protection, see system integration docs.</div>
                  </div>
                </motion.div>
              )}
              {modal === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Quick Settings</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <div><label><input type="checkbox" checked readOnly /> Enable A-Q Assistant</label></div>
                    <div><label><input type="checkbox" checked={alwaysOn} onChange={e => setAlwaysOn(e.target.checked)} /> Always Run in Background</label></div>
                    <div><label><input type="checkbox" checked={autoStart} onChange={e => setAutoStart(e.target.checked)} /> Auto-Start on Device Boot</label></div>
                    <div><label><input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} /> Dark Mode</label></div>
                    <div><label><input type="checkbox" /> Notifications (Demo)</label></div>
                    <div style={{ margin: '12px 0 0 0' }}>
                      <label><b>Voice for A-Q:</b></label>
                      <select
                        style={{ width: '100%', margin: '8px 0', padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
                        value={selectedVoiceURI || ''}
                        onChange={e => setSelectedVoiceURI(e.target.value)}
                      >
                        <option value="">-- Select Voice --</option>
                        {voices.map(v => (
                          <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ marginTop: 16, fontStyle: 'italic', color: '#888' }}>A-Q will auto-open if enabled. For true OS-level auto-start, see system integration docs.</div>
                  </div>
                </motion.div>
              )}
              {modal === 'bluetooth' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Bluetooth Device Manager</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading Bluetooth Manager...</div>}>
                      {React.createElement(require('./BluetoothManager').BluetoothManager)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
              {modal === 'globalcall' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Global Call Settings</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <div style={{ marginBottom: 10 }}>
                      <b>Call Status:</b>
                      <div style={{ fontSize: 15, margin: '8px 0', padding: 8, borderRadius: 6, background: '#f0f0f0' }}>
                        {aiHealth.status === 'healthy' ? 'Ready for global calls' : 'Not available'}
                      </div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <b>Last Call Result:</b>
                      <div style={{ fontSize: 15, margin: '8px 0', padding: 8, borderRadius: 6, background: '#f0f0f0' }}>
                        {selfHealResult || 'No calls made yet.'}
                      </div>
                    </div>
                    <div style={{ margin: '16px 0 8px 0' }}>
                      <button
                        style={{ background: '#00f2fe', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}
                        onClick={() => {/* Trigger global call API */}}
                        disabled={false}
                      >Make Global Call</button>
                    </div>
                    <div style={{ marginTop: 16, fontStyle: 'italic', color: '#888' }}>Global call feature is in beta. For issues, contact support.</div>
                  </div>
                </motion.div>
              )}
              {modal === 'globalvideocall' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Global Video Call</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading Global Video Call...</div>}>
                      {React.createElement(require('./GlobalVideoCall').GlobalVideoCall)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
              {modal === 'globalmail' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Global Mail</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading Global Mail...</div>}>
                      {React.createElement(require('./GlobalMail').GlobalMail)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
              {modal === 'globalfiletransfer' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Global File Transfer</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading File Transfer...</div>}>
                      {React.createElement(require('./GlobalFileTransfer').GlobalFileTransfer)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
              {modal === 'wifi' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>WiFi & Zero-Rated Auto-Connect</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading WiFi Panel...</div>}>
                      {React.createElement(require('./WifiAutoConnectPanel').WifiAutoConnectPanel)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
              {modal === 'price-product' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Price & Product Verification</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading Price/Product Verifier...</div>}>
                      {React.createElement(require('./PriceProductVerifier').PriceProductVerifier)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
              {modal === 'download' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Download Manager</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading Download Manager...</div>}>
                      {React.createElement(require('./DownloadManager').DownloadManager)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
              {modal === 'farm-business' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Farm, Livestock & Business Manager</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading Farm/Business Manager...</div>}>
                      {React.createElement(require('./FarmBusinessManager').FarmBusinessManager)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
              {modal === 'map-location' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20000,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 340,
                    minHeight: 220,
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <b>Map & Location Awareness</b>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="Close">✖️</button>
                  </div>
                  <div style={{ color: '#333', width: '100%' }}>
                    <React.Suspense fallback={<div>Loading Map/Location Panel...</div>}>
                      {React.createElement(require('./MapLocationPanel').MapLocationPanel)}
                    </React.Suspense>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Wrap FloatingAQ in AIProvider for persistent context
export default function FloatingAQWithProvider(props: any) {
  return (
    <AIProvider>
      <FloatingAQ {...props} />
    </AIProvider>
  );
}