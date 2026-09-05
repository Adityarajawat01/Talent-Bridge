import { Application } from "../models/application.model.js";

export const getAcceptedApplicationForUser = async (applicationId, userId) => {
  const application = await Application.findOne({
    _id: applicationId,
    status: "accepted",
  })
    .populate("applicant", "fullname email phoneNumber profile role")
    .populate({
      path: "job",
      populate: [
        { path: "company" },
        { path: "created_by", select: "fullname email phoneNumber profile role" },
      ],
    });

  if (!application || !application.job) return null;

  const studentId = application.applicant?._id?.toString();
  const recruiterId = application.job.created_by?._id?.toString();

  if (studentId !== userId && recruiterId !== userId) return null;

  return application;
};
