import { useEffect, useMemo } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { calculateSkillMatch } from "@/lib/skillMatch";

const Browse = () => {
  useGetAllJobs();

  const { allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const sortedJobs = useMemo(() => {
    const userSkills = user?.profile?.skills || [];

    return [...allJobs]
      .map((job) => ({
        ...job,
        skillMatch: calculateSkillMatch(userSkills, job?.requirements),
      }))
      .sort((a, b) => b.skillMatch.percentage - a.skillMatch.percentage);
  }, [allJobs, user?.profile?.skills]);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <Navbar />

      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10 text-[#3D2B1F]">
          Search Results{" "}
          <span className="text-[#D96B00]">({sortedJobs.length})</span>
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {sortedJobs.map((job) => {
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
