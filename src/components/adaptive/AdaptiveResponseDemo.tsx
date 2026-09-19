import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { RotateCcw, AlertTriangle, Loader2, Check } from 'lucide-react';

type Phase = 'before' | 'disruption' | 'reoptimizing' | 'after';

const phases: { id: Phase; label: string; delay: number }[] = [
  { id: 'before', label: 'BEFORE', delay: 0 },
  { id: 'disruption', label: 'DISRUPTION', delay: 2500 },
  { id: 'reoptimizing', label: 'RE-OPTIMIZING', delay: 4000 },
  { id: 'after', label: 'AFTER', delay: 6500 },
];

export default function AdaptiveResponseDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [phase, setPhase] = useState<Phase>('before');
  const [replayKey, setReplayKey] = useState(0);

  const runSequence = useCallback(() => {
    setPhase('before');
    const timers: ReturnType<typeof setTimeout>[] = [];
    phases.forEach((p) => {
      timers.push(setTimeout(() => setPhase(p.id), p.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const cleanup = runSequence();
    return cleanup;
  }, [inView, replayKey, runSequence]);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
  };

  return (
    <section ref={ref} className="relative py-32 section-pad">
      <div className="max-w-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 flex items-start justify-between"
        >
          <div>
            <span className="mono-label-teal mb-4 block">07 — Adaptive Response</span>
            <h2 className="font-display text-display-lg font-bold text-resq-text-bright max-w-3xl">
              When the plan breaks, the system doesn't.
            </h2>
            <p className="mt-4 text-resq-text-dim max-w-xl">
              Watch the response adapt in real time. A blocked route triggers re-optimization —
              new resources, new hospitals, new ETAs — without losing a second.
            </p>
          </div>
          <button
            onClick={handleReplay}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-resq-text-dim hover:text-resq-teal transition-colors shrink-0 mt-2"
          >
            <RotateCcw className="h-4 w-4" />
            Replay
          </button>
        </motion.div>

        {/* Phase indicators */}
        <div className="flex items-center gap-2 md:gap-4 mb-12">
          {phases.map((p) => (
            <div key={p.id} className="flex items-center gap-2 md:gap-4 flex-1">
              <div className={`flex items-center gap-2 transition-colors ${
                phase === p.id ? 'opacity-100' : phase === 'before' && p.id !== 'before' ? 'opacity-30' : 'opacity-50'
              }`}>
                <div className={`h-2 w-2 rounded-full transition-colors ${
                  phase === p.id
                    ? p.id === 'disruption' ? 'bg-resq-coral' : p.id === 'reoptimizing' ? 'bg-resq-amber' : 'bg-resq-teal'
                    : 'bg-resq-text-faint'
                }`} />
                <span className={`font-mono text-xs uppercase tracking-[0.15em] ${
                  phase === p.id
                    ? p.id === 'disruption' ? 'text-resq-coral' : p.id === 'reoptimizing' ? 'text-resq-amber' : 'text-resq-teal'
                    : 'text-resq-text-faint'
                }`}>
                  {p.label}
                </span>
              </div>
              {p.id !== 'after' && <div className="h-px flex-1 bg-resq-border" />}
            </div>
          ))}
        </div>

        {/* Demo area */}
        <div className="relative bg-resq-surface border border-resq-border rounded-sm overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {phase === 'before' && <BeforeView key="before" />}
            {phase === 'disruption' && <DisruptionView key="disruption" />}
            {phase === 'reoptimizing' && <ReoptimizingView key="reoptimizing" />}
            {phase === 'after' && <AfterView key="after" />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function BeforeView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 md:p-12"
    >
      <span className="mono-label-teal mb-6 block">INITIAL RESPONSE PLAN</span>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <PlanRow label="AMBULANCE" value="Ambulance B → Hospital B" status="active" />
          <PlanRow label="PATIENT" value="P1 — Critical → Trauma Center" status="active" />
          <PlanRow label="ROUTE" value="Highway 101 → Oak St Exit" status="active" />
        </div>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg viewBox="0 0 100 60" className="w-full min-w-[250px]">
              <path d="M 10 30 L 90 30" stroke="#4FB3A8" strokeWidth="0.8" fill="none" strokeLinecap="round" />
              <circle cx="10" cy="30" r="3" fill="#E45B61" />
              <circle cx="90" cy="30" r="3" fill="none" stroke="#4FB3A8" strokeWidth="0.5" />
              <rect x="87" y="27" width="6" height="6" rx="0.5" fill="#2E7A72" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ x: [0, 160, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full bg-resq-teal-bright"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-baseline gap-4">
        <span className="mono-label">ETA</span>
        <motion.span
          key="eta-before"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-4xl font-bold text-resq-teal tabular-nums"
        >
          6 MIN
        </motion.span>
      </div>
    </motion.div>
  );
}

function DisruptionView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 md:p-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="h-5 w-5 text-resq-coral" />
        <span className="mono-label-coral">ROUTE DISRUPTION DETECTED</span>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <PlanRow label="AMBULANCE" value="Ambulance B → Hospital B" status="disrupted" />
          <PlanRow label="DISRUPTION" value="Primary route blocked — vehicle collision" status="disrupted" />
          <PlanRow label="IMPACT" value="ETA increased significantly" status="disrupted" />
        </div>
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full min-w-[250px]">
            <path d="M 10 30 L 90 30" stroke="#E45B61" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeDasharray="2 2" />
            <circle cx="10" cy="30" r="3" fill="#E45B61" />
            <rect x="87" y="27" width="6" height="6" rx="0.5" fill="#2E7A72" />
            {/* Blockage marker */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <circle cx="50" cy="30" r="4" fill="#E45B61" opacity="0.2" />
              <circle cx="50" cy="30" r="2" fill="#E45B61" />
              <text x="50" y="40" textAnchor="middle" fontSize="2.5" fill="#E45B61" fontFamily="JetBrains Mono, monospace">
                BLOCKED
              </text>
            </motion.g>
          </svg>
        </div>
      </div>
      <div className="mt-8 flex items-baseline gap-4">
        <span className="mono-label">ETA</span>
        <div className="flex items-baseline gap-2">
          <motion.span
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.3 }}
            className="font-mono text-2xl text-resq-text-faint line-through tabular-nums"
          >
            6 MIN
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-4xl font-bold text-resq-coral tabular-nums"
          >
            16 MIN
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

function ReoptimizingView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px]"
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
      <p className="text-sm text-resq-text-dim mt-6 text-center max-w-sm">
        Evaluating alternate routes, available ambulances, and hospital capacity to
        produce a new optimal plan.
      </p>
    </motion.div>
  );
}

