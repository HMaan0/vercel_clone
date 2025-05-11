import Link from "next/link";
import Button from "../button/Button";
import Login from "../Login";

const BookDemo = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-gray-600/30 via-gray-600/20 to-gray-600/10  relative rounded-4xl border border-border-theme  px-7.5 py-10 w-full sm:w-2/3 flex flex-col gap-4 md:gap-10 shadow ">
        <p className="text-2xl md:text-3xl font-medium">
          Open-source at its core. Enterprise when you need it.
        </p>
        <p className="text-lg md:text-xl text-text-theme">
          Use it your way. Start for free or book a demo for enterprise support.
        </p>
        <div className="flex justify-between w-full xl:px-20 md:px-10 px-0 flex-col md:flex-row md:gap-0 gap-5">
          <Login>
            <Button
              className="bg-black text-white hover:bg-black/85"
              width="w-full md:w-fit"
            >
              Get started
            </Button>
          </Login>

          <Login>
            <Button
              className="hover:bg-black/10 bg-gray-600/50"
              width="w-full md:w-fit"
            >
              Book a demo
            </Button>
          </Login>
        </div>
      </div>
    </>
  );
};

export default BookDemo;
