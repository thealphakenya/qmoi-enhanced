import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function DeviceMap({ devices }: { devices: any[] }) {
  // Default to center of the world
  const center = devices.length
    ? [devices[0].location.lat, devices[0].location.lng]
    : [0, 0];
  return (
    <div className="w-full h-80 rounded border overflow-hidden">
      <MapContainer center={center as [number, number]} zoom={2} style={{ height: "100%", width: "100%" }}>
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
      </MapContainer>
    </div>
  );
}
