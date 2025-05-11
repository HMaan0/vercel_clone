import Link from "next/link";
import RepoStarsCount from "./RepoStarsCount";
import { SiGithub } from "@icons-pack/react-simple-icons";

const GithubInfo = () => {
  return (
    <>
      <Link
        href="https://github.com/HMaan0/vercel_clone"
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center gap-1"
      >
        <div className="w-10 h-10">
          <SiGithub size={40} />
        </div>
        <RepoStarsCount />
      </Link>
    </>
  );
};

export default GithubInfo;
