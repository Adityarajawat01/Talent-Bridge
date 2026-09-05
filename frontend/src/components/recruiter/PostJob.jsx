import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "../shared/Navbar";

const initialInput = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  jobType: "",
  experience: "",
  position: "",
  companyId: "",
};

const PostJob = () => {
  useGetAllCompanies();

  const navigate = useNavigate();
  const params = useParams();
  const isEditMode = Boolean(params.id);
  const [input, setInput] = useState(initialInput);
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const selectChangeHandler = (value) => {
    setInput({
      ...input,
      companyId: value,
    });
  };

  useEffect(() => {
    if (!isEditMode) return;

    const fetchJob = async () => {
      try {
        setFetchingJob(true);

        const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const job = res.data.job;
          const companyId =
            typeof job?.company === "object" ? job?.company?._id : job?.company;

          setInput({
            title: job?.title || "",
            description: job?.description || "",
            requirements: Array.isArray(job?.requirements)
              ? job.requirements.join(", ")
              : job?.requirements || "",
            salary: job?.salary || "",
            location: job?.location || "",
            jobType: job?.jobType || "",
            experience: job?.experienceLevel || "",
            position: job?.position || "",
            companyId: companyId || "",
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Unable to fetch job");
        navigate("/recruiter/jobs");
      } finally {
        setFetchingJob(false);
      }
    };

    fetchJob();
  }, [isEditMode, navigate, params.id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const requestConfig = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const res = isEditMode
        ? await axios.put(
            `${JOB_API_END_POINT}/update/${params.id}`,
            input,
            requestConfig,
          )
        : await axios.post(
            `${JOB_API_END_POINT}/post`,
            input,
            requestConfig,
          );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/recruiter/jobs");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-xl border border-gray-200 shadow-lg rounded-md"
        >
          <h1 className="font-bold text-xl mb-5">
            {isEditMode ? "Edit Job" : "Create Job"}
          </h1>

          <div className="grid grid-cols-2 gap-2">
            
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>JobType</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>No of Position</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {companies.length > 0 && (
              <Select
                value={input.companyId}
                onValueChange={selectChangeHandler}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {companies.map((company) => (
                      <SelectItem
                        key={company._id}
                        value={company._id}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {loading ? (
            <Button
              type="button"
              className="w-full mt-4 h-11 text-base"
              disabled
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-4 h-11 text-base"
              disabled={fetchingJob}
            >
              {fetchingJob
                ? "Loading job..."
                : isEditMode
                  ? "Update Job"
                  : "Post New Job"}
            </Button>
          )}

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first, then register jobs
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
