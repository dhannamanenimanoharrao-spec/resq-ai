import ProblemComparison from '@/components/problem/ProblemComparison';
import IntelligenceParser from '@/components/intelligence/IntelligenceParser';
import ResourceNetwork from '@/components/orchestration/ResourceNetwork';
import DecisionEngine from '@/components/decision/DecisionEngine';
import HospitalIntelligence from '@/components/hospital/HospitalIntelligence';
import AdaptiveResponseDemo from '@/components/adaptive/AdaptiveResponseDemo';

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-resq-base pt-24">

      {/* PAGE INTRO */}
      <section className="px-6 py-20 md:px-14 lg:px-20">
        <div className="mx-auto max-w-[1400px]">

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-resq-teal">
            HOW RESQ-AI WORKS
          </p>

          <h1 className="mt-5 max-w-4xl font-display text-display-lg font-semibold text-resq-text-bright">
            From emergency information
            <br />
            to an adaptive response.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-resq-text-dim">
            RESQ-AI interprets the emergency, understands patient priorities,
            evaluates available resources, considers hospital capability and
            route conditions, and continuously adapts the response when the
            situation changes.
          </p>

        </div>
      </section>

      {/* 01 — THE PROBLEM */}
      <section id="problem">
        <ProblemComparison />
      </section>

      {/* 02 — INCIDENT UNDERSTANDING */}
      <section id="intelligence">
        <IntelligenceParser />
      </section>

      {/* 03 — RESOURCE ORCHESTRATION */}
      <section id="resources">
        <ResourceNetwork />
      </section>

      {/* 04 — DECISION ENGINE */}
      <section id="decision">
        <DecisionEngine />
      </section>

      {/* 05 — HOSPITAL INTELLIGENCE */}
      <section id="hospitals">
        <HospitalIntelligence />
      </section>

      {/* 06 — ADAPTIVE RESPONSE */}
      <section id="adaptive-response">
        <AdaptiveResponseDemo />
      </section>

    </main>
  );
}