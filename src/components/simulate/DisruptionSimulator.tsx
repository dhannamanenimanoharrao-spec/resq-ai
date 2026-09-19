import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, Check, Zap } from 'lucide-react';
import { disruptions } from '@/data/mockIncidents';
import { initialResponsePlan, reoptimizedResponsePlan } from '@/data/mockResponsePlans';
import type { ResponsePlan } from '@/types/responsePlan';
import type { DisruptionEvent } from '@/types/incident';

type SimPhase = 'idle' | 'detected' | 'recalculating' | 'new-plan';

export default function DisruptionSimulator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [phase, setPhase] = useState<SimPhase>('idle');
  const [activeDisruption, setActiveDisruption] = useState<DisruptionEvent | null>(null);
  const [plan, setPlan] = useState<ResponsePlan>(initialResponsePlan);

  const triggerDisruption = useCallback(async (disruption: DisruptionEvent) => {
    if (phase === 'recalculating') return;
    setActiveDisruption(disruption);
    setPhase('detected');

    setTimeout(() => setPhase('recalculating'), 1500);
    setTimeout(() => {
      const newPlan: ResponsePlan = { ...reoptimizedResponsePlan };
      if (disruption.type === 'icu-full') {
        newPlan.assignments = newPlan.assignments.map((a) =>
          a.hospital.id === 'HOS-B'
            ? { ...a, hospital: { ...a.hospital, name: 'Eastside Regional', icuCapacity: 'available' }, eta: a.eta + 2, explanation: 'Hospital B ICU filled. Rerouted to Eastside Regional — available ICU, trauma-certified.' }
            : a,
        );
      }
      if (disruption.type === 'ambulance-unavailable') {
        newPlan.assignments = newPlan.assignments.map((a) =>
          a.ambulance.id === 'AMB-A'
            ? { ...a, ambulance: { ...a.ambulance, label: 'Ambulance B', id: 'AMB-B' }, eta: a.eta + 3, explanation: 'Ambulance A went offline. Ambulance B reassigned — next closest advanced unit.' }
            : a,
        );
      }
      if (disruption.type === 'traffic-increase') {
        newPlan.assignments = newPlan.assignments.map((a) => ({ ...a, eta: Math.round(a.eta * 1.4) }));
        newPlan.overallETA = Math.round(newPlan.overallETA * 1.4);
      }
      if (disruption.type === 'new-victim') {
        newPlan.assignments = [...newPlan.assignments, {
          ...newPlan.assignments[0],
          patientId: 'P5',
          patient: { ...newPlan.assignments[0].patient, id: 'P5', label: 'PATIENT 05', severity: 'moderate', status: 'stable', description: 'Conscious, chest pain reported', requiredCapability: 'advanced' },
          eta: 11,
          explanation: 'New victim detected at scene. Ambulance C (basic) reassigned — patient is stable, basic transport sufficient.',
        }];
      }
      setPlan(newPlan);
      setPhase('new-plan');
    }, 3500);

    setTimeout(() => setPhase('idle'), 8000);
  }, [phase]);

  return (
    <section ref={ref} className="relative py-32 section-pad bg-resq-surface">
      <div className="max-w-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="mono-label-teal mb-4 block">09 — Break the Plan</span>
          <h2 className="font-display text-display-lg font-bold text-resq-text-bright max-w-3xl">
            Trigger a disruption. Watch the system adapt.
          </h2>
          <p className="mt-4 text-resq-text-dim max-w-xl">
            Each scenario pushes a different constraint. The system detects, re-optimizes,
            and produces a new plan — in seconds.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Disruption buttons */}
          <div className="lg:col-span-2 space-y-3">
            <span className="mono-label mb-4 block">DISRUPTION SCENARIOS</span>
            {disruptions.map((d, i) => (
              <motion.button
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08 }}
                onClick={() => triggerDisruption(d)}
                disabled={phase === 'recalculating' || phase === 'detected'}
                className={`w-full text-left p-4 border rounded-sm transition-all group ${
                  activeDisruption?.id === d.id
                    ? 'border-resq-coral bg-resq-coral/5'
                    : 'border-resq-border hover:border-resq-teal/50 hover:bg-resq-surface-2'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <Zap className={`h-4 w-4 ${activeDisruption?.id === d.id ? 'text-resq-coral' : 'text-resq-teal group-hover:text-[#F5F0E6]'}`} />
                  <span className="font-mono text-sm text-resq-text-bright">{d.label}</span>
                </div>
                <p className="text-xs text-resq-text-faint mt-2 pl-7">{d.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Response panel */}
          <div className="lg:col-span-3">
            <div className="bg-resq-base border border-resq-border rounded-sm min-h-[500px] p-6 md:p-8">
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col"
                  >
                    <span className="mono-label-teal mb-6 block">CURRENT RESPONSE PLAN</span>
                    <div className="space-y-4">
                      {plan.assignments.map((a, i) => (
                        <div key={i} className="flex items-center gap-4 pb-3 border-b border-resq-border">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            a.patient.severity === 'critical' ? 'bg-resq-coral' :
                            a.patient.severity === 'severe' ? 'bg-resq-amber' : 'bg-resq-text-faint'
                          }`} />
                          <span className="font-mono text-xs text-resq-text-faint w-16">{a.patient.label}</span>
                          <span className="font-mono text-sm text-resq-text">{a.ambulance.label}</span>
                          <span className="text-resq-text-faint">→</span>
                          <span className="font-mono text-sm text-resq-teal">{a.hospital.name}</span>
                          <span className="font-mono text-sm text-resq-text-bright ml-auto">{a.eta}min</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <div>
                        <span className="mono-label block">OVERALL ETA</span>
                        <span className="font-mono text-2xl font-bold text-resq-text-bright tabular-nums">{plan.overallETA} MIN</span>
                      </div>
                      <div>
                        <span className="mono-label block text-right">CONFIDENCE</span>
                        <span className="font-mono text-2xl font-bold text-resq-teal tabular-nums">{plan.confidence}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {phase === 'detected' && (
                  <motion.div
                    key="detected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <AlertTriangle className="h-12 w-12 text-resq-coral" />
                    </motion.div>
                    <span className="mono-label-coral mt-6 block">EVENT DETECTED</span>
                    <p className="text-sm text-resq-text mt-4 text-center max-w-xs">
                      {activeDisruption?.description}
                    </p>
                  </motion.div>
                )}

                {phase === 'recalculating' && (
                  <motion.div
                    key="recalculating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="h-12 w-12 text-resq-amber" />
                    </motion.div>
                    <span className="mono-label mt-6 block" style={{ color: '#E8A838' }}>
                      RECALCULATING RESPONSE
                    </span>
                    <div className="flex gap-2 mt-4">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-resq-amber"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {phase === 'new-plan' && (
                  <motion.div
                    key="new-plan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Check className="h-5 w-5 text-resq-teal" />
                      <span className="mono-label-teal">NEW OPTIMAL PLAN</span>
                    </div>
                    <div className="space-y-4">
                      {plan.assignments.map((a, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 pb-3 border-b border-resq-border"
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            a.patient.severity === 'critical' ? 'bg-resq-coral' :
                            a.patient.severity === 'severe' ? 'bg-resq-amber' : 'bg-resq-text-faint'
                          }`} />
                          <span className="font-mono text-xs text-resq-text-faint w-16">{a.patient.label}</span>
                          <span className="font-mono text-sm text-resq-text">{a.ambulance.label}</span>
                          <span className="text-resq-text-faint">→</span>
                          <span className="font-mono text-sm text-resq-teal">{a.hospital.name}</span>
                          <span className="font-mono text-sm text-resq-text-bright ml-auto">{a.eta}min</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <div>
                        <span className="mono-label block">NEW ETA</span>
                        <span className="font-mono text-2xl font-bold text-resq-teal tabular-nums">{plan.overallETA} MIN</span>
                      </div>
                      <div>
                        <span className="mono-label block text-right">CONFIDENCE</span>
                        <span className="font-mono text-2xl font-bold text-resq-teal tabular-nums">{plan.confidence}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
