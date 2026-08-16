import React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import JobDescription from "./JobDescription";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;

    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-[#F8CFA8]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) == 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}{" "}
        </p>

        <Button
          variant="outline"
          className="
            rounded-full
            border-[#F8CFA8]
            text-[#D96B00]
            hover:bg-[#FFF3E0]
            hover:text-[#B45309]
            hover:border-[#F28C28]
          "
          size="icon"
        >
          <Bookmark />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button
          className="
            p-6
            border-[#F8CFA8]
            hover:bg-[#FFF3E0]
            hover:border-[#F28C28]
          "
          variant="outline"
          size="icon"
        >
          <Avatar>
            <AvatarImage
              src={job?.company?.logo}
              alt="jobImage"
            />
          </Avatar>
        </Button>

        <div>
          <h1 className="text-xl font-medium text-[#3D2B1F]">
            {job?.company?.name}
          </h1>

          <p className="font-light text-sm text-gray-500">
            {job?.location}
          </p>
        </div>
      </div>

      <div>
        <h1 className="font-medium text-[#3D2B1F]">
          {job?.title}
        </h1>

        <p className="text-sm text-gray-600 mt-1">
          {job?.description}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-6">
        <Badge
          variant="ghost"
          className="text-blue-700 font-bold"
        >
          {job?.position} Positions
        </Badge>

        <Badge
          variant="ghost"
          className="text-[#F83002] font-bold"
        >
          {job?.jobType}
        </Badge>

        <Badge
          variant="ghost"
          className="text-[#7209b7] font-bold"
        >
          {job?.salary}LPA
        </Badge>
      </div>

      <div className="flex items-center gap-10 mt-2">
        <Button
          onClick={() =>
            navigate(`/jobs/description/${job?._id}`)
          }
          variant="outline"
          className="
            border-[#F28C28]
            text-[#D96B00]
            hover:bg-[#FFF3E0]
            hover:text-[#B45309]
            hover:border-[#D96B00]
          "
        >
          Details
        </Button>

        <Button className="bg-[#7209b7] hover:bg-[#5B078F]">
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;