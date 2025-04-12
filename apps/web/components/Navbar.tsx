import { TriangleIcon } from "../components/icons/TriangleIcon";
import React from "react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import Login from "./Login";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <header className="border-b border-gray-600/50 py-2 px-4 z-50 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TriangleIcon className="h-5 w-7 rotate-180" />
            <span className="text-gray-400">/</span>
            <div className="flex items-center gap-2">
              {session?.user.image && (
                <>
                  <Image
                    src={`${session.user.image}`}
                    alt="deploy Now"
                    height={50}
                    width={50}
                    className="rounded-full"
                  />
                </>
              )}
              <span className="text-lg font-medium">
                {session?.user.username
                  ? session?.user.username
                  : "Deploy Now. "}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href={"http://github.com/HMaan0"} target="_blank">
              <FaGithub size={35} />
            </Link>
            {!session && <Login>Login</Login>}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
