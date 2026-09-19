export default function Incidents() {
    return (
      <main className="min-h-screen bg-resq-base px-6 pb-24 pt-32 md:px-14 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
  
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-resq-teal">
            INCIDENT MANAGEMENT
          </p>
  
          <h1 className="mt-4 font-display text-display-lg font-semibold text-resq-text-bright">
            Active Incidents
          </h1>
  
          <p className="mt-5 max-w-2xl text-lg leading-8 text-resq-text-dim">
            Monitor emergency incidents, response status, assigned resources,
            location and priority from a single operational view.
          </p>
  
          <div className="mt-14 border-t border-resq-border">
  
            <div className="grid grid-cols-6 gap-4 border-b border-resq-border py-5 font-mono text-xs uppercase tracking-wider text-resq-text-faint">
              <span>Incident</span>
              <span>Type</span>
              <span>Priority</span>
              <span>Location</span>
              <span>Resource</span>
              <span>Status</span>
            </div>
  
            <div className="grid grid-cols-6 gap-4 border-b border-resq-border py-6 text-sm text-resq-text-dim">
              <span className="font-mono text-resq-text-bright">INC-2047</span>
              <span>ACCIDENT</span>
              <span className="text-resq-coral">CRITICAL</span>
              <span>Ghatkesar</span>
              <span className="font-mono">AMB-07</span>
              <span className="text-resq-teal">EN_ROUTE</span>
            </div>
  
            <div className="grid grid-cols-6 gap-4 border-b border-resq-border py-6 text-sm text-resq-text-dim">
              <span className="font-mono text-resq-text-bright">INC-2046</span>
              <span>MEDICAL</span>
              <span>HIGH</span>
              <span>Hyderabad</span>
              <span className="font-mono">AMB-03</span>
              <span className="text-resq-teal">ASSIGNED</span>
            </div>
  
          </div>
  
        </div>
      </main>
    );
  }