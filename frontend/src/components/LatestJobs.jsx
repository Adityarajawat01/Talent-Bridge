
import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <section className="max-w-7xl mx-auto px-4 my-20">

      {/* Heading */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider">
          Fresh Opportunities
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">
          Latest & Top{" "}
          <span className="text-[#F97316]">
            Job Openings
          </span>
        </h1>

        <p className="text-gray-500 mt-2">
          Explore the latest opportunities from top companies.
        </p>
      </div>

      {/* Jobs */}
      {allJobs.length <= 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No jobs available right now.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Please check back later for new opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allJobs.slice(0, 6).map((job) => (
            <LatestJobCards
              key={job._id}
              job={job}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default LatestJobs;