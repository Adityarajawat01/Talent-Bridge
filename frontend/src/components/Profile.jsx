// import React, { useRef, useState } from "react";
// import Navbar from "./shared/Navbar";
// import { Avatar, AvatarImage } from "./ui/avatar";
// import { Button } from "./ui/button";
// import { Contact, Mail, Pen } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { Label } from "./ui/label";
// import AppliedJobTable from "./AppliedJobTable";
// import UpdateProfileDialog from "./UpdateProfileDialog";
// import { useDispatch, useSelector } from "react-redux";
// import defaultProfile from "@/assets/default.png";
// import axios from "axios";
// import { USER_API_END_POINT } from "@/utils/constant";
// import { toast } from "sonner";
// import { setUser } from "@/redux/authSlice";
// import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

// const skills = [
//   "HTML",
//   "CSS",
//   "Javascript",
//   "Node.js",
//   "Express.js",
//   "MongoDB",
// ];
// const isResume = true;

// const Profile = () => {
//   useGetAppliedJobs();
//   const [open, setOpen] = useState(false);
//   const { user } = useSelector((store) => store.auth);
//   const dispatch = useDispatch();

//   const fileInputRef = useRef(null);

//   const handleProfilePhotoChange = async (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     const formData = new FormData();

//     formData.append("profilePhoto", file);

//     try {
//       const res = await axios.post(
//         `${USER_API_END_POINT}/profile/photo`,
//         formData,
//         {
//           withCredentials: true,
//         },
//       );

//       if (res.data.success) {
//         dispatch(setUser(res.data.user));
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="max-w-4xl mx-auto bg-white border-gray-200 rounded-2xl my-5 p-8">
//         <div className="flex justify-between">
//           <div className="flex items-center gap-4">
//             <Avatar
//               className="cursor-pointer"
//               onClick={() => fileInputRef.current.click()}
//             >
//               <AvatarImage
//                 src={user?.profile?.profilePhoto || defaultProfile}
//                 alt="profile photo"
//               />
//             </Avatar>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleProfilePhotoChange}
//             />

//             <div>
//               <h1 className="font-medium text-xl">{user?.fullname}</h1>
//               <p>{user?.bio}</p>
//             </div>
//           </div>
//           <Button
//             onClick={() => setOpen(true)}
//             className="text-right"
//             variant="outline"
//           >
//             <Pen />
//           </Button>
//         </div>
//         <div className="my-5">
//           <div className="flex items-center gap-3 my-3">
//             <Mail />
//             <span>{user?.email}</span>
//           </div>
//           <div className="flex items-center gap-3 my-3">
//             <Contact />
//             <span>{user?.phoneNumber}</span>
//           </div>
//         </div>
//         <div>
//           <h1>{user?.profile?.skills}</h1>
//           <div className="flex items-center gap-1">
//             {user?.profile?.skills.length !== 0 ? (
//               user?.profile?.skills.map((item, index) => (
//                 <Badge key={index}>{item}</Badge>
//               ))
//             ) : (
//               <span>NA</span>
//             )}
//           </div>
//         </div>
//         <div>
//           <Label className="text-md font-bold">Resume</Label>
//           {isResume}{" "}
//           <a
//             className="text-blue-500 w-full hover:underline cursor-pointer"
//             target="_blank"
//             href={user?.profile?.resume}
//           >
//             {user?.profile?.resumeOriginalName}
//           </a>
//         </div>
//       </div>
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl">
//         <h1 className="font-bold text-lg my-5"> Applied jobs</h1>
//         {/*Application table */}
//         <AppliedJobTable />
//       </div>
//       <UpdateProfileDialog open={open} setOpen={setOpen} />
//     </div>
//   );
// };

// export default Profile;



import React, { useRef, useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useDispatch, useSelector } from "react-redux";
import defaultProfile from "@/assets/default.png";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();

  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/photo`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Profile photo upload failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white border border-[#F8CFA8] rounded-2xl my-5 p-8 shadow-sm">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              className="cursor-pointer border-2 border-[#F8CFA8]"
              onClick={() => fileInputRef.current.click()}
            >
              <AvatarImage
                src={user?.profile?.profilePhoto || defaultProfile}
                alt="profile photo"
              />
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePhotoChange}
            />

            <div>
              <h1 className="font-medium text-xl text-[#3D2B1F]">
                {user?.fullname}
              </h1>

              <p className="text-gray-500">
                {user?.bio}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="
              border-[#F28C28]
              text-[#D96B00]
              hover:bg-[#FFF3E0]
              hover:text-[#B45309]
            "
          >
            <Pen />
          </Button>
        </div>

        {/* Contact Details */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-3">
            <Mail className="text-[#D96B00]" />
            <span className="text-gray-700">
              {user?.email}
            </span>
          </div>

          <div className="flex items-center gap-3 my-3">
            <Contact className="text-[#D96B00]" />
            <span className="text-gray-700">
              {user?.phoneNumber}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h1 className="font-semibold text-[#3D2B1F] mb-2">
            Skills
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            {user?.profile?.skills?.length !== 0 ? (
              user?.profile?.skills?.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-[#FFF3E0] text-[#D96B00] border border-[#F8CFA8] hover:bg-[#FFE6C7]"
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">NA</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="mt-6">
          <Label className="text-md font-bold text-[#3D2B1F]">
            Resume
          </Label>

          <div className="mt-2">
            <a
              className="text-[#D96B00] hover:text-[#B45309] hover:underline cursor-pointer"
              target="_blank"
              rel="noreferrer"
              href={user?.profile?.resume}
            >
              {user?.profile?.resumeOriginalName}
            </a>
          </div>
        </div>
      </div>

      {/* Applied Jobs */}
      <div className="max-w-4xl mx-auto bg-white border border-[#F8CFA8] rounded-2xl mb-10 p-5 shadow-sm">
        <h1 className="font-bold text-lg text-center text-[#3D2B1F] mb-5">
          Applied Jobs
        </h1>

        <AppliedJobTable />
      </div>

      <UpdateProfileDialog
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default Profile;