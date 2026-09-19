import { motion } from "framer-motion";

export default function DNASection() {
  return (
    <motion.div
      initial={{
        y: 300,
        opacity: 0,
        scale: 0.85,
      }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1.8,
        ease: "easeOut",
      }}
      className="relative h-full w-full"
    >
      {/* DNA IMAGE */}
     
    </motion.div>
  );
}