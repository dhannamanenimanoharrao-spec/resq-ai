import { IndiaMap } from '@vishalvoid/react-india-map';
import { motion } from 'framer-motion';

export default function DNAVisual() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        right-[-25px]
        top-1/2
        z-10
        hidden
        h-[650px]
        w-[650px]
        -translate-y-1/2
        lg:block
      "
    >
      {/* Soft atmospheric glow */}
      <motion.div
        className="
          absolute
          left-1/2
          top-1/2
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/[0.08]
          blur-[110px]
        "
        animate={{
          scale: [0.94, 1.07, 0.97, 0.94],
          opacity: [0.35, 0.65, 0.4, 0.35],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating India map */}
      <motion.div
        className="relative h-full w-full"
        animate={{
          y: [0, -7, 3, 0],
          rotateZ: [0, 0.5, -0.4, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="india-resq-map absolute inset-[6%]">
          <IndiaMap />
        </div>

        {/* Subtle glow behind India */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[430px]
            w-[430px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-300/[0.035]
            blur-[70px]
          "
        />
      </motion.div>

      {/* Small system label only */}
      <div
        className="
          absolute
          right-[7%]
          top-[15%]
          font-mono
          text-[9px]
          uppercase
          tracking-[0.25em]
          text-resq-text-faint
        "
      >
        INDIA RESPONSE NETWORK
      </div>

      <style>{`
        .india-resq-map {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .india-resq-map .india-map-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .india-resq-map .india-map-container svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .india-resq-map .india-map-container path {
          fill: rgba(11, 31, 45, 0.94) !important;
          stroke: rgba(103, 232, 249, 0.62) !important;
          stroke-width: 1.15 !important;
          vector-effect: non-scaling-stroke;
          transition:
            fill 0.5s ease,
            stroke 0.5s ease,
            filter 0.5s ease;
        }

        .india-resq-map .india-map-container path:hover {
          fill: rgba(25, 184, 204, 0.18) !important;
          stroke: rgba(103, 232, 249, 0.9) !important;
        }

        /* Outer India glow */
        .india-resq-map .india-map-container {
          filter:
            drop-shadow(0 0 7px rgba(25, 184, 204, 0.28))
            drop-shadow(0 0 25px rgba(25, 184, 204, 0.10));
        }
      `}</style>
    </div>
  );
}