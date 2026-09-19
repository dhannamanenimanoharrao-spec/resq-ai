import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Ambulance {
  id: string;
  vehicle_number?: string;
  base_location?: string;
  latitude: number;
  longitude: number;
  current_status: string;
  vehicle_category?: string;
  district?: string;
}

interface Facility {
  id: string;
  facility_name: string;
  facility_type: string;
  latitude: number;
  longitude: number;
  district?: string;
}

interface Emergency {
  id: string;
  latitude: number;
  longitude: number;
  emergency_type: string;
  severity: string;
}

interface LiveMapProps {
  ambulances: Ambulance[];
  facilities: Facility[];
  activeEmergency?: Emergency | null;
}

function FitBounds({ ambulances }: { ambulances: Ambulance[] }) {
  const map = useMap();
  useEffect(() => {
    if (ambulances.length > 0) {
      map.setView([17.385, 78.4867], 7);
    }
  }, [ambulances, map]);
  return null;
}

export default function LiveMap({ ambulances, facilities, activeEmergency }: LiveMapProps) {
  return (
    <MapContainer
      center={[17.385, 78.4867]}
      zoom={7}
      style={{ height: '100%', width: '100%', background: '#0a0f1a' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <FitBounds ambulances={ambulances} />

      {/* FACILITIES — small teal dots */}
      {facilities.map((f) => (
        <CircleMarker
          key={f.id}
          center={[f.latitude, f.longitude]}
          radius={3}
          pathOptions={{
            color: '#0d9488',
            fillColor: '#0d9488',
            fillOpacity: 0.6,
            weight: 0,
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
              <strong>{f.facility_name}</strong><br />
              {f.facility_type}<br />
              {f.district}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* AMBULANCES — teal markers */}
      {ambulances.map((a) => (
        <CircleMarker
          key={a.id}
          center={[a.latitude, a.longitude]}
          radius={5}
          pathOptions={{
            color: a.current_status === 'available' ? '#2dd4bf' : '#f59e0b',
            fillColor: a.current_status === 'available' ? '#2dd4bf' : '#f59e0b',
            fillOpacity: 0.9,
            weight: 1,
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
              <strong>{a.vehicle_number ?? a.id}</strong><br />
              {a.vehicle_category}<br />
              {a.base_location}<br />
              {a.district}<br />
              <span style={{ color: a.current_status === 'available' ? '#0d9488' : '#f59e0b' }}>
                {a.current_status.toUpperCase()}
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* ACTIVE EMERGENCY — red pulsing marker */}
      {activeEmergency && (
        <CircleMarker
          center={[activeEmergency.latitude, activeEmergency.longitude]}
          radius={10}
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.8,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
              <strong>EMERGENCY</strong><br />
              {activeEmergency.emergency_type.toUpperCase()}<br />
              Severity: {activeEmergency.severity.toUpperCase()}
            </div>
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}