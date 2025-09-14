import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const recentJobs = await prisma.job.findMany({
    take: 3,
    orderBy: {
      postedAt: "desc",
    },
    include: {
      postedBy: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto md:space-y-12 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center py-4 md:py-16 bg-white rounded-sm md:rounded-lg shadow-sm">
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold text-cyan-600 mb-2 md:mb-4">
          Find Your Dream Job
        </h1>
        <p className="md:text-xl text-gray-600 mb-4 md:mb-8">
          Discover thousands of job opportunities with top companies
        </p>
        <Link
          href="/jobs"
          className="bg-gray-700 text-white px-3 md:px-6 py-1.5 md:py-3 rounded-sm md:rounded-md text-sm md:text-lg font-medium hover:bg-black"
        >
          Browse Jobs
        </Link>
      </section>

      {/* Recent Jobs Section */}
      <section>
        <div className="grid gap-2 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mt-2 md:mt-4">
          {recentJobs.map((job) => (
            <div
              // href={`/jobs/${job.id}`}
              key={job.id}
              className="bg-white p-3 md:p-6 rounded-sm md:rounded-lg shadow-sm hover:shadow-md md:disabled transition-shadow"
            >
              <h3 className="md:text-xl font-semibold text-orange-500">
                {job.title}
              </h3>
              <p className="text-emerald-600 md:mb-2 text-xs">{job.company}</p>
              <div className="flex justify-between text-sm md:text-base my-2 md:min-h-12">
                <span className="mr-4 text-cyan-800">{job.location}</span>
                <span className="text-red-400">{job.type}</span>
              </div>
              <p className="text-gray-600 text-sm md:text-base md:mb-4 line-clamp-2">
                {job?.responsibilities}
              </p>
              <Link href={`/jobs/${job.id}`}
                className="text-gray-700 text-sm md:text-base flex justify-end hover:text-blue-500 font-medium mt-2"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-2 md:mt-8">
          <Link
            href="/jobs"
            className="text-white md:text-xl hover:text-black font-medium"
          >
            View All Jobs →
          </Link>
        </div>
      </section>
    </div>
  );
}
