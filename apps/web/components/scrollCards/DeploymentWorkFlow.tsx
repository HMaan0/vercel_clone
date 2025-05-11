"use client";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { PiCircleDashed } from "react-icons/pi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";

const DeploymentWorkFlow = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [lastButtonIndex, setLastButtonIndex] = useState({
    side: "",
    index: -1,
  });
  const [showLoader, setShowLoader] = useState(true);

  const buttonsLeft = [
    { title: "Packaging files", delay: 1 },
    { title: "Generated a live link", delay: 10 },
    {
      title: (
        <>
          Live link{" "}
          <Link
            href={"https://demo.vercelws.xyz"}
            target="_blank"
            className="px-2 py-1 pointer-cursor hover:bg-green-600/10 rounded-xl transition-colors duration-300"
          >
            <span className="underline text-green-700/80">
              https://demo.vercelws.xyz
            </span>
          </Link>
        </>
      ),
      delay: 14,
    },
  ];

  const buttonsRight = [
    { title: "Docker Environment", delay: 2 },
    { title: "Build Image", delay: 3 },
    { title: "Install Dependencies", delay: 4 },
    { title: "Start Container", delay: 10 },
  ];

  const allButtons = [
    ...buttonsLeft.map((btn, idx) => ({ ...btn, side: "left", index: idx })),
    ...buttonsRight.map((btn, idx) => ({ ...btn, side: "right", index: idx })),
  ].sort((a, b) => a.delay - b.delay);

  useEffect(() => {
    if (isInView) {
      const timers = allButtons.map((button) => {
        return setTimeout(() => {
          setLastButtonIndex({ side: button.side, index: button.index });
        }, button.delay * 1000);
      });
      const loaderTimer = setTimeout(() => {
        setShowLoader(false);
      }, 15000);

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
        clearTimeout(loaderTimer);
      };
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      <div className="p-5 flex justify-start items-center gap-3 ">
        <p className=" text-lg font-medium">Deploying application</p>
        {showLoader ? (
          <AiOutlineLoading3Quarters
            className="animate-spin text-orange-peel-400"
            size={20}
          />
        ) : (
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/70 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-green-600/70"></span>
          </span>
        )}
      </div>
      <div className="w-11/12 container m-auto border border-border-theme"></div>
      <div className="flex justify-center items-center py-5 flex-col">
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="h-full flex flex-col gap-5 justify-between items-center py-1 w-full  "
        >
          <AnimatePresence>
            {buttonsLeft.map((button, index) => (
              <motion.div
                key={index}
                variants={buttonVariants}
                custom={button.delay}
                className="w-full flex flex-col justify-center 2xl:px-5 sm:px-2 px-0 "
              >
                <p
                  className={`text:sm sm:text-lg px-2.5 sm:px-10 flex justify-start items-center gap-2 `}
                >
                  <PiCircleDashed
                    size={20}
                    className={`font-bold ${
                      lastButtonIndex.side === "left" &&
                      lastButtonIndex.index === index &&
                      index !== 2
                        ? "text-orange-peel-400"
                        : "text-green-700"
                    }`}
                  />
                  {button.title}
                </p>

                {index === 0 && (
                  <>
                    <motion.div
                      ref={containerRef}
                      variants={containerVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="h-full flex flex-wrap gap-2 justify-center items-end py-1 w-full px-0 2xl:px-20"
                    >
                      <AnimatePresence>
                        {buttonsRight.map((button, index) => (
                          <motion.div
                            key={index}
                            variants={buttonVariants}
                            custom={button.delay}
                            className="w-[calc(50%-0.625rem)] flex justify-center px-0 sm:px-5  "
                          >
                            <div
                              className={`w-full px-1.5 py-0.5 sm:px-3 sm:py-2 rounded-xl shadow border border-border-theme text-sm text-text-theme flex justify-between items-center ${
                                lastButtonIndex.side === "right" &&
                                lastButtonIndex.index === index
                                  ? "border-yellow-400 border"
                                  : ""
                              }`}
                            >
                              {button.title}
                              {index !== buttonsRight.length - 2 ? (
                                <>
                                  <div className="flex justify-center items-center  gap-0.5 sm:gap-2">
                                    <span className="p-1 bg-green-700/50 rounded-full h-min"></span>
                                    <p className=" text-end text-xs ">cached</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-center items-center gap-0.5 sm:gap-2 ">
                                    {lastButtonIndex.side === "right" &&
                                    lastButtonIndex.index === index ? (
                                      <>
                                        <span className="p-1 bg-yellow-700/50 rounded-full h-min"></span>
                                        <p className=" text-end text-[10px] ">
                                          new change
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        <span className="p-1 bg-green-700/50 rounded-full h-min"></span>
                                        <p className=" text-end text-xs ">
                                          cached
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default DeploymentWorkFlow;
