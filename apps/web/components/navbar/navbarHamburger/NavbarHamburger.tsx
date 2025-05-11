"use client";

import { useEffect, useState } from "react";

import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import HamburgerButton from "../../button/HamburgerButton";
import LogoTitle from "../../logoTitle/LogoTitle";

const NavbarHamburger = ({ children }: { children: React.ReactNode }) => {
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    if (toggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [toggle]);
  return (
    <>
      <HamburgerButton onClick={() => setToggle(true)}>
        <GiHamburgerMenu size={25} />
      </HamburgerButton>
      {toggle && (
        <>
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 "
            onClick={() => setToggle(false)}
          />
          <div className="px-4 gap-5 flex flex-col items-center  fixed top-0 right-0 w-3/5 h-dvh bg-gray-600/10 backdrop-blur-3xl border-l-2 border-gray-600/50 z-50">
            <div className="w-full   flex justify-end p-4">
              <HamburgerButton onClick={() => setToggle(false)}>
                <RxCross1 size={25} />
              </HamburgerButton>
            </div>
            <div>
              <LogoTitle />
            </div>
            <div className="w-full">{children}</div>
          </div>
        </>
      )}
    </>
  );
};

export default NavbarHamburger;
