import FooterLinks from "./FooterLinks";
import LogoTitle from "../logoTitle/LogoTitle";
import FooterIcons from "./FooterIcons";
import { SiGithub, SiSlack } from "@icons-pack/react-simple-icons";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="2xl:px-58 md:px-30.5 px-5 py-5 md:py-7.5 border-t border-border-theme bg-gray-600/10 mt-36 2xl:mt-48">
      <div className="flex justify-between items-center w-full  md:flex-row flex-col md:gap-0 gap-5 mb-5">
        <div className="w-full flex items-start ">
          <LogoTitle />
        </div>
        <div className="flex justify-between items-center w-full">
          <FooterLinks title="Community" link="https://deployit.vercel.app" />
          <FooterLinks
            title="Documentation"
            link="https://deployit.vercel.app"
          />
          <FooterLinks title="Blogs" link="https://deployit.vercel.app" />
          <FooterLinks title="Company" link=" https://deployit.vercel.app" />
        </div>
      </div>
      <div className="py-5 flex justify-between items-center w-full border-t border-border-theme">
        <div className="w-full ">
          <p className="text-xs md:text-sm text-text-theme text-start">
            © 2025 Structured Labs, Inc.
          </p>
        </div>
        <div className="flex justify-between items-center w-3xs">
          <FooterIcons link="https://github.com/HMaan0">
            <FaLinkedin size={25} />
          </FooterIcons>
          <FooterIcons link="https://github.com/HMaan0">
            <SiGithub />
          </FooterIcons>
          <FooterIcons link="https://github.com/HMaan0">
            <SiSlack />
          </FooterIcons>
          <FooterIcons link="https://github.com/HMaan0">
            <FaXTwitter size={25} />
          </FooterIcons>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
