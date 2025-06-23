import * as React from 'react';
import { useEffect, useState } from 'react';
import { DeviceTrackingService, Device } from '../../services/DeviceTrackingService';

// Simulate master check (replace with real auth logic)
const isMaster = true;

const mockWhatsAppService = {
  client: {},
  config: {},
  isConnected: true,
  qrCodeStatus: { isScanned: true, timestamp: new Date(), deviceInfo: {}, notifications: { master: true, leah: true, status: 'sent' } },
  messageTemplates: [],
  autoResponders: new Map(),
  pendingApprovals: new Map(),
  sendMessageToMaster: async (msg: string) => { alert(msg); },
  sendMessage: async () => {},
  sendMessageToLeah: async () => {},
  broadcastMessage: async () => {},
  getConnectionStatus: () => true,
  getQRCodeStatus: () => ({ isScanned: true, timestamp: new Date(), deviceInfo: {}, notifications: { master: true, leah: true, status: 'sent' } }),
  updateConfig: () => {},
  requestApproval: async () => true,
};

const deviceService = new DeviceTrackingService(mockWhatsAppService as any);

export const DevicesHub: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    setDevices(deviceService.listDevices());
  }, []);

  const handleAction = (action: 'find' | 'lock' | 'wipe', deviceId: string) => {
    if (action === 'find') deviceService.findDevice(deviceId);
    if (action === 'lock') deviceService.lockDevice(deviceId);
    if (action === 'wipe') deviceService.wipeDevice(deviceId);
    setSelectedDevice(devices.find((d: Device) => d.id === deviceId) || null);
  };

  return (
    <div className="devices-hub" style={{ padding: 24, background: '#f9f9f9', borderRadius: 12, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Devices Hub</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {devices.map((device: Device) => (
          <li key={device.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', marginBottom: 8, padding: 12, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <span>
              <strong>{device.name}</strong> <span style={{ color: device.status === 'online' ? 'green' : device.status === 'lost' ? 'red' : '#888' }}>({device.status})</span>
            </span>
            {isMaster && (
              <span>
                <button style={{ marginRight: 8 }} onClick={() => handleAction('find', device.id)}>Find</button>
                <button style={{ marginRight: 8 }} onClick={() => handleAction('lock', device.id)}>Lock</button>
                <button style={{ color: 'red' }} onClick={() => handleAction('wipe', device.id)}>Wipe</button>
              </span>
            )}
          </li>
        ))}
      </ul>
      {selectedDevice && (
        <div className="device-details" style={{ marginTop: 24, background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3>Device Details</h3>
          <p><strong>Name:</strong> {selectedDevice.name}</p>
          <p><strong>Status:</strong> {selectedDevice.status}</p>
          <p><strong>Last Seen:</strong> {selectedDevice.lastSeen.toString()}</p>
          {selectedDevice.location && <p><strong>Location:</strong> {selectedDevice.location}</p>}
        </div>
      )}
    </div>
  );
};

export default DevicesHub; 