import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div className="border border-[#F8CFA8] rounded-md overflow-hidden bg-white shadow-sm">
      <Table>
        <TableCaption className="caption-top text-center text-lg font-semibold text-[#3D2B1F] mb-3">
          List of your applied jobs
        </TableCaption>

        <TableHeader className="bg-[#FFF3E0]">
          <TableRow className="border-b-[#F8CFA8]">
            <TableHead className="font-bold text-[#3D2B1F]">
              Date
            </TableHead>

            <TableHead className="font-bold text-[#3D2B1F]">
              Job Role
            </TableHead>

            <TableHead className="font-bold text-[#3D2B1F]">
              Company
            </TableHead>

            <TableHead className="text-right font-bold text-[#3D2B1F]">
              Status
            </TableHead>

            <TableHead className="text-right font-bold text-[#3D2B1F]">
              Chat
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-gray-500 py-8"
              >
                You haven't applied for any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => {
              return (
                <TableRow
                  key={appliedJob?._id}
                  className="border-b-[#F8CFA8] hover:bg-[#FFF8F5]"
                >
                  <TableCell>
                    {appliedJob?.createdAt?.split("T")[0]}
                  </TableCell>

                  <TableCell className="font-medium text-[#3D2B1F]">
                    {appliedJob?.job?.title}
                  </TableCell>

                  <TableCell>
                    {appliedJob?.job?.company?.name}
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      className={`${
                        appliedJob?.status === "rejected"
                          ? "bg-red-400 hover:bg-red-500"
                          : appliedJob?.status === "pending"
                          ? "bg-gray-400 hover:bg-gray-500"
                          : "bg-green-400 hover:bg-green-500"
                      } text-white`}
                    >
                      {appliedJob?.status?.toUpperCase()}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    {appliedJob?.status === "accepted" ? (
                      <Link to={`/chat/${appliedJob?._id}`}>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-[#F8CFA8]"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-400">Locked</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
