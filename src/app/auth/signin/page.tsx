"use client";
import Signin from "@/components/signin";
import { useSession } from "next-auth/react";
import { loginWithGithub, loginWithGoogle } from "@/lib/provider";


const SignInPage = () => {
  const { data: session, status } = useSession();

  if (session) {
    window.location.href = "/dashboard";
  }

  const googleLogin = async () => {
    await loginWithGoogle();
  }

  const onGitHubLogin = async () => {
    await loginWithGithub();
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="flex justify-center items-center h-72 w-[560px] bg-white rounded-2xl">
          <h2 className="text-center text-4xl text-cyan-700">Loading...</h2>
        </div>
      </div>
    )
  } else if (status === "unauthenticated") {
    {
      return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <div className="grid grid-rows-1 gap-4 max-h-fit w-auto bg-white p-8 rounded-xl">
            <div className="flex flex-col items-center">
              <h1 className="text-cyan-700 font-bold text-4xl">
                Welcome to job portal
              </h1>
              <div className="flex text-gray-500">
                Sign in to post jobs
                <br />
                <div className="flex items-center gap-2">
                  <div className="h-px bg-borderGray flex-grow"></div>
                  <span className="text-textGrayLight">or</span>
                  <div className="h-px bg-borderGray flex-grow"></div>
                </div>
                <br />
                Apply for opportunity
              </div>
            </div>
            <Signin />
            <div className="flex py-1 justify-between">
              <button
                onClick={googleLogin}
                className="w-47 flex items-center justify-center gap-1 py-1.5 border border-black bg-black text-green-400 rounded-md hover:text-white hover:border-red-500 transition-colors duration-200 cursor-pointer"
              >
                {/* <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg> */}
                <span className="text-base font-medium">Continue with Google</span>
              </button>
              <button
                onClick={onGitHubLogin}
                className="w-47 flex items-center justify-center gap-1 py-1.5 border border-black bg-black text-yellow-400 rounded-md hover:text-white hover:border-red-500 transition-colors duration-200 cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-medium">Continue with GitHub</span>
              </button>
            </div>
            <div className="flex min-w-full justify-center">
              <p className="w-88 text-sm text-center">
                By signing in, you agree to&nbsp;
                <a href="#" className="text-blue-600 hover:text-indigo-500">
                  Terms of Service
                </a>
                &nbsp;and&nbsp;
                <a href="#" className="text-blue-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
                , including&nbsp;
                <a href="#" className="text-blue-600 hover:text-indigo-500">
                  Cookie Use.
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default SignInPage;
