import Button from "@/components/button/Button";
import Link from "next/link";

const BookDemo = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-white via-light-bg/70 to-light-bg  relative rounded-4xl border border-border-theme  px-7.5 py-10 w-full sm:w-2/3 flex flex-col gap-4 md:gap-10 shadow ">
        <p className="text-2xl md:text-3xl font-medium">
          Open-source at its core. Enterprise when you need it.
        </p>
        <p className="text-lg md:text-xl text-text-theme">
          Use it your way. Start for free or book a demo for enterprise support.
        </p>
        <div className="flex justify-between w-full xl:px-20 md:px-10 px-0 flex-col md:flex-row md:gap-0 gap-5">
          <Link
            href={"https://app.preswald.com/"}
            target="_blank"
            className="w-full flex justify-center items-center"
          >
            <Button
              className="bg-black text-white hover:bg-black/85"
              width="w-full md:w-fit"
            >
              Get started
            </Button>
          </Link>
          <Link
            href={"https://cal.com/amruthagujjar"}
            target="_blank"
            className="w-full flex justify-center items-center"
          >
            <Button
              className="hover:bg-black/10 bg-white"
              width="w-full md:w-fit"
            >
              Book a demo
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BookDemo;
