import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home.jsx";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import JobDescription from "./components/JobDescription";
import Profile from "./components/Profile";
import Companies from "./components/recruiter/Companies";
import CompanyCreate from "./components/recruiter/CompanyCreate";
import CompanySetup from "./components/recruiter/CompanySetup";
import RecJobs from "./components/recruiter/RecJobs";
import PostJob from "./components/recruiter/PostJob";


const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
   {
    path:'/login',
    element:<Login/>
  },
   {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/jobs',
    element:<Jobs/>
  },
  {
    path:'/jobs/description/:id',
    element: <JobDescription/>
  },
  {
    path:'/browse',
    element:<Browse/>
  },
  {
    path:'/profile',
    element:<Profile/>
  },
  
  // recruiter 
  {
    path:'/recruiter/companies',
    element:<Companies/>
  },
  {
    path:'/recruiter/companies/create',
    element:<CompanyCreate/>
  },
   {
    path:'/recruiter/companies/:id',
    element:<CompanySetup/>
  },
   {
    path:'/recruiter/jobs',
    element:<RecJobs />
  },
  {
    path:'/recruiter/jobs/create',
    element:<PostJob />
  },
])

function App() {
  return (
    <>
     <RouterProvider router = {appRouter} />
    </>
  );
}

export default App;
