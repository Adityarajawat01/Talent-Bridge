import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

    const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally{
      dispatch(setLoading(false));
    }
  };

   useEffect(()=> {
      if(user){
        navigate("/");
      }
    },[])
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-2xl bg-white border border-gray-300 rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8">
            Create Account
          </h1>

          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">Full Name</Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="Aditya Singh"
              />
            </div>

            <div>
              <Label className="mb-2 block">Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="xyz@gmail.com"
              />
            </div>

            <div>
              <Label className="mb-2 block">Phone Number</Label>
              <Input
                type="tel"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="9876543210"
              />
            </div>

            <div>
              <Label className="mb-2 block">Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="********"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <Label className="mb-2 block">Role</Label>

                <RadioGroup className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      name="role"
                      value="student"
                      checked={input.role === "student"}
                      onChange={changeEventHandler}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <Label htmlFor="r1">Student</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      name="role"
                      value="recruiter"
                      checked={input.role === "recruiter"}
                      onChange={changeEventHandler}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <Label htmlFor="r2">Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="w-full md:w-1/2">
                <Label className="mb-2 block">Profile Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {loading ? (
              <Button className="w-full mt-4 h-11 text-base">
                <Loader2 className="mr=2 h-4 e-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full mt-4 h-11 text-base">
                Sign Up
              </Button>
            )}


            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
