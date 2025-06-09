import React, { useEffect, useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DownloadAppButton } from "@/components/DownloadAppButton";
import { RELEASES } from "@/components/release-notes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { WifiPanel } from "@/components/WifiPanel";

const SSH_BACKEND = "http://localhost:4000"; // Change to your backend URL if deployed

export function FileExplorer() {
  const [files, setFiles] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string>("/")
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editValue, setEditValue] = useState("")
  const [showCreds, setShowCreds] = useState(false)
  const [creds, setCreds] = useState({
    host: '',
    port: 22,
    username: '',
    password: ''
  })
  const [showDownload, setShowDownload] = useState(() => {
    // Hide download option if app is already installed (detected via localStorage flag)
    return !localStorage.getItem('appInstalled');
  });
  const [downloading, setDownloading] = useState(false);
  const [confirmDownload, setConfirmDownload] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [latestVersion, setLatestVersion] = useState(RELEASES[0].version);
  const [latestNotes, setLatestNotes] = useState(RELEASES[0].notes);
  const [latestDate, setLatestDate] = useState(RELEASES[0].date);
  const [latestDownloads, setLatestDownloads] = useState(RELEASES[0].downloads);
  const forceUpdate = true;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showWifi, setShowWifi] = useState(false);

  // Save credentials to localStorage (for demo; in production, use secure backend/session)
  useEffect(() => {
    const saved = localStorage.getItem('sshCreds')
    if (saved) setCreds(JSON.parse(saved))
  }, [])

  useEffect(() => {
    fetch(`${SSH_BACKEND}/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: currentPath, ...creds })
    })
      .then(res => res.json())
      .then(data => {
        if (data.files) setFiles(data.files.map((f: any) => f.longname.startsWith('d') ? f.filename + '/' : f.filename))
        else setFiles([])
      })
  }, [currentPath, creds])

  const openFile = (file: string) => {
    fetch(`${SSH_BACKEND}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: currentPath + file, ...creds })
    })
      .then(res => res.json())
      .then(data => {
        setFileContent(data.content)
        setSelectedFile(file)
        setEditValue(data.content)
        setEditMode(false)
      })
  }

  const saveFile = () => {
    fetch(`${SSH_BACKEND}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: currentPath + selectedFile, content: editValue, ...creds })
    })
      .then(() => {
        setFileContent(editValue)
        setEditMode(false)
      })
  }

  const saveCreds = () => {
    localStorage.setItem('sshCreds', JSON.stringify(creds))
    setShowCreds(false)
    window.location.reload()
  }

  // Helper to detect device type
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (/Win/.test(ua)) return 'windows';
    if (/Mac/.test(ua)) return 'mac';
    if (/Linux/.test(ua)) return 'linux';
    return 'unknown';
  }

  // Download handler
  const handleDownload = async () => {
    setDownloading(true);
    const device = getDeviceType();
    let url = '';
    if (device === 'android') url = 'https://example.com/app-latest.apk';
    else if (device === 'ios') url = 'https://example.com/app-latest.ipa';
    else if (device === 'windows') url = 'https://example.com/app-latest.exe';
    else if (device === 'mac') url = 'https://example.com/app-latest.dmg';
    else if (device === 'linux') url = 'https://example.com/app-latest.AppImage';
    else url = 'https://example.com/app-latest.zip';
    // Simulate download
    window.open(url, '_blank');
    setTimeout(() => {
      setDownloading(false);
      setShowDownload(false);
      localStorage.setItem('appInstalled', '1');
    }, 2000);
  };

  // Download file from SSH server
  const handleDownloadFile = async (file: string) => {
    const res = await fetch(`${SSH_BACKEND}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: currentPath + file, ...creds })
    });
    const data = await res.json();
    const blob = new Blob([data.content], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Upload file to SSH server
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    await fetch(`${SSH_BACKEND}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: currentPath + file.name, content: Array.from(new Uint8Array(arrayBuffer)), ...creds })
    });
    // Refresh file list
    fetch(`${SSH_BACKEND}/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: currentPath, ...creds })
    })
      .then(res => res.json())
      .then(data => {
        if (data.files) setFiles(data.files.map((f: any) => f.longname.startsWith('d') ? f.filename + '/' : f.filename))
        else setFiles([])
      })
  };

  useEffect(() => {
    fetch('/api/version')
      .then(res => res.json())
      .then(data => {
        if (data.version && data.version !== RELEASES[0].version) {
          setLatestVersion(data.version);
          setLatestNotes(data.notes);
          setLatestDate(data.date);
          setLatestDownloads(data.downloads);
          setShowUpdateModal(true);
        }
      });
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>File Explorer</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowWifi(true)}>
            Wi-Fi
          </Button>
          <Button size="sm" className="ml-2" onClick={() => setShowCreds(v => !v)}>
            {showCreds ? "Hide SSH Credentials" : "Set SSH Credentials"}
          </Button>
          <DownloadAppButton />
          <Button size="sm" className="ml-2" onClick={() => fileInputRef.current?.click()}>
            Upload File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleUploadFile}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {/* Show latest release notes and update prompt */}
        <div className="mb-4">
          <strong>Latest Release:</strong> v{RELEASES[0].version} ({RELEASES[0].date})
          <ul className="list-disc ml-6 text-green-200">
            {RELEASES[0].notes.map((note, i) => <li key={i}>{note}</li>)}
          </ul>
          <a
            href={RELEASES[0].downloads[getDeviceType()]}
            className="text-blue-400 underline mt-2 inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download latest version
          </a>
        </div>
        {showCreds && (
          <div className="mb-4 p-2 border rounded bg-gray-900">
            <div className="mb-2">
              <label>Host: <input className="ml-2 bg-gray-800 text-green-200 border rounded p-1" value={creds.host} onChange={e => setCreds(c => ({ ...c, host: e.target.value }))} /></label>
            </div>
            <div className="mb-2">
              <label>Port: <input className="ml-2 bg-gray-800 text-green-200 border rounded p-1" type="number" value={creds.port} onChange={e => setCreds(c => ({ ...c, port: Number(e.target.value) }))} /></label>
            </div>
            <div className="mb-2">
              <label>Username: <input className="ml-2 bg-gray-800 text-green-200 border rounded p-1" value={creds.username} onChange={e => setCreds(c => ({ ...c, username: e.target.value }))} /></label>
            </div>
            <div className="mb-2">
              <label>Password: <input className="ml-2 bg-gray-800 text-green-200 border rounded p-1" type="password" value={creds.password} onChange={e => setCreds(c => ({ ...c, password: e.target.value }))} /></label>
            </div>
            <Button size="sm" onClick={saveCreds}>Save & Reload</Button>
          </div>
        )}
        <div className="mb-2">
          <span className="font-bold">Current Path:</span> {currentPath}
        </div>
        <ul className="mb-2">
          {files.map(f => (
            <li key={f} className="flex items-center gap-2">
              <Button variant="link" onClick={() => f.endsWith("/") ? setCurrentPath(currentPath + f) : openFile(f)}>
                {f}
              </Button>
              {!f.endsWith("/") && (
                <Button size="sm" variant="outline" onClick={() => handleDownloadFile(f)}>
                  Download
                </Button>
              )}
            </li>
          ))}
        </ul>
        {fileContent !== null && (
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">{selectedFile}</span>
              <Button size="sm" onClick={() => setEditMode(e => !e)}>{editMode ? "Cancel" : "Edit"}</Button>
            </div>
            {editMode ? (
              <>
                <textarea
                  className="w-full h-32 bg-gray-900 text-green-200 border border-green-700 rounded p-2 mt-2"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                />
                <Button size="sm" className="mt-2" onClick={saveFile}>Save</Button>
              </>
            ) : (
              <pre className="bg-gray-900 text-green-200 p-2 rounded mt-2 overflow-x-auto max-h-48">{fileContent}</pre>
            )}
          </div>
        )}
      </CardContent>
      {showWifi && (
        <Dialog open={showWifi} onOpenChange={setShowWifi}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Wi-Fi Networks</DialogTitle>
            </DialogHeader>
            <WifiPanel onClose={() => setShowWifi(false)} />
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={showUpdateModal} onOpenChange={v => { if (!forceUpdate) setShowUpdateModal(v); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🚀 New Version Available: v{latestVersion}</DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-green-300">A new version of Alpha-Q AI is available!</div>
          <div className="mb-2">Released: <span className="font-mono">{latestDate}</span></div>
          <ul className="list-disc ml-6 text-green-200 mb-2">
            {latestNotes.map((note, i) => <li key={i}>{note}</li>)}
          </ul>
          <DialogFooter>
            <a
              href={latestDownloads[getDeviceType()]}
              className="bg-blue-700 text-white px-4 py-2 rounded font-bold hover:bg-blue-800 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download & Install v{latestVersion}
            </a>
            {!forceUpdate && (
              <Button variant="outline" onClick={() => setShowUpdateModal(false)}>Remind Me Later</Button>
            )}
          </DialogFooter>
          {forceUpdate && (
            <div className="mt-4 text-red-400 font-bold text-center">
              This update is required. Please update to continue using the app.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
