import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from './components/nav/Navbar';
import GlobalIndiaBackground from './components/shared/GlobalIndiaBackground';

import LandingPage from './pages/LandingPage';
import IncidentAnalysis from './pages/IncidentAnalysis';
import Incidents from './pages/Incidents';
import CommandCenter from './pages/CommandCenter';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';

function RouteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="resq-route-shell relative min-h-screen bg-transparent">
      {children}
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent">

      {/* =====================================================
          GLOBAL INDIA NETWORK BACKGROUND
          Stays behind every page
      ===================================================== */}
      <GlobalIndiaBackground />

      {/* =====================================================
          GLOBAL CONTENT
      ===================================================== */}
      <div className="relative z-10">

        <Navbar />

        <Routes>

          {/* =================================================
              HOME
          ================================================= */}
          <Route
            path="/"
            element={
              <RouteShell>
                <LandingPage
                  onEnterCommandCenter={() => navigate('/command-center')}
                  onSeeHowItWorks={() => navigate('/analyze')}
                />
              </RouteShell>
            }
          />

          {/* =================================================
              ANALYZE
          ================================================= */}
          <Route
            path="/analyze"
            element={
              <RouteShell>
                <IncidentAnalysis />
              </RouteShell>
            }
          />

          {/* =================================================
              INCIDENTS
          ================================================= */}
          <Route
            path="/incidents"
            element={
              <RouteShell>
                <Incidents />
              </RouteShell>
            }
          />

          {/* =================================================
              COMMAND CENTER
          ================================================= */}
          <Route
            path="/command-center"
            element={
              <RouteShell>
                <CommandCenter
                  onNavigate={(route) => {
                    if (route === 'landing') {
                      navigate('/');
                    }

                    if (route === 'command-center') {
                      navigate('/command-center');
                    }

                    if (route === 'incident') {
                      navigate('/incidents');
                    }
                  }}
                />
              </RouteShell>
            }
          />

          {/* =================================================
              HOW IT WORKS
          ================================================= */}
          <Route
            path="/how-it-works"
            element={
              <RouteShell>
                <HowItWorks />
              </RouteShell>
            }
          />

          {/* =================================================
              ABOUT
          ================================================= */}
          <Route
            path="/about"
            element={
              <RouteShell>
                <About />
              </RouteShell>
            }
          />

        </Routes>
      </div>

      {/* =====================================================
          IMPORTANT:
          Your existing pages use bg-resq-base as their main
          page background. This removes ONLY that opaque base
          layer so the global India image can remain visible.

          Inner panels such as bg-resq-surface remain untouched.
      ===================================================== */}
      <style>{`
        .resq-route-shell .bg-resq-base {
          background-color: transparent !important;
        }
      `}</style>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}