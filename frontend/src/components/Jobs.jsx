import { useMemo } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const salaryRanges = {
  "0-3 lpa": (salary) => salary >= 0 && salary <= 3,
  "3-5 lpa": (salary) => salary > 3 && salary <= 5,
  "5-8 lpa": (salary) => salary > 5 && salary <= 8,
  "8-12 lpa": (salary) => salary > 8 && salary <= 12,
  "12-20 lpa": (salary) => salary > 12 && salary <= 20,
  "20+ lpa": (salary) => salary > 20,
};

const industryKeywords = {
  "frontend developer": ["frontend", "front end", "react", "javascript", "html", "css"],
  "backend developer": ["backend", "back end", "node", "express", "api", "server"],
  "mern developer": ["mern", "mongodb", "mongo", "express", "react", "node"],
  "data scientist": ["data scientist", "data science", "python", "machine learning", "ml"],
  "ai engineer": ["ai", "artificial intelligence", "machine learning", "ml", "python"],
};

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  const filterJobs = useMemo(() => {
    if (!searchedQuery) {
      return allJobs;
    }

    const query = searchedQuery.toLowerCase().trim();
    const salaryMatcher = salaryRanges[query];
    const keywords = industryKeywords[query] || [query];

    return allJobs.filter((job) => {
      if (salaryMatcher) {
        return salaryMatcher(Number(job?.salary));
      }

      const searchableText = [
        job?.title,
        job?.description,
        job?.location,
        job?.jobType,
        job?.company?.name,
        ...(job?.requirements || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return keywords.some((keyword) => searchableText.includes(keyword));
    });
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">

          {/* Filter */}
          <div className="w-[20%]">
            <FilterCard />
          </div>

          {/* Jobs */}
          {filterJobs.length <= 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                Job not found
              </span>
            </div>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">

              <div className="grid grid-cols-3 gap-4">

                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Jobs;
