"use client"
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // this is used for app router/use client components
import { useState } from "react";


const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    // const nav = document.querySelector('ul');
    // if (nav) {
    //   nav.classList.toggle('top-16');
    //   nav.classList.toggle('top-[-490px]');
    // }

    // const spans = document.querySelectorAll('button span');
    // spans.forEach((span) => {
    //   span.classList.toggle('bg-orange-500');
    //   span.classList.toggle('bg-cyan-700');
    // });

  };

  return (
    <nav className="mx-auto max-w-7xl bg-white rounded-sm md:rounded-lg h-10 md:h-16 sticky top-0 z-auto">
      <div className="flex w-full h-full justify-center items-center px-6">

        <div className="flex items-center justify-between w-full">

          <Link onClick={()=> setIsOpen(false)} href={"/"} className="flex items-center gap-1 md:gap-2">
            <Image
              className="w-auto"
              src={"/job.png"}
              alt="Job logo"
              height={32}
              width={32}
            />
            <span className="md:text-xl font-semibold text-cyan-700">
              Job Board
            </span>
          </Link>

          <button onClick={handleClick} className="cursor-pointer bg-transparent md:hidden block border-0 z-10">
            <span className={`${isOpen ? "first:transform translate-y-2 rotate-45 bg-orange-700" : ""} block w-6 h-1 my-1 md:bg-cyan-700 transition ease-in-out duration-300 bg-cyan-700`}></span>
            <span className={`${isOpen ? "even:opacity-0" : ""} block w-6 h-1 my-1 mt-auto md:bg-cyan-700 transition ease-in-out duration-300 bg-cyan-700`}></span>
            <span className={`${isOpen ? "last:transform -translate-y-2 -rotate-45 bg-orange-700" : ""} block w-6 h-1 my-1 md:bg-cyan-700 transition ease-in-out duration-300 bg-cyan-700`}></span>
          </button>

          <ul className={`flex flex-col md:flex-row gap-3 md:gap-4 items-center rounded-sm absolute md:static top-10.5 right-0 w-48 md:w-auto bg-white md:bg-transparent py-2 md:py-0 px-2 md:px-0 shadow-md md:shadow-none transition-all duration-500 ease-in" ${isOpen ? 'top-10' : 'top-[-490px]'}`}>
            {!session ? (
              <>
                <Link onClick={handleClick} href={"/jobs"} className="text-cyan-700 md:ring-1 rounded-full px-3 transition ease-in-out duration-300 hover:bg-cyan-800 hover:text-white cursor-pointer">Browse Jobs</Link>
                <Link onClick={handleClick} href={"/auth/signin"} className="text-cyan-700 md:ring-1 rounded-full px-3 transition ease-in-out duration-300 hover:bg-cyan-800 hover:text-white cursor-pointer">Sign In</Link>
              </>
            ) : (
              <>
                <Link onClick={handleClick} href={"/jobs"} className="text-cyan-700 md:ring-1 rounded-full px-3 transition ease-in-out duration-300 hover:bg-cyan-800 hover:text-white cursor-pointer">Browse Jobs</Link>
                <Link onClick={handleClick} href={"/jobs/post"} className="text-cyan-700 md:ring-1 rounded-full px-3 transition ease-in-out duration-300 hover:bg-cyan-800 hover:text-white cursor-pointer">Post a job</Link>
                <Link onClick={handleClick} href={"/dashboard"} className="text-cyan-700 md:ring-1 rounded-full px-3 transition ease-in-out duration-300 hover:bg-cyan-800 hover:text-white cursor-pointer">Dashboard</Link>
                <Link onClick={handleClick} href={"/about"} className="text-cyan-700 md:ring-1 rounded-full px-3 transition ease-in-out duration-300 hover:bg-cyan-800 hover:text-white cursor-pointer">About</Link>
                <button onClick={() => { signOut(); router.push("/"); handleClick() }} className="text-cyan-700 md:ring-1 rounded-full px-3 transition ease-in-out duration-300 hover:bg-cyan-800 hover:text-white cursor-pointer">Sign Out</button>
              </>
            )}
          </ul>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;