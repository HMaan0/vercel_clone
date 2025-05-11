const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10 2xl:gap-20  z-10">
      <div className="flex justify-center items-center flex-col gap-5">
        <div className="flex w-full gap-2.5 2xl:gap-10 flex-col justify-center items-center 2xl:px-32 px-0">
          <p className="font-semibold 2xl:text-7xl md:text-5xl text-4xl text-center">
            Your complete platform for the web.
          </p>
          <p className="md:block hidden 2xl:block md:text-2xl 2xl:text-3xl text-text-theme text-center">
            Deploy Next.js, Node.js or Vite.js applications in seconds with zero
            configuration, Custom and changeable domains, Automated deployment
            from you repository, secure env, SSL certificates and many more..
          </p>
          <p className="md:hidden text-lg  text-text-theme text-center">
            Deploy Next.js, Node.js or Vite.js applications in seconds with zero
            configuration.
          </p>
        </div>
      </div>
      {/* <CommandSnippet /> */}
    </div>
  );
};

export default Hero;
