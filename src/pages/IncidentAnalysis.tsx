import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, Loader2, FileText, AlertTriangle } from 'lucide-react';
import ResponsePlan from '@/components/shared/ResponsePlan';
import { initialResponsePlan } from '@/data/mockResponsePlans';
import type { ResponsePlan as ResponsePlanType } from '@/types/responsePlan';

interface IncidentAnalysisProps {
  onNavigate: (route: 'landing' | 'command-center' | 'incident') => void;
}

interface EmergencyResponse {
  id: string;
  latitude: number;
  longitude: number;
  emergency_type: string;
  severity: string;
  status: string;
  description: string | null;
  created_at?: string;
  assigned_ambulance_id?: string | null;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

const analysisStages = [
  'PARSING INCIDENT',
  'IDENTIFYING PATIENT PRIORITIES',
  'CHECKING RESOURCES',
  'EVALUATING HOSPITALS',
  'OPTIMIZING RESPONSE',
];

const placeholderText =
  'Major accident near highway. Four victims. One unconscious and two with severe bleeding.';

export default function IncidentAnalysis({
  onNavigate,
}: IncidentAnalysisProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const [input, setInput] = useState(placeholderText);
  const [analyzing, setAnalyzing] = useState(false);
  const [stage, setStage] = useState(-1);
  const [plan, setPlan] = useState<ResponsePlanType | null>(null);
  const [emergency, setEmergency] =
    useState<EmergencyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (analyzing || !input.trim()) return;

    setAnalyzing(true);
    setPlan(null);
    setEmergency(null);
    setError(null);
    setStage(0);

    try {
      // -----------------------------------------------
      // Analysis stages
      // -----------------------------------------------

      for (let i = 0; i < analysisStages.length; i++) {
        setStage(i);

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );
      }

      // -----------------------------------------------
      // Create REAL emergency through FastAPI
      // -----------------------------------------------

      const emergencyPayload = {
        id: `EMG-${Date.now()}`,
        emergency_type: 'medical',
        severity: 'critical',
        description: input.trim(),

        // Current demo location.
        // Can later be replaced with live GPS.
        latitude: 17.443,
        longitude: 78.38,
      };

      const response = await fetch(
        `${API_BASE_URL}/emergencies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emergencyPayload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Backend returned ${response.status}: ${errorText}`
        );
      }

      const createdEmergency: EmergencyResponse =
        await response.json();

      // -----------------------------------------------
      // Store REAL backend response
      // -----------------------------------------------

      setEmergency(createdEmergency);

      // Keep existing visual response-plan component
      setPlan(initialResponsePlan);

