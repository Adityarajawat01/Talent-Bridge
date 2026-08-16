import { Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="bg-[#FFFBF5] min-h-[500px] flex items-center justify-center px-4">
      <div className="text-center max-w-4xl w-full">

        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-[#EA580C] text-sm font-semibold">
            ✨ Your Career Starts Here
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#111827]">
          Find Your Next
          <br />
          <span className="text-[#F97316]">Dream Job</span>
        </h1>

        {/* Description */}
        <p className="mt-5 text-gray-500 text-lg max-w-2xl mx-auto">
          Discover the right opportunity to build the career you deserve.
          Find jobs that match your skills, passion and career goals.
        </p>

        {/* Search */}
        <div className="mt-8 flex w-full max-w-2xl mx-auto bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-orange-100 p-1.5">
          
          <div className="flex items-center flex-1 px-4 gap-3">
            <Search className="w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search job title, skills or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchJobHandler();
                }
              }}
              className="outline-none border-none w-full text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <Button
            onClick={searchJobHandler}
            className="rounded-full bg-[#F97316] hover:bg-[#EA580C] px-7"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>

        {/* Popular Searches */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2 text-sm">
          <span className="text-gray-400 mr-1">
            Popular:
          </span>

          {["Frontend Developer", "MERN Stack", "Backend Developer", "UI/UX"].map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  dispatch(setSearchedQuery(item));
                  navigate("/browse");
                }}
                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-[#EA580C] hover:bg-orange-50 transition"
              >
                {item}
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default HeroSection;