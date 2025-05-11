import Button from "../../button/Button";
import Login from "../../Login";
import GithubInfo from "./githubInfo/GithubInfo";

const NavbarUtilities = () => {
  return (
    <div className="flex gap-5 justify-center items-center lg:flex-row flex-col-reverse ">
      <GithubInfo />
      <Login>
        <Button className="bg-black text-white hover:bg-black/85">
          SignUp
        </Button>
      </Login>
      <Login>
        <Button className="hover:bg-black/10 bg-gray-600/10">Login</Button>
      </Login>
    </div>
  );
};

export default NavbarUtilities;
