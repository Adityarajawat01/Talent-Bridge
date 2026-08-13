import React, { use, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RecJobsTable = () => {
  const {allRecJobs, searchJobByText} = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allRecJobs);
  const navigate = useNavigate();


  useEffect(() => {
    const filteredJobs =
      allRecJobs.length >= 0 &&
      allRecJobs.filter((job) => {
        if (!searchJobByText) {
          return true;
        }
        return job?.title
          ?.toLowercase()
          .includes(searchJobByText.toLowercase()) ||job?.company
          ?.name.toLowercase()
          .includes(searchJobByText.toLowercase())
      });
    setFilterJobs(filteredJobs);
  }, [allRecJobs, searchJobByText]);

  return (
    <div>
      <Table>
        <TableCaption>A list of your posted jobs </TableCaption>
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
            <span>
              No Jobs Registered
            </span> /*agar na chale to ye conditional rendering hata dena */
          ) : (
            <>
              {filterJobs?.map((job) => (
                <tr>
                  <TableCell>{job?.company?.name}</TableCell>
                  <TableCell>{job?.title}</TableCell>
                  <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                  <TableCell className="text-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div
                          onClick={() =>
                            navigate(
                              `/recruiter/companies/${job._id}`,
                            )
                          }
                          className="flex items-center gap-2 w-fit cursor-pointer"
                        >
                          <Edit2 className="w-4" />
                          <span>Edit</span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </tr>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecJobsTable;
