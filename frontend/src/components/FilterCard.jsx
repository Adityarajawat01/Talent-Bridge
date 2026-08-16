import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useDispatch } from "react-redux";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Delhi",
      "Bengaluru",
      "Hyderabad",
      "Pune",
      "Indore",
      "Noida",
      "Gurugram",
      "Lucknow",
    ],
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "MERN Developer",
      "Data Scientist",
      "AI Engineer",
    ],
  },
  {
    filterType: "Salary",
    array: [
      "0-3 LPA",
      "3-5 LPA",
      "5-8 LPA",
      "8-12 LPA",
      "12-20 LPA",
      "20+ LPA",
    ],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-amber-400 p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>

      <hr className="mt-3" />

      <RadioGroup
        value={selectedValue}
        onValueChange={changeHandler}
      >
        {filterData.map((data, index) => (
          <div key={data.filterType}>
            <h2 className="font-bold text-lg">
              {data.filterType}
            </h2>

            {data.array.map((item, idx) => {
              const itemId = `r${index}-${idx}`;

              return (
                <div
                  key={itemId}
                  className="flex items-center space-x-2 my-2"
                >
                  <RadioGroupItem
                    value={item}
                    id={itemId}
                  />

                  <Label htmlFor={itemId}>
                    {item}
                  </Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;