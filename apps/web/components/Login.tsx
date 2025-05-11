"use client";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Login = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { data: session } = useSession();
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  async function handleGithubSignin() {
    setLoadingGithub(true);
    await signIn("github");
    setShowModal(false);
  }

  function handleGuestSignin() {
    setLoadingGuest(true);
    router.push("/projects");
    setShowModal(false);
  }

  function handleButtonClick() {
    if (session) {
      router.push("/projects");
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <>
      <span onClick={handleButtonClick} className={className}>
        {children}
      </span>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border-gray-600/50 border p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Sign In</h2>
            <p className="mb-6">Choose how you would like to continue:</p>

            <div className="space-y-4 font-medium flex flex-col justify-center">
              <span
                onClick={handleGithubSignin}
                className="cursor-pointer w-full px-4 py-2 bg-gray-800/50 text-white rounded flex items-center justify-center hover:bg-gray-700/50 transition-colors "
              >
                {loadingGithub ? (
                  <>
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
                    Loading...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Sign in with GitHub
                  </>
                )}
              </span>
              {!pathname.includes("projects") && (
                <>
                  <span
                    onClick={handleGuestSignin}
                    className="flex justify-center items-center cursor-pointer w-full px-4 py-2 bg-zinc-100 text-zinc-900 rounded hover:bg-zinc-200 transition-colors "
                  >
                    {loadingGuest ? (
                      <>
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
                        Loading...
                      </>
                    ) : (
                      <>Continue as Guest</>
                    )}
                  </span>
                </>
              )}

              <span
                onClick={closeModal}
                className="cursor-pointer w-full px-4 py-2 border border-gray-600/50 text-white rounded mt-2 hover:bg-black/25 transition-colors text-center"
              >
                Cancel
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