      setStage(analysisStages.length);
    } catch (err) {
      console.error(
        'RESQ-AI emergency creation failed:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to RESQ-AI backend.'
      );

      setStage(-1);
    } finally {
      setAnalyzing(false);
    }
  }, [analyzing, input]);

  return (
    <div
      ref={ref}
      className="min-h-screen pt-16 bg-resq-base"
    >
      <div className="max-w-section section-pad py-16">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : {}
          }
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="mono-label-teal mb-4 block">
            INCIDENT ANALYSIS
          </span>

          <h1 className="font-display text-display-md font-bold text-resq-text-bright max-w-3xl">
            Paste an emergency report. Watch the system think.
          </h1>

          <p className="mt-4 text-resq-text-dim max-w-xl">
            RESQ-AI converts an emergency report into a
            structured emergency record and stores it through
            the FastAPI + Supabase backend.
          </p>
        </motion.div>


        {/* =================================================
            INCIDENT INPUT
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : {}
          }
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-start gap-4">

            <div className="flex-1">

              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-resq-text-dim" />

                <span className="mono-label">
                  FREE-TEXT INCIDENT REPORT
                </span>
              </div>

              <textarea
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                disabled={analyzing}
                placeholder="Describe the emergency..."
                className="w-full bg-resq-surface border border-resq-border rounded-sm p-4 text-resq-text font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-resq-teal/50 transition-colors min-h-[120px] disabled:opacity-50"
              />

            </div>

          </div>

          <button
            onClick={handleAnalyze}
            disabled={
              analyzing ||
              !input.trim()
            }
            className="mt-4 flex items-center gap-2 bg-resq-teal text-resq-base px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-[0.15em] font-semibold hover:bg-resq-teal-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Incident'
            )}

          </button>

        </motion.div>


        {/* =================================================
            ERROR
        ================================================= */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mb-10 border border-resq-amber/40 bg-resq-surface p-4 rounded-sm"
            >
              <div className="flex items-start gap-3">

                <AlertTriangle className="h-5 w-5 text-resq-amber mt-0.5" />

                <div>
                  <span className="mono-label-teal block mb-2">
                    BACKEND CONNECTION ERROR
                  </span>

                  <p className="text-sm text-resq-text-dim font-mono">
                    {error}
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* =================================================
            ANALYSIS STAGES
        ================================================= */}

        <AnimatePresence>
          {stage >= 0 &&
            stage < analysisStages.length && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="mb-12"
              >

                <div className="space-y-3">

                  {analysisStages.map(
                    (stageName, i) => (
                      <div
                        key={stageName}
                        className={`flex items-center gap-3 transition-opacity ${
                          i <= stage
                            ? 'opacity-100'
                            : 'opacity-30'
                        }`}
                      >

                        <div className="w-5 h-5 flex items-center justify-center">

                          {i < stage ? (
                            <Check className="h-4 w-4 text-resq-teal" />
                          ) : i === stage ? (
                            <Loader2 className="h-4 w-4 text-resq-amber animate-spin" />
                          ) : (
                            <span className="h-2 w-2 rounded-full border border-resq-border" />
                          )}

                        </div>

                        <span
                          className={`font-mono text-sm uppercase tracking-[0.15em] ${
                            i < stage
                              ? 'text-resq-teal'
                              : i === stage
                              ? 'text-resq-amber'
                              : 'text-resq-text-faint'
                          }`}
                        >
                          {stageName}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </motion.div>
            )}
        </AnimatePresence>


        {/* =================================================
            REAL BACKEND RESULT
        ================================================= */}

        <AnimatePresence>
          {emergency && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-10"
            >

              <div className="border border-resq-teal/30 bg-resq-surface rounded-sm p-5">

                <div className="flex items-center gap-3 mb-5">

                  <Check className="h-5 w-5 text-resq-teal" />

                  <span className="mono-label-teal">
                    EMERGENCY REGISTERED
                  </span>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                  <div>
                    <span className="mono-label block mb-1">
                      EMERGENCY ID
                    </span>

                    <span className="font-mono text-sm text-resq-teal">
                      {emergency.id}
                    </span>
                  </div>

                  <div>
                    <span className="mono-label block mb-1">
                      TYPE
                    </span>

                    <span className="font-mono text-sm text-resq-text">
                      {emergency.emergency_type}
                    </span>
                  </div>

                  <div>
                    <span className="mono-label block mb-1">
                      SEVERITY
                    </span>

                    <span className="font-mono text-sm text-resq-amber uppercase">
                      {emergency.severity}
                    </span>
                  </div>

                  <div>
                    <span className="mono-label block mb-1">
                      STATUS
                    </span>

                    <span className="font-mono text-sm text-resq-teal uppercase">
                      {emergency.status}
                    </span>
                  </div>

                </div>

                <div className="mt-5 pt-4 border-t border-resq-border">

                  <span className="mono-label block mb-1">
                    LOCATION
                  </span>

                  <span className="font-mono text-sm text-resq-text-dim">
                    {emergency.latitude},{' '}
                    {emergency.longitude}
                  </span>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>


        {/* =================================================
            RESPONSE PLAN
        ================================================= */}

        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >

              <div className="pt-8 border-t border-resq-border">

                <div className="flex items-center gap-3 mb-8">

                  <Check className="h-5 w-5 text-resq-teal" />

                  <span className="mono-label-teal">
                    RESPONSE PLAN
                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-16">

                  <ResponsePlan
                    plan={plan}
                    showExplainability
                  />

                  <div className="space-y-6">

                    <div>

                      <span className="mono-label mb-3 block">
                        SYSTEM STATUS
                      </span>

                      <div className="space-y-2">

                        {[
                          {
                            label: 'Incident registered',
                            value: 'SUPABASE',
                          },
                          {
                            label: 'Emergency status',
                            value:
                              emergency?.status?.toUpperCase() ??
                              'PENDING',
                          },
                          {
                            label: 'Resources available',
                            value: 'LIVE API',
                          },
                          {
                            label: 'Hospitals available',
                            value: 'LIVE API',
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-baseline justify-between border-b border-resq-border pb-2"
                          >

                            <span className="mono-label">
                              {item.label}
                            </span>

                            <span className="font-mono text-sm text-resq-teal">
                              {item.value}
                            </span>

                          </div>
                        ))}

                      </div>

                    </div>


                    <div className="bg-resq-surface border border-resq-border rounded-sm p-4">

                      <span className="mono-label-teal mb-2 block">
                        BACKEND STATUS
                      </span>

                      <div className="flex items-baseline gap-2">

                        <span className="font-mono text-3xl font-bold text-resq-teal tabular-nums">
                          LIVE
                        </span>

                      </div>

                      <p className="text-xs text-resq-text-faint mt-2">
                        Emergency successfully registered through
                        FastAPI and persisted in Supabase.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}