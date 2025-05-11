import Image from "next/image";
import React from "react";
import { RxCross1 } from "react-icons/rx";

const ScrollCard = ({
  title,
  description,
  children,
  cardName,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  cardName: string;
}) => {
  return (
    <>
      <div className="flex xl:flex-row flex-col justify-center items-center gap-2 xl:px-0 sm:px-0 md:px-20">
        <div className="w-fit flex flex-col justify-center xl:gap-5 px-5 ">
          <p className="2xl:text-4xl md:text-3xl sm:text-xl text-lg font-medium ">
            {title}
          </p>
          <p className="2xl:text-xl md:text-lg  text-text-theme font-medium sm:block hidden ">
            {description}
          </p>
        </div>
        <div className="xl:w-full lg:w-3/4 w-full flex  flex-col border border-border-theme rounded-2xl shadow ">
          <div className="rounded-t-2xl border-b border-border-theme w-full relative bg-gray-600/10 p-2">
            <div className="flex absolute left-4 gap-1 top-0 justify-center items-center h-full">
              <button className="p-1 bg-red-600/70 transition-colors duration-100 rounded-full w-min"></button>
              <button className="p-1 bg-yellow-600/70 transition-colors duration-100 rounded-full w-min "></button>
              <button className="p-1 bg-green-600/70 transition-colors duration-100 rounded-full w-min "></button>
            </div>
            <div className="sm:flex hidden absolute text-sm left-15 -bottom-[0.5px] justify-between items-center gap-2 border border-border-theme border-b-gray-600/10 bg-gray-600/10 rounded-t-xl w-fit px-2 p-1 text-text-theme">
              <Image src={"logo.svg"} alt="preswald" width={12} height={12} />
              Deploy It
              <RxCross1 className="text-lg hover:bg-light-bg p-1 cursor-pointer transition-colors duration-300 rounded-full" />
            </div>

            <p className="text-center md:text-xl text-lg font-medium w-full ">
              {cardName}
            </p>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default ScrollCard;
