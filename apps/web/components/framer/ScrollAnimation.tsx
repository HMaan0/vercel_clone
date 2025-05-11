"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import BarGraph from "../scrollCards/BarGraph";
import CodeEditor from "../scrollCards/CodeEditor";
import DeploymentWorkFlow from "../scrollCards/DeploymentWorkFlow";
import ScrollCard from "../card/ScrollCard";

const ScrollAnimation = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.33, 0.33, 0.66],
    [1, 1, 0, 0]
  );
  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.33, 0.33, 0.66, 0.66, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const opacity3 = useTransform(
    scrollYProgress,
    [0, 0.66, 0.66, 1],
    [0, 0, 1, 1]
  );

  // Pointer events control
  const pointerEvents1 = useTransform(
    scrollYProgress,
    [0, 0.33, 0.33, 0.66],
    ["auto", "auto", "none", "none"]
  );
  const pointerEvents2 = useTransform(
    scrollYProgress,
    [0, 0.33, 0.33, 0.66, 0.66, 1],
    ["none", "none", "auto", "auto", "none", "none"]
  );
  const pointerEvents3 = useTransform(
    scrollYProgress,
    [0, 0.66, 0.66, 1],
    ["none", "none", "auto", "auto"]
  );

  return (
    <div className="flex flex-col xl:gap-3 gap-1">
      <p className="2xl:text-5xl md:text-4xl text-2xl font-medium text-center sticky top-1/5 mb-5">
        Write. Run. Share.
      </p>
      <div ref={containerRef} className="relative h-[300vh]">
        <motion.div
          style={{ opacity: opacity1, pointerEvents: pointerEvents1 }}
          className="sticky top-[30%] bg-white "
        >
          <ScrollCard
            title="A full data dev environment in your browser"
            description="Write and run Python code without installing anything. The environment persists, so your work is saved automatically."
            cardName="Preswald notebook"
          >
            <CodeEditor />
          </ScrollCard>
        </motion.div>
        <motion.div
          style={{ opacity: opacity2, pointerEvents: pointerEvents2 }}
          className="sticky top-[30%] bg-white"
        >
          <ScrollCard
            title="Build UIs with just a few lines of code"
            description="Use sliders, buttons, tables, and other components to make scripts interactive, without writing JavaScript or managing a frontend."
            cardName="Chart"
          >
            <div className="flex flex-col p-5 gap-4">
              <p className="text-lg">Daily revenue</p>
              <BarGraph />
            </div>
          </ScrollCard>
        </motion.div>
        <motion.div
          style={{ opacity: opacity3, pointerEvents: pointerEvents3 }}
          className="sticky top-[30%] bg-white"
        >
          <ScrollCard
            title="Shareable app link with Minimize recomputation"
            description="Deploy your app with a command for a live link—no setup or hosting. Only modified script parts re-run, reducing redundancy and boosting workflow efficiency."
            cardName="Deployment"
          >
            <DeploymentWorkFlow />
          </ScrollCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollAnimation;
