"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CiLocationOn, CiGlobe, CiUser } from "react-icons/ci";
import { PiPuzzlePiece } from "react-icons/pi";

const BarGraph = () => {
  const [value, setValue] = useState(50);
  const getBarHeight = (baseHeight: number, ratio: number) => {
    return baseHeight + value * ratio;
  };

  const bars = [
    { baseHeight: 40, ratio: 0.2 },
    { baseHeight: 60, ratio: 1 },
    {
      baseHeight: 30,
      ratio: 0.8,
    },
    {
      baseHeight: 50,
      ratio: 0.6,
    },
  ];

  return (
    <>
      <div className="h-45 flex w-full">
        {/* Y-axis */}
        <div className="flex w-min ">
          <div className="h-full flex flex-col justify-between text-xs text-text-theme mr-1 items-end">
            <div>2000</div>
            <div>1000</div>
            <div>0</div>
          </div>
          <div className="h-full border border-border-theme"></div>
        </div>
        {/* X-axis */}
        <div className="relative w-full h-full">
          {/* Horizontal Grid lines */}
          <div className="-z-10 absolute left-0 w-full h-full">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={`h-${i}`}
                className="-z-10 absolute w-full h-px bg-gray-600"
                style={{ top: `${i * 10}%` }}
              ></div>
            ))}
          </div>
          {/* Vertical Grid lines */}
          <div className="-z-10 absolute left-0 w-full h-full">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={`v-${i}`}
                className="-z-10 absolute h-full w-px bg-gray-600"
                style={{ left: `${i * 25}%` }}
              ></div>
            ))}
          </div>
          {/* Bars Container */}
          <div className=" h-full flex items-end justify-around w-full">
            {bars.map((bar, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Animated Bar */}
                <motion.div
                  className={`w-12 rounded-t-md bg-gradient-to-b from-white/60 to-transparent `}
                  style={{
                    height: `${getBarHeight(bar.baseHeight, bar.ratio)}px`,
                  }}
                  initial={{ height: 0 }}
                  animate={{
                    height: `${getBarHeight(bar.baseHeight, bar.ratio)}px`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Value label on top of bar */}
                  <div className="border-orange-peel-400 border -mt-1 rounded-full"></div>
                </motion.div>
              </div>
            ))}
          </div>
          <div className=" border border-border-theme "></div>
          <div className="flex justify-between items-center">
            <div className="mt-2 text-xs  text-text-theme text-center w-full flex justify-center items-center gap-1 ">
              <CiLocationOn />
              Jan
            </div>
            <div className="mt-2 text-xs  text-text-theme text-center w-full flex justify-center items-center gap-1">
              <CiGlobe />
              Feb
            </div>
            <div className="mt-2 text-xs  text-text-theme text-center w-full flex justify-center items-center gap-1">
              <CiUser />
              March
            </div>
            <div className="mt-2 text-xs  text-text-theme text-center w-full flex justify-center items-center gap-1">
              <PiPuzzlePiece />
              April
            </div>
          </div>
        </div>
      </div>
      {/* Slider Control */}
      <div className="w-1/2 flex flex-col text-center container m-auto mt-5">
        <label
          htmlFor="slider"
          className="block text-sm font-medium text-text-theme mb-1"
        >
          visitors
        </label>
      </div>
    </>
  );
};

export default BarGraph;
