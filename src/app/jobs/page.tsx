import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";

const TotalJobs = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const session = await auth()
  console.log(session)

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
              { description: { contains: querys, mode: "insensitive" } },
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

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-4 bg-white rounded-md">
        <h1 className="text-2xl font-semibold text-cyan-600">Find your Jobs</h1>
        <div className="w-full mt-2">
          <form className="grid gap-4 grid-cols-3">
            <input
              type="text"
              name="query"
              placeholder="Search jobs... (e.g., software)"
              className="border border-gray-500 rounded-sm py-1 px-2 focus:outline-none focus:ring-1"
            />
            <select
              name="type"
              className="border border-gray-500 rounded-sm py-1 px-2 focus:outline-none focus:ring-1"
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
              className="border border-gray-500 rounded-sm py-1 px-2 focus:outline-none focus:ring-1"
            />
            <button
              type="submit"
              className="col-span-3 px-2 py-1 rounded-md bg-cyan-700 text-white cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto bg-white mt-4 rounded-lg h-fit p-4">
        <h1 className="text-3xl text-center text-cyan-700 mb-4 underline">
          Available Jobs
        </h1>
        <div className={`${jobs.length === 0 ? "flex items-center" : "grid gap-y-4 md:grid-cols-1 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 items-start"} justify-items-center-safe py-4 h-[520px] overflow-y-scroll`}>
          {jobs.length === 0 &&
            <div className="w-full flex justify-center">
              <h1 className="text-4xl text-yellow-400 bg-cyan-700 p-4 rounded-lg">No jobs found. Please try again!</h1>
            </div>
          }
          {jobs.map((job) => (
            <div
              key={job.id}
              className="max-w-sm min-w-sm ring-1 ring-cyan-700 rounded-lg p-4 gap-x-4 gap-y-2"
            >
              <div className="flex w-full justify-between">
                <h1 className="font-bold text-xl">{job.title}</h1>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-cyan-800 underline cursor-pointer hover:text-blue-800"
                >
                  View Details
                </Link>
              </div>
              <h1 className="pt-1.5 text-red-600">{job.company}</h1>
              <div className="flex w-full justify-between pt-2">
                <div className="max-w-2/3">
                  <p className="line-clamp-2 text-gray-600">
                    {job.description}
                  </p>
                </div>
                <div className="">
                  <h2 className="text-amber-600">Salary: {job.salary}</h2>
                  <p className="text-teal-600">Exp: {job.experience}</p>
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