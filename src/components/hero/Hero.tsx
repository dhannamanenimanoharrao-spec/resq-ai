import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeroProps {
  onEnterCommandCenter: () => void;
  onSeeHowItWorks: () => void;
}

export default function Hero({
  onEnterCommandCenter,
  onSeeHowItWorks,
}: HeroProps) {
  /*
   * Subtle hero-specific movement.
   * The GLOBAL background is already handled by
   * GlobalIndiaBackground.tsx.
   */
  const { scrollY } = useScroll();

  const heroGlowY = useSpring(
    useTransform(scrollY, [0, 1000], [0, -45]),
    {
      stiffness: 70,
      damping: 25,
    }
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent">

      {/* subtle hero atmosphere */}
      <motion.div
        className="
          pointer-events-none
          absolute
          right-[5%]
          top-[18%]
          h-[600px]
          w-[600px]
          rounded-full
          bg-cyan-400/[0.04]
          blur-[150px]
        "
        style={{
          y: heroGlowY,
        }}
      />

      {/* =====================================================
          MEDICAL SYMBOL
      ===================================================== */}

      <MedicalSymbol />

      {/* =====================================================
          CENTER HERO CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-30
          flex
          min-h-screen
          items-center
          justify-center
          px-6
          pb-24
          pt-32
          md:px-10
        "
      >
        <div className="mx-auto w-full max-w-[950px] text-center">

          {/* eyebrow */}

          <motion.p
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 3.75,
            }}
            className="
              mb-7
              font-mono
              text-[10px]
              uppercase
              tracking-[0.30em]
              text-white
              drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]
              md:text-[11px]
            "
          >
            SMARTER RESPONSE. SAFER LIVES.
          </motion.p>

          {/* title */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 32,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.85,
              delay: 3.95,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              font-display
              text-[clamp(4rem,10vw,8rem)]
              font-extrabold
              leading-[0.86]
              tracking-[-0.065em]
              text-white
              drop-shadow-[0_8px_36px_rgba(0,0,0,0.95)]
            "
          >
            RESQ
            <span
              className="
                text-[#67E8F9]
                drop-shadow-[0_0_22px_rgba(103,232,249,0.35)]
              "
            >
              -AI
            </span>
          </motion.h1>

          {/* subtitle */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 4.15,
            }}
            className="
              mx-auto
              mt-8
              max-w-3xl
              text-[clamp(1.5rem,3vw,2.55rem)]
              font-semibold
              leading-[1.12]
              tracking-[-0.025em]
              text-[#F7FBFD]
              drop-shadow-[0_5px_24px_rgba(0,0,0,0.9)]
            "
          >
            Adaptive Emergency Resource
            <br />
            Orchestration Engine
          </motion.h2>

          {/* description */}

          <motion.p
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 4.35,
            }}
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-base
              leading-7
              text-[#E1EDF2]
              drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]
              md:text-lg
            "
          >
            Leveraging AI to connect the right resources,
            ambulances, hospitals, and medical teams
            when every second matters.
          </motion.p>

          {/* buttons */}

          <motion.div
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 4.55,
            }}
            className="
              mt-10
              flex
              flex-wrap
              justify-center
              gap-4
            "
          >

            {/* ANALYZE INCIDENT */}

            <Link
              to="/analyze"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#FFF4D6]
                px-7
                py-3.5
                font-mono
                text-[11px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-black
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-white
                hover:shadow-[0_0_40px_rgba(255,244,214,0.25)]
              "
            >
              Analyze Incident

              <ArrowRight
                className="
                  h-4
                  w-4
                  text-black
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

            {/* COMMAND CENTER */}

            <Link
              to="/command-center"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-white/35
                bg-[#06111F]/50
                px-8
                py-3.5
                font-mono
                text-[11px]
                uppercase
                tracking-[0.14em]
                text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#67E8F9]/80
                hover:bg-[#06111F]/70
              "
            >
              Command Center

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

          </motion.div>

          {/* =================================================
              LOWER HOME INFORMATION
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 4.8,
            }}
            className="
              mx-auto
              mt-16
              flex
              max-w-3xl
              flex-wrap
              justify-center
              gap-x-12
              gap-y-6
              border-t
              border-white/15
              pt-6
            "
          >
            <InfoBlock
              title="RESPONSE"
              text="Faster coordination"
            />

            <InfoBlock
              title="RESOURCES"
              text="Capability-aware matching"
            />

            <InfoBlock
              title="ADAPTATION"
              text="Continuous re-optimization"
            />
          </motion.div>

        </div>
      </div>

      {/* =====================================================
          BOTTOM RESPONSE LINE
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 1,
          delay: 5.0,
        }}
        className="
          absolute
          bottom-6
          left-7
          right-7
          z-40
          md:left-12
          md:right-12
          lg:left-20
          lg:right-20
        "
      >
        <div className="flex items-center gap-5">

          <span
            className="
              hidden
              whitespace-nowrap
              font-mono
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/65
              md:block
            "
          >
            REAL-TIME RESPONSE
          </span>

          <div className="relative h-px flex-1 bg-white/20">

            <motion.div
              animate={{
                x: [0, 28, 0],
                opacity: [0.25, 1, 0.25],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="
                absolute
                left-[15%]
                top-1/2
                h-1.5
                w-1.5
                -translate-y-1/2
                rounded-full
                bg-[#67E8F9]
                shadow-[0_0_14px_rgba(103,232,249,0.9)]
              "
            />

            <svg
              viewBox="0 0 100 20"
              className="
                absolute
                left-[14%]
                top-1/2
                h-8
                w-24
                -translate-y-1/2
              "
              preserveAspectRatio="none"
            >
              <path
                d="M0 10 H22 L28 10 L31 2 L34 18 L37 10 H100"
                fill="none"
                stroke="#67E8F9"
                strokeWidth="1"
              />
            </svg>

          </div>

          <span
            className="
              hidden
              whitespace-nowrap
              font-mono
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/65
              md:block
            "
          >
            AI-POWERED ORCHESTRATION
          </span>

        </div>
      </motion.div>

    </section>
  );
}


/* =========================================================
   MEDICAL SYMBOL
========================================================= */

function MedicalSymbol() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        left: '50%',
        top: '97%',
        x: '-50%',
        y: '-50%',
        scale: 0.28,
      }}
      animate={{
        opacity: [0, 1, 1, 1],

        left: [
          '50%',
          '50%',
          '50%',
          '5.5%',
        ],

        top: [
          '97%',
          '72%',
          '45%',
          '14%',
        ],

        x: [
          '-50%',
          '-50%',
          '-50%',
          '0%',
        ],

        y: [
          '-50%',
          '-50%',
          '-50%',
          '0%',
        ],

        scale: [
          0.28,
          0.72,
          1.08,
          0.14,
        ],
      }}
      transition={{
        duration: 3.55,
        times: [0, 0.18, 0.5, 1],
        ease: [0.22, 1, 0.36, 1],
      }}
      className="pointer-events-none absolute z-50"
      style={{
        transformOrigin: 'top left',
      }}
    >

      {/* Arrival glow */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.3,
        }}
        animate={{
          opacity: [0, 0.9, 0],
          scale: [0.3, 1.3, 1.8],
        }}
        transition={{
          duration: 1.9,
          delay: 0.4,
          ease: 'easeOut',
        }}
        className="
          absolute
          inset-[-55px]
          rounded-full
          bg-[#67E8F9]/20
          blur-[40px]
        "
      />

      <div className="relative h-56 w-40">

        <svg
          viewBox="0 0 140 220"
          className="h-full w-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >

          {/* Central staff */}

          <motion.path
            d="M70 42V204"
            stroke="#67E8F9"
            strokeWidth="3.2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.35,
              ease: 'easeOut',
            }}
          />

          {/* Top sphere */}

          <motion.circle
            cx="70"
            cy="27"
            r="6"
            fill="#67E8F9"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.45,
              delay: 0.55,
              type: 'spring',
              stiffness: 260,
            }}
          />

          {/* Left wing */}

          <motion.path
            d="M70 45C54 30 35 23 12 30C29 39 42 50 55 61"
            stroke="#67E8F9"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.85,
              delay: 0.55,
            }}
          />

          {/* Right wing */}

          <motion.path
            d="M70 45C86 30 105 23 128 30C111 39 98 50 85 61"
            stroke="#67E8F9"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.85,
              delay: 0.55,
            }}
          />

          {/* Left snake */}

          <motion.path
            d="
              M70 53
              C44 39 29 59 39 78
              C49 97 74 84 85 104
              C96 123 85 142 70 136
              C53 130 38 147 48 166
              C57 185 82 178 86 204
            "
            stroke="#C8F7FC"
            strokeWidth="3.4"
            strokeLinecap="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 1.55,
              delay: 0.5,
              ease: 'easeInOut',
            }}
          />

          {/* Right snake */}

          <motion.path
            d="
              M70 53
              C96 39 111 59 101 78
              C91 97 66 84 55 104
              C44 123 55 142 70 136
              C87 130 102 147 92 166
              C83 185 58 178 54 204
            "
            stroke="#67E8F9"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 1.55,
              delay: 0.68,
              ease: 'easeInOut',
            }}
          />

          {/* travelling light left */}

          <motion.circle
            r="3"
            fill="#67E8F9"
            initial={{
              cx: 39,
              cy: 78,
              opacity: 0,
            }}
            animate={{
              cy: [78, 104, 136, 166, 204],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 1.9,
              delay: 0.62,
              ease: 'easeInOut',
            }}
          />

          {/* travelling light right */}

          <motion.circle
            r="3"
            fill="#C8F7FC"
            initial={{
              cx: 101,
              cy: 78,
              opacity: 0,
            }}
            animate={{
              cy: [78, 104, 136, 166, 204],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 1.9,
              delay: 0.78,
              ease: 'easeInOut',
            }}
          />

          {/* sparks */}

          {[22, 118].map((cx, index) => (
            <motion.circle
              key={cx}
              cx={cx}
              cy="92"
              r="2"
              fill="#67E8F9"
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 1.1 + index * 0.15,
                ease: 'easeOut',
              }}
            />
          ))}

        </svg>

      </div>
    </motion.div>
  );
}


/* =========================================================
   INFORMATION BLOCK
========================================================= */

function InfoBlock({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">

      <span
        className="
          font-mono
          text-[9px]
          uppercase
          tracking-[0.18em]
          text-[#67E8F9]
        "
      >
        {title}
      </span>

      <p className="mt-1 text-sm text-[#D5E3EA]">
        {text}
      </p>

    </div>
  );
}