import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RecJobsTable = () => {
  const { allRecJobs = [], searchJobByText = "" } = useSelector(
    (store) => store.job,
  );

  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allRecJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }

      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );
    });

    setFilterJobs(filteredJobs);
  }, [allRecJobs, searchJobByText]);

  return (
    <div>
      <Table>
        <TableCaption>A list of your posted jobs</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No Jobs Registered
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job?._id}>
                <TableCell>{job?.company?.name}</TableCell>

                <TableCell>{job?.title}</TableCell>

                <TableCell>{job?.createdAt?.split("T")[0]}</TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="cursor-pointer">
                        <MoreHorizontal />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-40">
                      <div
                        onClick={() =>
                          navigate(`/recruiter/companies/${job?._id}`)
                        }
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>

                      <div
                        onClick={() =>
                          navigate(`/recruiter/jobs/${job?._id}/applicants`)
                        }
                        className="flex items-center gap-2 cursor-pointer mt-3"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecJobsTable;
