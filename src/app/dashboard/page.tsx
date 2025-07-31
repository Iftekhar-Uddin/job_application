import React from 'react'
import { auth } from '../../../auth'
import { redirect } from 'next/navigation';
import { prisma } from '@/providers/prisma';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const DashboardPage = async () => {
    const session = await auth();

    if(!session){
        redirect("/auth/signin")
    };

    const [applications, postedJobs] = await Promise.all([
        
        prisma.application.findMany({
            where: {
                userId: session?.user?.id
            },
            include: {
                job: {
                    include: {
                        postedBy: true,
                    }
                }
            },
            orderBy: {
                appliedAt: "desc"
            },
        }),

        prisma.job.findMany({
            where: {
                postedById: session.user?.id
            },
            include: {
                _count: {
                    select: {
                        applications: true,
                    }
                }
            },
            orderBy: {
                postedAt: "desc"
            },
        }),

    ]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl flex flex-col mb-2 pt-2">
        <h1 className="text-3xl font-bold text-cyan-700 flex justify-center">
          Dashboard
        </h1>
        <div className="flex justify-around items-center mb-2">
          <h2 className="text-xl text-amber-500  underline">Available Jobs</h2>
          <h2 className="text-xl text-green-600  underline">
            Your Applications
          </h2>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Posted Jobs Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-300">
            {postedJobs.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">
                You haven't posted any jobs yet.
              </p>
            ) : (
              postedJobs.map((job) => (
                <div key={job.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-emerald-600 mb-2">{job.company}</p>
                      <div className="flex items-center text-sm">
                        <span className="text-blue-700">{job.location}</span>
                        <span className="mx-2">•</span>
                        <span className="text-red-600">{job.type}</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray">
                          {formatDistanceToNow(new Date(job.postedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-600">
                        {job._count.applications} applications
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Applications Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {applications.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">
                You haven't applied to any jobs yet.
              </p>
            ) : (
              applications.map((application) => (
                <div key={application.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-cyan-700 mb-1">
                        {application.job.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {application.job.company}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{application.job.location}</span>
                        <span className="mx-2">•</span>
                        <span>{application.job.type}</span>
                        <span className="mx-2">•</span>
                        <span>
                          Applied{" "}
                          {formatDistanceToNow(
                            new Date(application.appliedAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : application.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/jobs/${application.job.id}`}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default DashboardPage