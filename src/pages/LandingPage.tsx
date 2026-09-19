import Hero from "@/components/hero/Hero";
import Footer from "@/components/nav/Footer";
import DNASection from "@/components/DNASection";

interface LandingPageProps {
  onNavigate: (
    route: "landing" | "command-center" | "incident"
  ) => void;
}

export default function LandingPage({
  onNavigate,
}: LandingPageProps) {
  return (
    <div className="min-h-screen">

      {/* =========================
          HOME / HERO
      ========================= */}

      <div className="relative overflow-hidden">

        {/* MAIN HERO */}

        <Hero
          onEnterCommandCenter={() =>
            onNavigate("command-center")
          }
          onSeeHowItWorks={() => {
            // Connect to /how-it-works later
          }}
        />

        {/* =========================
            FLOATING DNA
        ========================= */}

        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-20
            z-10
            h-[500px]
            w-[500px]
            md:right-[-80px]
            md:h-[550px]
            md:w-[550px]
            lg:right-[-50px]
            lg:h-[600px]
            lg:w-[600px]
          "
        >
          <DNASection />
        </div>

      </div>


      {/* =========================
          INTRODUCTION SECTION
      ========================= */}

      <section
        className="
          bg-resq-base
          px-6
          py-24
          md:px-14
          lg:px-20
        "
      >

        <div className="mx-auto max-w-[900px] text-center">

          {/* LABEL */}

          <p
            className="
              mb-4
              font-mono
              text-xs
              uppercase
              tracking-[0.2em]
              text-resq-teal
            "
          >
            RESQ-AI
          </p>


          {/* HEADING */}

          <h2
            className="
              font-display
              text-3xl
              font-semibold
              text-resq-text-bright
              md:text-5xl
            "
          >
            Emergency response that adapts as the situation changes.
          </h2>


          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-resq-text-dim
              md:text-lg
            "
          >
            RESQ-AI helps operators understand emergencies,
            prioritize patients, evaluate available resources,
            assess hospital capability, and adapt the response
            when conditions change.
          </p>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <Footer onNavigate={onNavigate} />

    </div>
  );
}