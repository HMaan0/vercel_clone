import Link from "next/link";

const FooterLinks = ({ title, link }: { title: string; link: string }) => {
  return (
    <Link href={link} target="_blank" className="cursor-pointer">
      <button className="text-sm md:text-balance text-text-theme cursor-pointer hover:text-gray-600 duration-150 transition-colors">
        {title}
      </button>
    </Link>
  );
};

export default FooterLinks;
