import React, { useState } from 'react';

// Define a minimal BluetoothDevice type for type safety
interface BluetoothDevice {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export const BluetoothManager: React.FC = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [directions, setDirections] = useState<string | null>(null);

  async function scanForDevices() {
    setError(null);
    setConnecting(true);
    try {
      // @ts-ignore
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });
      setDevices((prev) => [...prev, device]);
    } catch (e: any) {
      setError(e.message || 'Bluetooth scan failed.');
    }
    setConnecting(false);
  }

  async function connectToDevice(device: BluetoothDevice) {
    setError(null);
    setConnecting(true);
    try {
      // Simulate connection (replace with real connection logic)
      setConnectedDevice(device);
      // Optionally get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      }
      // Simulate AI giving directions
      setDirections('Head north for 2km, then turn right.');
    } catch (e: any) {
      setError(e.message || 'Connection failed.');
    }
    setConnecting(false);
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>Bluetooth Device Manager</h3>
      <button onClick={scanForDevices} disabled={connecting} style={{ marginBottom: 12 }}>
        {connecting ? 'Scanning...' : 'Scan for Devices'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {devices.map((d, i) => (
          <li key={d.id || i}>
            {d.name || 'Unnamed Device'} (id: {d.id || 'N/A'})
            <button onClick={() => connectToDevice(d)} disabled={connecting || connectedDevice === d} style={{ marginLeft: 8 }}>
              {connectedDevice === d ? 'Connected' : 'Connect'}
            </button>
          </li>
        ))}
      </ul>
      {connectedDevice && location && (
        <div style={{ marginTop: 12 }}>
          <b>Connected to:</b> {connectedDevice.name || 'Unnamed Device'}<br />
          <b>Your Location:</b> {location.lat}, {location.lng}<br />
          <b>Directions:</b> {directions}
        </div>
      )}
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        Note: Bluetooth support requires a compatible browser and user permission.
      </div>
    </div>
  );
};
