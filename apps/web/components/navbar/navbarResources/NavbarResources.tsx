import ResourcesLinks from "./ResourcesLinks";

const NavbarResources = () => {
  return (
    <div className="lg:ml-10 flex gap-5 justify-center items-center lg:flex-row flex-col ">
      <ResourcesLinks link="https://deployit.vercel.app" resourceName="Docs" />
      <ResourcesLinks link="https://deployit.vercel.app" resourceName="Blog" />
      <ResourcesLinks
        link="https://deployit.vercel.app"
        resourceName="Community"
      />
    </div>
  );
};

export default NavbarResources;
