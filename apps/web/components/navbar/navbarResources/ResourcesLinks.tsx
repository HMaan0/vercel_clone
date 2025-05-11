import Link from "next/link";

const ResourcesLinks = ({
  link,
  resourceName,
}: {
  link: string;
  resourceName: string;
}) => {
  return (
    <Link href={link} target="_blank" className="lg:w-fit w-full">
      <p className="2xl:text-2xl text-xl font-medium lg:w-fit w-full hover:bg-black/10 lg:hover:bg-transparent lg:px-0 lg:py-0 px-7 py-3 rounded-2xl lg:border-0 border border-border-theme lg:transition-none transition-colors duration-300 cursor-pointer">
        {resourceName}
      </p>
    </Link>
  );
};

export default ResourcesLinks;
