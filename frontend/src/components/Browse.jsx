import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();

  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <Navbar />

      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10 text-[#3D2B1F]">
          Search Results{" "}
          <span className="text-[#D96B00]">({allJobs.length})</span>
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {allJobs.map((job) => {
            return(
              <Job key={job._id} job={job} />
            )
            
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
