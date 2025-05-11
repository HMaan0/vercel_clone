import React from "react";
import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Footer from "./footer/Footer";
import AppearAnimation from "./framer/AppearAnimation";
import DeploymentWorkFlow from "./scrollCards/DeploymentWorkFlow";
import ScrollCard from "./card/ScrollCard";
import CodeEditor from "./scrollCards/CodeEditor";
import BarGraph from "./scrollCards/BarGraph";
import Cards from "./cards/Cards";
import BookDemo from "./card/BookDemo";
import Button from "./button/Button";
import Login from "./Login";

const Landing = () => {
  return (
    <>
      <header className="sticky top-5 z-40 px-5 2xl:px-20 xl:px-20 w-full flex justify-center items-center mt-5 ">
        <AppearAnimation>
          <Navbar />
        </AppearAnimation>
      </header>
      <main className=" 2xl:px-44 xl:px-20 px-5 xl:py-10 py-5 flex flex-col items-center justify-center gap-32 2xl:gap-38 sm:mt-0 mt-14">
        <section className="flex justify-center items-center flex-col gap-5 mt-5">
          <Hero />
          <Login className="w-full justify-center flex mt-14">
            <Button
              className="bg-white text-2xl text-black"
              width="md:w-8/12 w-full "
            >
              Deploy
            </Button>
          </Login>
        </section>
        <section className="h-full w-full flex flex-col gap-32">
          <ScrollCard
            title="Push code to Git and we will Deploy "
            description="Deploy It creates a CI/CD pipeline for your repository and deploys your latest code to production automatically."
            cardName="VS Code"
          >
            <CodeEditor />
          </ScrollCard>
          <ScrollCard
            title="Deploy applications and see build logs live"
            description="Deploy your app with one Click for a live link—no setup or hosting. Get SSL certified link of your application "
            cardName="Deployment"
          >
            <DeploymentWorkFlow />
          </ScrollCard>
          <ScrollCard
            title="Monitor daily users, Usage, Traffic and many more"
            description="Monitor the daily usage of your application, see any production logs, traffic, requests in real time via web-sockets"
            cardName="Chart"
          >
            <div className="flex flex-col p-5 gap-4">
              <p className="text-lg">Monthly Traffic</p>
              <BarGraph />
            </div>
          </ScrollCard>
        </section>
        <section className="flex flex-col w-full justify-center items-center 2xl:gap-15 lg:gap-10 gap-4">
          <Cards />
          <BookDemo />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Landing;
