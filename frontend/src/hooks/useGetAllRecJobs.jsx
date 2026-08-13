import { setAllJobs, setAllRecJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllRecJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllRecJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          dispatch(setAllRecJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllRecJobs();
  }, []);
};

export default useGetAllRecJobs;
