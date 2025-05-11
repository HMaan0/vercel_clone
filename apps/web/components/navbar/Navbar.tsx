import NavbarResources from "./navbarResources/NavbarResources";
import LogoTitle from "../logoTitle/LogoTitle";
import NavbarUtilities from "./navbarUtilities/NavbarUtilities";
import NavbarHamburger from "./navbarHamburger/NavbarHamburger";

const Navbar = () => {
  return (
    <nav className="2xl:px-14 xl:px-7 px-4 py-2.5 rounded-2xl shadow-md border border-gray-600/50 bg-gray-600/10  w-full">
      <div className="w-full lg:flex justify-between hidden  ">
        <LogoTitle />
        <NavbarResources />
        <NavbarUtilities />
      </div>
      <div className="w-full flex justify-between lg:hidden items-center ">
        <LogoTitle />
        <NavbarHamburger>
          <NavbarResources />
          <div className="border-b border-border-theme mt-5"></div>
          <div className="mt-5">
            <NavbarUtilities />
          </div>
        </NavbarHamburger>
      </div>
    </nav>
  );
};

export default Navbar;
