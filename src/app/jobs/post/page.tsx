"use client";
import { FormEvent } from "react";

const PostYourJob = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      company: formData.get("company"),
      type: formData.get("type"),
      description: formData.get("description"),
      salary: formData.get("salary"),
      location: formData.get("location"),
    };

    try {
      await fetch("/api/job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      window.location.href = "/jobs";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <div className="min-w-md w-xl mx-auto p-4 bg-white rounded-xl">
        <h1 className="text-2xl font-bold text-cyan-700 mb-4">Post a Job</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title
            </label>
            <input
              className="block mt-1 w-full border border-gray-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-700"
              type="text"
              name="title"
              id="title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company
            </label>
            <input
              className="block mt-1 w-full border border-gray-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-700"
              type="text"
              name="company"
              id="company"
              required
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Job Type
            </label>
            <select
              className="block mt-1 w-full border border-gray-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-700"
              name="type"
              id="type"
              required
            >
              <option value="">Select a type</option>
              <option value="Internhip">Internhip</option>
              <option value="Part time">Part time</option>
              <option value="Full time">Full time</option>
              <option value="Contractual">Contractual</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              className="block mt-1 w-full border border-gray-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-700"
              name="description"
              id="description"
              rows={6}
              required
            />
          </div>
          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700"
            >
              Salary <span className="text-gray-700">(optional)</span>
            </label>
            <input
              className="block mt-1 w-full border border-gray-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-700"
              type="text"
              name="salary"
              id="salary"
              placeholder="e.g., $30,000 - $45,000"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              className="block mt-1 w-full border border-gray-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-700"
              type="text"
              name="location"
              id="location"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white outline-0 bg-cyan-700 px-3 py-2 cursor-pointer rounded-full hover:bg-cyan-800 disabled:cursor-not-allowed"
            >
              Create a post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostYourJob;
