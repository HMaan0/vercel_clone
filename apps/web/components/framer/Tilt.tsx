"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const TiltAnimation = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0.3, 0.5], [15, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-fit"
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        style={{
          rotateX,
          transformOrigin: "center bottom",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
