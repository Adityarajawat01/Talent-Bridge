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
import Applicants from "./components/recruiter/Applicants";
import ProtectedRoute from "./components/recruiter/ProtectedRoute";


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
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:'/recruiter/companies/create',
    element:  <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
   {
    path:'/recruiter/companies/:id',
    element: <ProtectedRoute><CompanySetup/></ProtectedRoute>  
  },
   {
    path:'/recruiter/jobs',
    element: <ProtectedRoute><RecJobs/></ProtectedRoute> 
  },
  {
    path:'/recruiter/jobs/create',
    element: <ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:'/recruiter/jobs/:id/applicants',
    element: <ProtectedRoute><Applicants/></ProtectedRoute> 
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
