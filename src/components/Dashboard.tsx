"use client"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useState } from "react"

type DashboardProps = {
  postedJobs: any;
  applications: any;
};


const Dashboard = ({ postedJobs, applications }: DashboardProps) => {

  const [isPostedJob, setIsPostedJob] = useState(true);
  const [isapplications, setIsapplications] = useState(false);


  const handleAvailableJobs = () => {
    setIsPostedJob(!isPostedJob);
    setIsapplications(!isapplications);
  };

  const handleApplications = () => {
    setIsapplications(!isapplications);
    setIsPostedJob(!isPostedJob);
  };

  return (
    <div className="max-w-7xl mx-auto rounded-md sm:px-6 lg:px-0 h-[calc(100vh-10rem)]">
      <div className="bg-white rounded-lg flex flex-col mb-3 pt-1 font-sans">
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold text-cyan-700 flex justify-center">
          Dashboard
        </h1>
        <div className="flex justify-around items-center pb-2">
          <button onClick={handleAvailableJobs} className={`${isPostedJob ? "underline" : ""}    md:text-xl text-amber-600 text-sm md:underline`}>Available Jobs</button>
          <button onClick={handleApplications} className={`${isapplications ? "underline" : ""}  md:text-xl text-green-600 text-sm  md:underline`}>Your Applications</button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">

        {/* Posted Jobs Section */}
        
        <div className='bg-white rounded-md md:rounded-lg shadow-sm md:px-2'>
          <div className="h-fit divide-y divide-gray-300 overflow-y-scroll">
            {postedJobs?.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">
                You haven't posted any jobs yet.
              </p>
            ) : (
              postedJobs?.map((job: any) => (
                <div key={job.id} className= {`${isPostedJob ? "block" : "hidden"} md:p-4 p-3 md:block`}>
                  <div className="flex justify-between items-start md:gap-x-4">
                    <div>
                      <h3 className="md:text-lg md:mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm md:text-base text-emerald-600 md:mb-2">{job.company}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-1 rounded-full text-xs text-white bg-black ring-1">
                        {job._count.applications} applications
                      </span>
                    </div>
                  </div>
                  <div className="md:flex md:items-center text-sm md:text-base md:gap-x-2 mt-2 md:mt-0">
                    <span className="text-orange-500">{job.type}</span>
                    <span className="mx-2">•</span>
                    <span className="text-blue-400">{job.location}</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(job.postedAt), {
                        addSuffix: true,
                      })}
                    </span>
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


        <div className='bg-white rounded-lg shadow-sm md:px-2'>
          <div className="h-full divide-y divide-gray-300 overflow-y-scroll ">
            {applications?.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">
                You haven't applied to any jobs yet.
              </p>
            ) : (
              applications?.map((application: any) => (
                <div key={application?.id} className={`${isapplications ? "block" : "hidden"} md:p-4 p-3 md:block`}>

                  <div className="flex justify-between items-start md:gap-x-4">
                    <div>
                      <h3 className="md:text-lg md:mb-1">
                        {application?.job?.title}
                      </h3>
                      <p className="text-sm md:text-base text-emerald-600 md:mb-2">{application?.job?.company}</p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application?.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : application.status === "ACCEPTED"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {application?.status}
                      </span>
                    </div>
                  </div>

                  <div className="md:flex md:items-center text-sm md:text-base md:gap-x-2 mt-2 md:mt-0 text-gray-600">
                    <span>{application?.job?.location}</span>
                    <span className="mx-2">•</span>
                    <span>{application?.job?.type}</span>
                    <span className="mx-2">•</span>
                    <span>
                      Applied{" "}
                      {formatDistanceToNow(
                        new Date(application?.appliedAt),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-end space-x-4">
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
  )
}

export default Dashboard

{/* <div className='bg-white rounded-lg shadow-sm px-2 h-[calc(100vh-12rem)]'> */ }