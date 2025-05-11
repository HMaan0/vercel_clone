import { TiltAnimation } from "./Tilt";
import Image from "next/image";
import { Highlight } from "../ui/Dotted";
const ImageAnimation = () => {
  return (
    <div className="h-full  lg:h-96 my-12 w-full flex justify-start items-center lg:flex-row flex-col lg:gap-0 gap-12 ">
      <div className="lg:w-1/2 2xl:pr-44 lg:pr-20  w-full">
        <div className="flex flex-col gap-5 lg:gap-2 2xl:gap-5 w-full">
          <div className="2xl:text-5xl lg:text-4xl text-2xl font-medium text-center w-full">
            An open-source framework for interactive
            <Highlight>AI data apps.</Highlight>
          </div>
          <p className="2xl:text-2xl lg:text-xl text-lg text-text-theme font-medium text-center">
            Set up data connections, define transformations, and build
            visualizations. All in code.
          </p>
        </div>
      </div>
      <div className="w-1/2 absolute right-0 hidden lg:block">
        <TiltAnimation>
          <Image
            src={"/demo.gif"}
            width={800}
            height={500}
            alt={"Backed by Y Combinator Preswald Structured Labs"}
            priority={true}
            className="rounded-2xl z-10 shadow-xl hover:shadow-2xl border border-border-theme "
          />
        </TiltAnimation>
      </div>
      <div className="w-full flex justify-center items-center lg:hidden">
        <Image
          src={"/demo.gif"}
          width={800}
          height={500}
          alt={"Backed by Y Combinator Preswald Structured Labs"}
          priority={true}
          className="rounded-2xl z-10 shadow-xl hover:shadow-2xl border border-border-theme "
        />
      </div>
    </div>
  );
};

export default ImageAnimation;
