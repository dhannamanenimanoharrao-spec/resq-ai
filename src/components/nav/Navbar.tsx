import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Incidents', path: '/incidents' },
    { name: 'Command Center', path: '/command-center' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-resq-border bg-resq-base/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-12 lg:px-20">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative">
            <Activity
              className="h-5 w-5 text-resq-teal"
              strokeWidth={2}
            />

            <motion.div
              className="absolute inset-0 rounded-full bg-resq-teal/20 blur-md"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <span className="font-display text-lg font-semibold text-resq-text-bright">
            RESQ<span className="text-resq-teal">-AI</span>
          </span>
        </Link>

        {/* TOP-RIGHT NAVIGATION */}
        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ${
                  isActive
                    ? 'text-resq-teal'
                    : 'text-resq-text-dim hover:text-resq-text-bright'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

      </div>
    </motion.nav>
  );
}