'use client';

import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function RescueMap({ lat, lng }: { lat: number; lng: number }) {
    useEffect(() => {
        // Fix icon issues
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
        });
    }, []);

    // ✅ Dynamically import these only in the browser
    const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{
                height: '180px',
                width: '100%',
                borderRadius: '12px',
                marginTop: '0.5rem',
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            <Marker position={[lat, lng]}>
                <Popup>Reported Location</Popup>
            </Marker>
        </MapContainer>
    );
}
