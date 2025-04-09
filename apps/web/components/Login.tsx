"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleSignin() {
    setLoading(true);
    if (session) {
      router.push("/projects");
    } else {
      await signIn();
    }
  }

  return (
    <>
      {loading ? (
        <>
          <button
            disabled
            className="w-3/5 bg-zinc-200 text-zinc-900 rounded px-6 py-3 font-medium flex items-center justify-center"
          >
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleSignin}
            className="w-3/5 px-6 py-3 bg-zinc-100 text-zinc-900 rounded font-medium hover:cursor-pointer"
          >
            {children}
          </button>
        </>
      )}
    </>
  );
};

export default Login;

// async function handleAccessToken() {
//     console.log(session?.accessToken);
//     console.log(session?.user.image);
//     console.log(session?.user.username);
//     if (session?.accessToken) {
//       console.log("HELLO");
//       await getRepos(session.accessToken, session.user.username);
//     }
//     console.log("NOT HELLO");
//   }
