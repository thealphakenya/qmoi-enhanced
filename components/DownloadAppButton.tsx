import React, { useState } from "react"
import { Button } from "@/components/ui/button"

// Download URLs per device type (customize as needed)
const DOWNLOAD_URLS: Record<string, string> = {
  android: "https://example.com/app-latest.apk",
  ios: "https://example.com/app-latest.ipa",
  windows: "https://example.com/app-latest.exe",
  mac: "https://example.com/app-latest.dmg",
  linux: "https://example.com/app-latest.AppImage",
  unknown: "https://example.com/app-latest.zip"
}

function getDeviceType() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  if (/android/i.test(ua)) return 'android';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Win/.test(ua)) return 'windows';
  if (/Mac/.test(ua)) return 'mac';
  if (/Linux/.test(ua)) return 'linux';
  return 'unknown';
}

export function DownloadAppButton() {
  const [show, setShow] = useState(() => !localStorage.getItem('appInstalled'));
  const [downloading, setDownloading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const device = getDeviceType();
  const url = DOWNLOAD_URLS[device];

  const handleDownload = () => {
    setDownloading(true);
    window.open(url, '_blank');
    setTimeout(() => {
      setDownloading(false);
      setShow(false);
      localStorage.setItem('appInstalled', '1');
    }, 2000);
  };

  if (!show) return null;
  return (
    <>
      <Button size="sm" className="ml-2 bg-blue-700 text-white" onClick={() => setConfirm(true)} disabled={downloading}>
        {downloading ? "Downloading..." : "Download App"}
      </Button>
      {confirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg text-green-200">
            <div className="mb-4">Download and install the app for your device ({device})?</div>
            <div className="flex gap-4">
              <Button size="sm" className="bg-blue-700 text-white" onClick={() => { setConfirm(false); handleDownload(); }}>Yes, Download</Button>
              <Button size="sm" variant="outline" onClick={() => setConfirm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
