export default function About() {
    return (
      <main className="min-h-screen bg-resq-base px-6 pb-24 pt-32 md:px-14 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
  
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-resq-teal">
            ABOUT RESQ-AI
          </p>
  
          <h1 className="mt-4 max-w-4xl font-display text-display-lg font-semibold text-resq-text-bright">
            Emergency response needs to adapt with the situation.
          </h1>
  
          <p className="mt-7 max-w-3xl text-lg leading-8 text-resq-text-dim">
            RESQ-AI is an AI-assisted emergency-response orchestration platform
            designed to help operators understand incidents, prioritize patients,
            evaluate available resources, assess hospital capability and adapt
            the response as conditions change.
          </p>
  
          <div className="mt-20 grid gap-12 md:grid-cols-2">
  
            <section>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-resq-teal">
                THE PROBLEM
              </p>
  
              <p className="mt-5 leading-8 text-resq-text-dim">
                Emergency response involves more than finding the nearest
                available resource. Patient needs, resource capabilities,
                hospital capacity and route conditions can all affect the
                response decision.
              </p>
            </section>
  
            <section>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-resq-teal">
                THE APPROACH
              </p>
  
              <p className="mt-5 leading-8 text-resq-text-dim">
                RESQ-AI brings these factors together into a coordinated response
                workflow that can be re-evaluated when the emergency situation
                changes.
              </p>
            </section>
  
          </div>
  
          <div className="mt-20 border-y border-resq-border py-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-resq-text-faint">
              RESPONSE FLOW
            </p>
  
            <div className="mt-8 flex flex-wrap gap-4 font-display text-xl text-resq-text-bright">
              <span>Incident</span>
              <span className="text-resq-teal">→</span>
              <span>Patients</span>
              <span className="text-resq-teal">→</span>
              <span>Resources</span>
              <span className="text-resq-teal">→</span>
              <span>Hospitals</span>
              <span className="text-resq-teal">→</span>
              <span>Routes</span>
              <span className="text-resq-teal">→</span>
              <span>Response</span>
            </div>
          </div>
  
        </div>
      </main>
    );
  }