/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        resq: {
          base: '#06111F',
          surface: '#0B1928',
          'surface-2': '#102334',
          'surface-3': '#153047',

          border: '#1A3449',
          'border-light': '#2B4B63',

          text: '#DCEAF3',
          'text-bright': '#F8FAFC',
          'text-dim': '#9FB4C6',
          'text-faint': '#61798C',

          teal: '#19B8CC',
          'teal-bright': '#67E8F9',
          'teal-dim': '#0D7280',

          coral: '#EF4444',
          'coral-dim': '#8F2F2F',
          'coral-bright': '#F87171',

          amber: '#F59E0B',
        },
      },

      fontFamily: {
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'display-xl': [
          'clamp(3rem, 7vw, 6rem)',
          {
            lineHeight: '1.02',
            letterSpacing: '-0.045em',
          },
        ],

        'display-lg': [
          'clamp(2.25rem, 5vw, 4rem)',
          {
            lineHeight: '1.08',
            letterSpacing: '-0.03em',
          },
        ],

        'display-md': [
          'clamp(1.75rem, 3.5vw, 2.75rem)',
          {
            lineHeight: '1.12',
            letterSpacing: '-0.02em',
          },
        ],
      },

      animation: {
        'pulse-ring': 'pulse-ring 2.5s ease-out infinite',
        'draw-line': 'draw-line 1.5s ease-in-out forwards',
        scan: 'scan 2s ease-in-out infinite',
      },

      keyframes: {
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(2.5)',
            opacity: '0',
          },
        },

        'draw-line': {
          '0%': {
            strokeDashoffset: '1000',
          },
          '100%': {
            strokeDashoffset: '0',
          },
        },

        scan: {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
      },
    },
  },

  plugins: [],
};