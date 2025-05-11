"use client";
import { motion } from "framer-motion";

const AppearAnimation = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 50, delay: 0.1 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default AppearAnimation;
