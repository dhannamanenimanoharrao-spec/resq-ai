import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, MapPin, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import StatusLabel from '@/components/shared/StatusLabel';
import RouteMap from '@/components/shared/RouteMap';
import type { Resource } from '@/types/resource';
import type { Hospital } from '@/types/hospital';

interface CommandCenterProps {
  onNavigate: (route: 'landing' | 'command-center' | 'incident') => void;
}

interface BackendAmbulance {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  status: string;
  type?: string;
}

interface BackendHospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  available_beds: number;
  emergency_capable: boolean;
}

interface BackendEmergency {
  id: string;
  latitude: number;
  longitude: number;
  emergency_type: string;
  severity: string;
  status: string;
  description?: string;
  assigned_ambulance_id?: string | null;
  created_at?: string;
}

const API_BASE = 'http://127.0.0.1:8000';

function toMapPosition(
  latitude: number,
  longitude: number
): { x: number; y: number } {
  const minLat = 17.38;
  const maxLat = 17.48;
  const minLon = 78.34;
  const maxLon = 78.48;

  const x = ((longitude - minLon) / (maxLon - minLon)) * 100;
  const y = 100 - ((latitude - minLat) / (maxLat - minLat)) * 100;

  return {
    x: Math.max(3, Math.min(97, x)),
    y: Math.max(3, Math.min(97, y)),
  };
}

function ambulanceStatus(status: string): Resource['status'] {
  const value = status.toLowerCase();

  if (value === 'available') return 'available';
  if (value === 'busy' || value === 'active') return 'active';

  return 'unavailable';
}

function hospitalCapacity(
  beds: number
): Hospital['icuCapacity'] {
  if (beds <= 0) return 'full';
  if (beds <= 10) return 'limited';
  return 'available';
}

