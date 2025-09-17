import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";

const TotalJobs = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const session = await auth()
  // if (!session?.user) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen bg-white"> 
  //       <h1 className="text-4xl text-red-600 mb-4">Access Denied</h1>
  //       <p className="text-lg text-gray-700">You must be logged in to view this page.</p>
  //       <Link href="/auth/signin" className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
  //         Go to Login
  //       </Link>
  //     </div>
  //   );
  // }
  const { query, type, location } = await searchParams;
  const querys = query as string | undefined;
  const searchType = type as string | undefined;
  const searchLocation = location as string | undefined;

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        querys
          ? {
            OR: [
              { title: { contains: querys, mode: "insensitive" } },
              { company: { contains: querys, mode: "insensitive" } },
              { responsibilities: { contains: querys, mode: "insensitive" } },
            ]
          }
          : {},
        type ? { type: searchType } : {},
        searchLocation
          ? { location: { contains: searchLocation, mode: "insensitive" } }
          : {}
      ]
    },
    orderBy: { postedAt: "desc" },
    include: { postedBy: true },
  });


  let today = new Date();
  const AvailableJobs = jobs.filter((job) => new Date(job?.deadline as Date) > today);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-4 bg-white rounded-md">
        <h1 className="text-lg md:text-2xl font-semibold text-cyan-600">Find your Job</h1>
        <div className="w-full mt-2">
          <form className="grid gap-4 grid-cols-3">
            <input
              type="text"
              name="query"
              placeholder="Search jobs... (e.g., software)"
              className="border border-gray-500 text-xs md:text-base rounded-xs md:rounded-sm py-1 px-2 focus:outline-none md:focus:ring-1"
            />
            <select
              name="type"
              className="border border-gray-500 text-xs md:text-base rounded-xs md:rounded-sm py-1 px-2 focus:outline-none md:focus:ring-1"
            >
              <option value="">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Part time">Part time</option>
              <option value="Full time">Full time</option>
              <option value="Contractual">Contractual</option>
            </select>
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="border border-gray-500 text-xs md:text-base rounded-xs md:rounded-sm py-1 px-2 focus:outline-none md:focus:ring-1"
            />
            <button
              type="submit"
              className="col-span-3 py-0.5 md:py-1 rounded-md bg-cyan-700 text-white cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto bg-white md:mt-4 mt-2 rounded-lg h-fit p-2 md:p-4">
        <h1 className="text-lg md:text-3xl text-center text-cyan-700 md:mb-4 underline">
          Available Jobs
        </h1>
        <div className={`${AvailableJobs.length === 0 ? "flex items-center" : "grid gap-y-4 md:grid-cols-1 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 items-start"} justify-items-center-safe py-4 overflow-y-scroll`}>
          {AvailableJobs.length === 0 &&
            <div className="w-full flex justify-center">
              <h1 className="text-lg md:text-4xl text-orange-500 bg-gray-200 p-4 rounded-lg">No Job Available! Please try again.</h1>
            </div>
          }
          {AvailableJobs.map((job) => (
            <div key={job.id}
              className="w-72 md:w-[380px] md:min-h-[150px] ring-1 ring-cyan-700 rounded-sm md:rounded-lg md:p-2 md:gap-x-4 md:gap-y-2 p-1 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
            >
              <div className="flex px-1.5 pt-1.5 text-orange-500 md:px-0 w-full justify-between">
                <h1 className="font-bold md:text-xl">{job.title}</h1>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-blue-500 underline text-sm md:text-md cursor-pointer hover:text-black"
                >
                  View Details
                </Link>
              </div>

              <h1 className="px-1.5 md:px-0  text-cyan-700 text-sm">{job.company}</h1>

              <div className="flex px-1.5 pt-1.5 md:px-0 w-full justify-between md:mt-4">

                <div className="text-sm md:text-base">
                  <h2 className="">Salary: {job.salary}</h2>
                  <p className="line-clamp-2 text-red-500">
                    {`Type: ${job.type}`}
                  </p>
                </div>
                <div className="text-right text-sm md:text-base">
                  <p className="text-teal-600">Exp: {job.experience}</p>
                  <p className="line-clamp-2 text-gray-600">
                    {job.deadline && `Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TotalJobs;