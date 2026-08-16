import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const category = [
  "Software Development",
  "Data & AI",
  "Design",
  "Marketing",
  "Finance",
  "Sales",
  "HR & Recruitment",
  "Customer Support",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="py-10 bg-white">
      {/* Heading */}
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider">
          Explore Opportunities
        </p>

        <h2 className="text-3xl font-bold text-[#111827] mt-2">
          Explore Jobs by Category
        </h2>

        <p className="text-gray-500 mt-2">
          Find the perfect role that matches your skills and interests.
        </p>
      </div>

      {/* Carousel */}
      <Carousel className="w-full max-w-5xl mx-auto px-12">
        <CarouselContent>
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="basis-auto md:basis-1/3 lg:basis-1/4"
            >
              <button
                onClick={() => searchJobHandler(cat)}
                className="
                  w-full
                  px-6 py-3
                  rounded-full
                  border border-orange-100
                  bg-orange-50
                  text-[#EA580C]
                  font-medium
                  whitespace-nowrap
                  transition-all duration-200
                  hover:bg-[#F97316]
                  hover:text-white
                  hover:border-[#F97316]
                  hover:shadow-md
                "
              >
                {cat}
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="
            border-orange-200
            text-[#EA580C]
            hover:bg-orange-50
            hover:text-[#EA580C]
          "
        />

        <CarouselNext
          className="
            border-orange-200
            text-[#EA580C]
            hover:bg-orange-50
            hover:text-[#EA580C]
          "
        />
      </Carousel>
    </section>
  );
};

export default CategoryCarousel;