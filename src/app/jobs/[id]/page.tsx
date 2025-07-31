import GoogleLocation from "@/components/GoogleLocation";
import { prisma } from "@/providers/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPriority } from "os";
import React from "react";
import ApplyButton from "./ApplyButton";

const jobDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const jobId = (await params).id;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { postedBy: true },
  });


  if (!job) {
    notFound();
  }

  return (
    <div className="bg-white max-w-7xl mx-auto h-fit rounded-md ">
      <div className="p-6 grid grid-rows-1 gap-y-8 w-full">
        <div className="flex justify-between">
          <Link
            href={"/jobs"}
            className="cursor-pointer text-lg text-cyan-800 underline"
          >
            Goto Back
          </Link>
          <h2 className="text-red-400 text-lg">DeadLine: 21/12/2025</h2>
        </div>

        <div className="flex w-full">
          <div className="flex flex-col w-3/5">
            <h1 className="text-2xl font-semibold text-orange-500">
              {job.title}
            </h1>
            <div className="flex justify-between pt-4">
              <div className="space-y-2">
                <p className="font-bold">
                  <span>Type: </span>
                  {job.type}
                </p>
                <p className="font-semibold text-teal-600 text-lg">
                  <span>Salary: </span>
                  {job.salary}
                </p>
                <p className="font-semibold text-blue-700 text-lg">
                  <span>Experience: </span>
                  Null
                </p>
              </div>
              <div className="space-y-2 w-1/2">
                <p className="font-semibold">
                  <span className="">Company: </span>
                  {job.company}
                </p>
                <p className="font-semibold">
                  <span>Location: </span>
                  {job.location}
                </p>
                <p className="text-[min(10vw, 120px)] text-gray-600 ">
                  <span className="underline ">Requirements:</span>
                  &nbsp;Next.js, React.Js, Node.js, JavaScript, TypeScript,
                  Tailwind Css
                </p>
              </div>
            </div>
          </div>

          <div className="w-2/5 flex justify-end">
            <div className="">
              {job.postedBy.image && (
                <Image
                  className="size-32"
                  src={job.postedBy.image}
                  height={650}
                  width={366}
                  alt=""
                  priority={!!getPriority}
                />
              )}
              <p className="text-gray-500">
                <span className="">PostedBy: </span>
                {job.postedBy.name}
              </p>
            </div>
          </div>
        </div>

        <p className="pt-4 text-lg text-gray-600 grid-cols-1 grid">
          <span className="text-black font-semibold">Description: </span>
          {job.description}
        </p>

        <div className="flex justify-end">
          <ApplyButton jobId={job.id}/>
        </div>
      </div>
      {/* <GoogleLocation/> */}
    </div>
  );
};

export default jobDetails;