export default function CommandCenter({
  onNavigate,
}: CommandCenterProps) {
  const [ambulances, setAmbulances] = useState<BackendAmbulance[]>([]);
  const [hospitals, setHospitals] = useState<BackendHospital[]>([]);
  const [emergencies, setEmergencies] = useState<BackendEmergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadLiveData() {
    try {
      setLoading(true);
      setError('');

      const [ambulanceResponse, hospitalResponse, emergencyResponse] =
        await Promise.all([
          fetch(`${API_BASE}/ambulances`),
          fetch(`${API_BASE}/hospitals`),
          fetch(`${API_BASE}/emergencies`),
        ]);

      if (!ambulanceResponse.ok) {
        throw new Error('Failed to load ambulances');
      }

      if (!hospitalResponse.ok) {
        throw new Error('Failed to load hospitals');
      }

      if (!emergencyResponse.ok) {
        throw new Error('Failed to load emergencies');
      }

      const ambulanceData = await ambulanceResponse.json();
      const hospitalData = await hospitalResponse.json();
      const emergencyData = await emergencyResponse.json();

      setAmbulances(ambulanceData);
      setHospitals(hospitalData);
      setEmergencies(emergencyData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to connect to backend'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLiveData();

    const interval = setInterval(loadLiveData, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeEmergency =
    emergencies.find(
      (emergency) =>
        emergency.status !== 'completed' &&
        emergency.status !== 'cancelled'
    ) ?? emergencies[0];

  const resourceData: Resource[] = useMemo(
    () =>
      ambulances.map((ambulance) => ({
        id: ambulance.id,
        type: 'ambulance',
        label: ambulance.name ?? ambulance.id,
        status: ambulanceStatus(ambulance.status),
        capability:
          ambulance.type === 'advanced'
            ? 'advanced'
            : ambulance.type === 'basic'
              ? 'basic'
              : 'standard',
        location: toMapPosition(
          ambulance.latitude,
          ambulance.longitude
        ),
      })),
    [ambulances]
  );

  const hospitalData: Hospital[] = useMemo(
    () =>
      hospitals.map((hospital) => ({
        id: hospital.id,
        name: hospital.name,
        distance: 0,
        travelTime: 0,
        icuCapacity: hospitalCapacity(
          hospital.available_beds
        ),
        traumaCapability: hospital.emergency_capable,
        currentLoad: 0,
        maxLoad: hospital.available_beds,
        location: toMapPosition(
          hospital.latitude,
          hospital.longitude
        ),
      })),
    [hospitals]
  );

  const availableAmbulances = ambulances.filter(
    (ambulance) =>
      ambulance.status.toLowerCase() === 'available'
  );

  const activeAmbulances = ambulances.filter(
    (ambulance) =>
      ambulance.status.toLowerCase() === 'busy' ||
      ambulance.status.toLowerCase() === 'active'
  );

  const availableHospitals = hospitals.filter(
    (hospital) => hospital.available_beds > 0
  );

  const incidentPosition = activeEmergency
    ? toMapPosition(
        activeEmergency.latitude,
        activeEmergency.longitude
      )
    : { x: 50, y: 50 };

  const nearestAmbulance = useMemo(() => {
    if (!activeEmergency || availableAmbulances.length === 0) {
      return null;
    }

    return [...availableAmbulances].sort((a, b) => {
      const distanceA =
        Math.pow(
          a.latitude - activeEmergency.latitude,
          2
        ) +
        Math.pow(
          a.longitude - activeEmergency.longitude,
          2
        );

      const distanceB =
        Math.pow(
          b.latitude - activeEmergency.latitude,
          2
        ) +
        Math.pow(
          b.longitude - activeEmergency.longitude,
          2
        );

      return distanceA - distanceB;
    })[0];
  }, [activeEmergency, availableAmbulances]);

  const nearestHospital = useMemo(() => {
    if (!activeEmergency || hospitals.length === 0) {
      return null;
    }

    return [...hospitals]
      .filter((hospital) => hospital.available_beds > 0)
      .sort((a, b) => {
        const distanceA =
          Math.pow(
            a.latitude - activeEmergency.latitude,
            2
          ) +
          Math.pow(
            a.longitude - activeEmergency.longitude,
            2
          );

        const distanceB =
          Math.pow(
            b.latitude - activeEmergency.latitude,
            2
          ) +
          Math.pow(
            b.longitude - activeEmergency.longitude,
            2
          );

        return distanceA - distanceB;
      })[0];
  }, [activeEmergency, hospitals]);

  const routes =
    nearestAmbulance && nearestHospital
      ? [
          {
            from: toMapPosition(
              nearestAmbulance.latitude,
              nearestAmbulance.longitude
            ),
            to: toMapPosition(
              nearestHospital.latitude,
              nearestHospital.longitude
            ),
            status: 'active' as const,
          },
        ]
      : [];

  return (
    <div className="min-h-screen pt-16 bg-resq-base">

      {/* SYSTEM STATUS */}
      <div className="border-b border-resq-border bg-resq-surface px-6 md:px-12 py-3 flex items-center gap-6 overflow-x-auto">

        <StatusLabel
          type={error ? 'warning' : 'operational'}
          label={error ? 'BACKEND ERROR' : 'SYSTEM OPERATIONAL'}
          pulse={!error}
        />

        <div className="h-4 w-px bg-resq-border" />

        <span className="mono-label">
          ACTIVE INCIDENTS:{' '}
          <span className="text-resq-coral">
            {emergencies.length}
          </span>
        </span>

        <div className="h-4 w-px bg-resq-border" />

        <span className="mono-label">
          AMBULANCES:{' '}
          <span className="text-resq-teal">
            {availableAmbulances.length}
          </span>{' '}
          AVAILABLE ·{' '}
          <span className="text-resq-amber">
            {activeAmbulances.length}
          </span>{' '}
          ACTIVE
        </span>

        <div className="h-4 w-px bg-resq-border" />

        <span className="mono-label">
          HOSPITALS:{' '}
          <span className="text-resq-teal">
            {availableHospitals.length}
          </span>{' '}
          WITH BEDS
        </span>

        <button
          onClick={loadLiveData}
          className="ml-auto flex items-center gap-2 font-mono text-xs text-resq-text-dim hover:text-resq-teal"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              loading ? 'animate-spin' : ''
            }`}
          />
          LIVE
        </button>
      </div>

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem-3rem)]">

        {/* MAP */}
        <div className="flex-1 lg:flex-[3] relative min-h-[400px] lg:min-h-0">

          <RouteMap
            resources={resourceData}
            hospitals={hospitalData}
            incidentPos={incidentPosition}
            routes={routes}
            height="100%"
            showLabels={false}
            className="border-r-0 lg:border-r border-resq-border"
          />

          {/* LIVE BADGE */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-resq-base/90 border border-resq-teal/40 rounded-sm">
              <span className="h-2 w-2 rounded-full bg-resq-teal animate-pulse" />
              <span className="font-mono text-xs text-resq-teal tracking-wider">
                LIVE BACKEND DATA
              </span>
            </div>
          </div>

          {/* LEGEND */}
          <div className="absolute bottom-4 left-4 bg-resq-base/90 backdrop-blur-sm border border-resq-border rounded-sm p-3 space-y-2">

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-resq-coral" />
              <span className="font-mono text-xs text-resq-text-dim uppercase tracking-wider">
                Incident
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-resq-teal" />
              <span className="font-mono text-xs text-resq-text-dim uppercase tracking-wider">
                Available
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-resq-coral" />
              <span className="font-mono text-xs text-resq-text-dim uppercase tracking-wider">
                Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-resq-teal" />
              <span className="font-mono text-xs text-resq-text-dim uppercase tracking-wider">
                Hospital
              </span>
            </div>

          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="lg:w-[400px] xl:w-[440px] bg-resq-surface border-t lg:border-t-0 border-resq-border overflow-y-auto">

          {/* INCIDENT */}
          <div className="p-6 border-b border-resq-border">

            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-resq-coral" />
              <span className="mono-label-coral">
                {activeEmergency
                  ? `${activeEmergency.id} · ${activeEmergency.emergency_type.toUpperCase()}`
                  : 'NO ACTIVE INCIDENT'}
              </span>
            </div>

            <h2 className="font-display text-xl font-semibold text-resq-text-bright">
              {activeEmergency
                ? 'Emergency Response'
                : 'Waiting for emergency'}
            </h2>

            <p className="text-sm text-resq-text-dim mt-2">
              {activeEmergency?.description ??
                'No emergency has been registered yet.'}
            </p>

            {activeEmergency && (
              <div className="grid grid-cols-2 gap-4 mt-4">

                <div>
                  <span className="mono-label block mb-1">
                    SEVERITY
                  </span>
                  <span className="font-mono text-sm text-resq-coral uppercase">
                    {activeEmergency.severity}
                  </span>
                </div>

                <div>
                  <span className="mono-label block mb-1">
                    STATUS
                  </span>
                  <span className="font-mono text-sm text-resq-teal uppercase">
                    {activeEmergency.status}
                  </span>
                </div>

              </div>
            )}

            {activeEmergency && (
              <div className="flex items-center gap-2 mt-4">
                <Clock className="h-3.5 w-3.5 text-resq-text-faint" />
                <span className="font-mono text-xs text-resq-text-faint">
                  {activeEmergency.created_at
                    ? new Date(
                        activeEmergency.created_at
                      ).toLocaleTimeString()
                    : 'LIVE'}
                </span>
              </div>
            )}
          </div>

          {/* AI RECOMMENDATION */}
          <div className="p-6 border-b border-resq-border">

            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-resq-teal" />
              <span className="mono-label-teal">
                RESPONSE RECOMMENDATION
              </span>
            </div>

            {nearestAmbulance ? (
              <div className="space-y-4">

                <div className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-resq-coral" />

                  <span className="font-mono text-xs text-resq-text">
                    {nearestAmbulance.name ??
                      nearestAmbulance.id}
                  </span>

                  <ArrowRight className="h-3 w-3 text-resq-text-faint" />

                  <span className="font-mono text-xs text-resq-teal">
                    INCIDENT
                  </span>
                </div>

                {nearestHospital && (
                  <div className="flex items-center gap-2 text-sm">

                    <span className="h-1.5 w-1.5 rounded-full bg-resq-teal" />

                    <span className="font-mono text-xs text-resq-text">
                      {nearestHospital.name}
                    </span>

                    <span className="font-mono text-xs text-resq-text-dim ml-auto">
                      {nearestHospital.available_beds} BEDS
                    </span>

                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-resq-border">

                  <p className="text-xs text-resq-text-dim leading-relaxed">
                    Nearest available ambulance identified from
                    live Supabase resource data. Hospital
                    availability is evaluated from the current
                    backend bed count.
                  </p>

                </div>
              </div>
            ) : (
              <p className="text-xs text-resq-text-dim">
                No available ambulance is currently registered.
              </p>
            )}
          </div>

          {/* LIVE RESOURCES */}
          <div className="p-6">

            <span className="mono-label mb-4 block">
              LIVE RESOURCE STATUS
            </span>

            <div className="space-y-3">

              {ambulances.map((ambulance) => (
                <motion.div
                  key={ambulance.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between border border-resq-border p-3"
                >

                  <div>
                    <span className="font-mono text-xs text-resq-text block">
                      {ambulance.name ?? ambulance.id}
                    </span>

                    <span className="font-mono text-[10px] text-resq-text-faint uppercase">
                      {ambulance.type ?? 'standard'}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[10px] uppercase ${
                      ambulance.status.toLowerCase() ===
                      'available'
                        ? 'text-resq-teal'
                        : 'text-resq-amber'
                    }`}
                  >
                    {ambulance.status}
                  </span>

                </motion.div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}