function AfterView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 md:p-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <Check className="h-5 w-5 text-resq-teal" />
        <span className="mono-label-teal">NEW OPTIMAL PLAN</span>
      </div>
      <div className="space-y-6">
        <PlanRow label="AMBULANCE B" value="→ Critical Patient (P1)" status="active" />
        <PlanRow label="HOSPITAL C" value="→ Trauma case (ICU available)" status="active" />
        <PlanRow label="POLICE UNIT" value="→ Route clearance" status="active" />
        <PlanRow label="ALTERNATE ROUTE" value="Highway 101 → Pine St → Hospital C" status="rerouted" />
      </div>
      <div className="mt-8 flex items-baseline gap-4">
        <span className="mono-label">NEW ETA</span>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-4xl font-bold text-resq-teal tabular-nums"
        >
          9 MIN
        </motion.span>
        <span className="font-mono text-sm text-resq-teal ml-2">SAVED 7 MIN</span>
      </div>
    </motion.div>
  );
}

function PlanRow({ label, value, status }: { label: string; value: string; status: 'active' | 'disrupted' | 'rerouted' }) {
  const colorClass = {
    active: 'text-resq-text-bright',
    disrupted: 'text-resq-coral',
    rerouted: 'text-resq-amber',
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 pb-4 border-b border-resq-border"
    >
      <span className="mono-label w-32 shrink-0">{label}</span>
      <span className={`font-mono text-sm ${colorClass}`}>{value}</span>
    </motion.div>
  );
}
