"use client";

// import query from "@/components/query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ApplyButton = ({ jobId }: { jobId: string }) => {
  const { data: session, status } = useSession();
  const [find, setFind] = useState();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [applicationStatus, setApplicationStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/job/${jobId}/find`, {
          method: "GET",
        });
        const result = await res.json();
        setFind(result)
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, []);

  const handleApply = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setErrorMessage("");
    setApplicationStatus("idle");

    try {
      const response = await fetch(`/api/job/${jobId}/apply`, {
        method: "POST",
      });
      const result = await response.json();
      if (result.status === 400) {
        setApplicationStatus("error");
      } else {
        setApplicationStatus("success");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to apply for the job");
      }
      setApplicationStatus("error");
    }
  };

  if (status === "loading") {
    return <button disabled>Loading...</button>;
  }

  if (applicationStatus === "success") {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-green-600">Applied Successfully</p>
        <Link className="px-3 py-1 text-amber-500 ring-1 rounded-full hover:bg-blue-100 hover:text-blue-500" href={"/dashboard"}>
          {"View your applicaton"}
        </Link>
      </div>
    );
  }

  if (find) {
    return <p className="ring-1 text-green-400 px-2.5 py-1 rounded-full bg-black">Already Applied</p>;
  } else {
    return (
      <div className="flex items-center gap-x-4">
        {applicationStatus === "error" && (
          <p className="text-lime-600 font-semibold">Already Applied</p>
        )}
        <button className="py-1.5 px-6 bg-cyan-700 text-white rounded-full cursor-pointer" onClick={handleApply}> Apply </button>
      </div>
    );
  }
};

export default ApplyButton;
