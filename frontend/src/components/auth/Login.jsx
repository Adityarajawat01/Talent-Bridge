import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));

        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(()=> {
    if(user){
      navigate("/");
    }
  },[])

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-2xl bg-white border border-gray-300 rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8">Login Account</h1>

          <div className="space-y-5">
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

                    <Label>Student</Label>
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

                    <Label>Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>
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
              <Button type="submit" className="w-full mt-4 h-11 text-base">
                Log In
              </Button>
            )}

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
