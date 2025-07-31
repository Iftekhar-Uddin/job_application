"use client"
import { logout } from "@/providers/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import React from "react";


const Navbar = () => {
  const {data: session} =  useSession();
  // const router = useRouter();
  // console.log(session)
  return (
    <nav className="mx-auto max-w-7xl bg-white rounded-lg h-16">
      <div className="flex h-full justify-between items-center px-4 ">
        <div className="">
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              className="w-auto"
              src={"/job.png"}
              alt="Job logo"
              height={40}
              width={40}
            />
            <span className="text-xl font-semibold text-cyan-700">
              Job Board
            </span>
          </Link>
        </div>
        <div className={`grid gap-x-8 ${session ? "grid-cols-4" : "grid-cols-2 gap-x-4"}`}>
          {session ? (
            <>
              <Link
                href={"/jobs"}
                className="text-gray-600 hover:text-cyan-800 font-medium rounded-md active:underline"
              >
                Browse Jobs
              </Link>
              <Link
                href={"/jobs/post"}
                className="text-gray-600 hover:text-cyan-800 font-medium rounded-md active:underline"
              >
                Post a job
              </Link>
              <Link
                href={"/dashboard"}
                className="text-gray-600 hover:text-cyan-800 font-medium rounded-md active:underline"
              >
                Dashboard
              </Link>
              {/* <Link
                href={"/About"}
                className="text-gray-600 hover:text-cyan-800 font-medium rounded-md active:underline"
              >
                About
              </Link> */}
              <button
                onClick={() => {logout(),
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }}
                className="text-gray-600 cursor-pointer hover:text-cyan-800 font-medium rounded-md active:underline"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href={"/jobs"}
                className="text-gray-600 hover:text-cyan-800 font-medium rounded-md active:underline"
              >
                Browse Jobs
              </Link>
              <Link
                href={"/auth/signin"}
                className="text-gray-600 hover:text-cyan-800 font-medium rounded-md active:underline"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
