import React, { useState } from 'react';

export const MapLocationPanel: React.FC = () => {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [status, setStatus] = useState('');

  const handleLocate = () => {
    setStatus('Locating...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setStatus('Location found.');
        },
        err => {
          setStatus('Location error: ' + err.message);
        }
      );
    } else {
      setStatus('Geolocation not supported.');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Map & Location Awareness</h3>
      <button onClick={handleLocate}>Locate Me</button>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>{status}</div>
      {location && (
        <div style={{ marginTop: 12 }}>
          <b>Latitude:</b> {location.lat}<br />
          <b>Longitude:</b> {location.lon}
          <div style={{ marginTop: 8 }}>
            <a href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lon}`} target="_blank" rel="noopener noreferrer">View on Map</a>
          </div>
        </div>
      )}
    </div>
  );
};
