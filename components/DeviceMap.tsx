import React from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Device {
  location: {
    lat: number;
    lng: number;
  };
  user: string;
  status: string;
  lastSeen: string;
  name: string;
}

// NOTE: This component requires 'react-leaflet' to be installed.

export function DeviceMap({ devices }: { devices: Device[] }) {
  return (
    <div className="w-full h-80 rounded border overflow-hidden">
      {/* <MapContainer center={center as [number, number]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {devices.map((device, i) => (
          <Marker key={i} position={[device.location.lat, device.location.lng]}>
            <Popup>
              <div>
                <b>User:</b> {device.user}<br />
                <b>Status:</b> {device.status}<br />
                <b>Last Seen:</b> {device.lastSeen}<br />
                <b>Device:</b> {device.name}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer> */}
    </div>
  );
}
