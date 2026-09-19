import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function GlobalIndiaBackground() {
  const { scrollY } = useScroll();

  const backgroundY = useSpring(
    useTransform(scrollY, [0, 4000], [0, -120]),
    {
      stiffness: 55,
      damping: 24,
      mass: 0.8,
    }
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      {/* INDIA NETWORK IMAGE */}
      <motion.div
        className="
          absolute
          -inset-[15%]
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          y: backgroundY,
          backgroundImage: "url('/india%20network.png')",
        }}
        animate={{
          scale: [1.06, 1.09, 1.06],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* DARK CINEMATIC OVERLAY */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(6,17,31,0.70) 0%,
              rgba(6,17,31,0.25) 28%,
              rgba(6,17,31,0.38) 58%,
              rgba(6,17,31,0.84) 100%
            )
          `,
        }}
      />

      {/* CENTER VIGNETTE */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(6,17,31,0.16) 0%,
              rgba(6,17,31,0.32) 42%,
              rgba(6,17,31,0.58) 100%
            )
          `,
        }}
      />

      {/* VERY SUBTLE CYAN ATMOSPHERE */}
      <motion.div
        className="
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/[0.035]
          blur-[140px]
        "
        animate={{
          scale: [0.96, 1.05, 0.97, 0.96],
          opacity: [0.35, 0.6, 0.4, 0.35],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

    </div>
  );
}