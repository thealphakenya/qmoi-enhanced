

'use client';

import { useState, useEffect } from 'react';

interface Device {
  id: string;
  name: string;
  type: string;
  platform: string;
  status: 'online' | 'offline' | 'syncing';
  lastSync: string;
  location?: string;
  battery?: number;
}

// AUTODEV: Performance optimized
export default function DeviceManagementDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      
      const mockDevices: Device[] = [
        {
          id: 'dev_001',
          name: 'iPhone 15 Pro',
          type: 'mobile',
          platform: 'iOS',
          status: 'online',
          lastSync: new Date().toISOString(),
          location: 'Nairobi, Kenya',
          battery: 85
        },
        {
          id: 'dev_002',
          name: 'MacBook Pro M3',
          type: 'laptop',
          platform: 'macOS',
          status: 'online',
          lastSync: new Date().toISOString(),
          battery: 92
        },
        {
          id: 'dev_003',
          name: 'Smart TV LG',
          type: 'smart-tv',
          platform: 'webOS',
          status: 'online',
          lastSync: new Date().toISOString()
        },
        {
          id: 'dev_004',
          name: 'Apple Watch Ultra',
          type: 'wearable',
          platform: 'watchOS',
          status: 'syncing',
          lastSync: new Date().toISOString(),
          battery: 78
        },
        {
          id: 'dev_005',
          name: 'HomePod Mini',
          type: 'smart-speaker',
          platform: 'iOS',
          status: 'online',
          lastSync: new Date().toISOString()
        },
        {
          id: 'dev_006',
          name: 'iPad Pro',
          type: 'tablet',
          platform: 'iPadOS',
          status: 'offline',
          lastSync: new Date(Date.now() - 3600000).toISOString(),
          battery: 45
        }
      ];

      setDevices(mockDevices);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'syncing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredDevices = devices.filter(device =>
    filter === 'all' || device.type === filter
  );

  const deviceTypes = ['all', ...Array.from(new Set(devices.map(d => d.type)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading device management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Device Management Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage all connected devices across your QMOI ecosystem
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {deviceTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type === 'all' ? 'All Devices' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{devices.length}</div>
            <div className="text-gray-600">Total Devices</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {devices.filter(d => d.status === 'online').length}
            </div>
            <div className="text-gray-600">Online</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {devices.filter(d => d.status === 'syncing').length}
            </div>
            <div className="text-gray-600">Syncing</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {devices.filter(d => d.status === 'offline').length}
            </div>
            <div className="text-gray-600">Offline</div>
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map(device => (
            <div key={device.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Type:</strong> {device.type.replace('-', ' ')}</div>
                <div><strong>Platform:</strong> {device.platform}</div>
                <div><strong>Last Sync:</strong> {new Date(device.lastSync).toLocaleString()}</div>
                {device.location && <div><strong>Location:</strong> {device.location}</div>}
                {device.battery !== undefined && (
                  <div className="flex items-center">
                    <strong className="mr-2">Battery:</strong>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${device.battery}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{device.battery}%</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                  Manage
                </button>
                <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                  Sync
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No devices found matching the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}