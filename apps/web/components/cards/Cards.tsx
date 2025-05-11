import Card from "./card/SingleCard";

const Cards = () => {
  return (
    <>
      <div className="flex 2xl:gap-15 lg:gap-10 gap-4 flex-col">
        <div className="flex 2xl:gap-15 lg:gap-10 gap-4 md:flex-row flex-col">
          <Card
            title="Secure Environment"
            description="Environment variables are securely hashed and never exposed in your application."
          />
          <Card
            title="Custom & Changeable link"
            description="Get a clean, custom URL with SSL certificate for every deployment."
          />
          <Card
            title="Real-time Deployment Logs"
            description="Watch your deployment logs in real-time as your application builds and deploys."
          />
        </div>
      </div>
    </>
  );
};

export default Cards;
