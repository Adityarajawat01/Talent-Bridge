import { application } from "express";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js"

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId, // Sirf yahi change kiya hai
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created Successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query).populate({ path:"company"}).sort({ createdAt: -1}); // important
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found.",
        success: false,
      });
    }
    return res.status(201).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path:"applications"
    });
    if (!job) {
      return res.status(404).json({
        message: "jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


//recruiter kitne job create kara hai 
export const getRecruiterJobs = async (req, res) => {
    try {
        const recruiterId = req.id;
        const jobs = await Job.find({created_by: recruiterId}).populate({
          path:"company",
          createdAt:-1
        });
         if (!jobs) {
      return res.status(404).json({
        message: "jobs not found.",
        success: false,
      });
    }
    return res.status(201).json({
      jobs,
      success: true,
    });
    } catch (error) {
        console.log(error)
    }
}