import { Call } from "../models/call.model.js";
import { Application } from "../models/application.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Job } from "../models/job.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getApplicationRoom } from "../socket/socket.js";
import { getAcceptedApplicationForUser } from "../utils/chatAccess.js";
import cloudinary from "../utils/cloudinary.js";
import getDatauri from "../utils/datauri.js";

const findOrCreateConversation = async (application) => {
  const studentId = application.applicant._id;
  const recruiterId = application.job.created_by._id;

  return Conversation.findOneAndUpdate(
    { application: application._id },
    {
      $setOnInsert: {
        application: application._id,
        job: application.job._id,
        student: studentId,
        recruiter: recruiterId,
      },
    },
    { returnDocument: "after", upsert: true },
  );
};

const getContactPayload = async (application, currentUserId) => {
  const conversation = await findOrCreateConversation(application);
  const isStudent = application.applicant._id.toString() === currentUserId;
  const contactUser = isStudent ? application.job.created_by : application.applicant;
  const activeCall = await Call.findOne({
    application: application._id,
    status: "ringing",
  }).sort({ createdAt: -1 });

  return {
    applicationId: application._id,
    conversationId: conversation._id,
    jobId: application.job._id,
    jobTitle: application.job.title,
    company: application.job.company,
    lastMessage: conversation.lastMessage,
    lastMessageAt: conversation.lastMessageAt,
    contact: contactUser,
    activeCall,
  };
};

export const getChatContacts = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    let applications = [];

    if (user.role === "student") {
      applications = await Application.find({
        applicant: userId,
        status: "accepted",
      })
        .sort({ updatedAt: -1 })
        .populate("applicant", "fullname email phoneNumber profile role")
        .populate({
          path: "job",
          populate: [
            { path: "company" },
            { path: "created_by", select: "fullname email phoneNumber profile role" },
          ],
        });
    } else {
      const recruiterJobs = await Job.find({ created_by: userId }).select("_id");
      const recruiterJobIds = recruiterJobs.map((job) => job._id);

      applications = await Application.find({
        job: { $in: recruiterJobIds },
        status: "accepted",
      })
        .sort({ updatedAt: -1 })
        .populate("applicant", "fullname email phoneNumber profile role")
        .populate({
          path: "job",
          populate: [
            { path: "company" },
            { path: "created_by", select: "fullname email phoneNumber profile role" },
          ],
        });
    }

    const contacts = await Promise.all(
      applications
        .filter((application) => application.job)
        .map((application) => getContactPayload(application, userId)),
    );

    return res.status(200).json({
      contacts,
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

export const getMessages = async (req, res) => {
  try {
    const application = await getAcceptedApplicationForUser(
      req.params.applicationId,
      req.id,
    );

    if (!application) {
      return res.status(403).json({
        message: "Chat is available only for accepted applications",
        success: false,
      });
    }

    const conversation = await findOrCreateConversation(application);
    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .populate("sender", "fullname profile role");

    return res.status(200).json({
      conversation,
      messages,
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

export const sendMessage = async (req, res) => {
  try {
    const application = await getAcceptedApplicationForUser(
      req.params.applicationId,
      req.id,
    );

    if (!application) {
      return res.status(403).json({
        message: "Chat is available only for accepted applications",
        success: false,
      });
    }

    const conversation = await findOrCreateConversation(application);
    const text = req.body.text?.trim() || "";
    let mediaUrl = "";
    let type = "text";

    if (req.file) {
      const fileUri = getDatauri(req.file);
      const upload = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto",
        folder: "talentbridge/messages",
      });

      mediaUrl = upload.secure_url;
      type = req.file.mimetype.startsWith("video/") ? "video" : "image";
    }

    if (!text && !mediaUrl) {
      return res.status(400).json({
        message: "Message or media is required",
        success: false,
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.id,
      type,
      text,
      mediaUrl,
    });

    conversation.lastMessage =
      text || (type === "video" ? "Video message" : "Image message");
    conversation.lastMessageAt = new Date();
    await conversation.save();

    await message.populate("sender", "fullname profile role");
    req.app.get("io")?.to(getApplicationRoom(application._id)).emit("message:new", {
      applicationId: application._id,
      message,
    });

    return res.status(201).json({
      message,
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

export const startCall = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    const application = await getAcceptedApplicationForUser(
      req.params.applicationId,
      req.id,
    );

    if (!application || user?.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can start calls with accepted students",
        success: false,
      });
    }

    const conversation = await findOrCreateConversation(application);
    const roomName = `talentbridge-${conversation._id}-${Date.now()}`;
    const call = await Call.create({
      conversation: conversation._id,
      application: application._id,
      caller: req.id,
      receiver: application.applicant._id,
      roomUrl: `https://meet.jit.si/${roomName}`,
      status: "ringing",
    });
    req.app.get("io")?.to(getApplicationRoom(application._id)).emit("call:incoming", {
      applicationId: application._id,
      call,
    });

    return res.status(201).json({
      call,
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

export const respondCall = async (req, res) => {
  try {
    const { status } = req.body;
    const call = await Call.findById(req.params.callId).populate("application");
    const user = await User.findById(req.id);

    if (!call || user?.role !== "student" || call.receiver.toString() !== req.id) {
      return res.status(403).json({
        message: "Only the invited student can respond to this call",
        success: false,
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Valid call status is required",
        success: false,
      });
    }

    call.status = status;
    await call.save();
    req.app.get("io")?.to(getApplicationRoom(call.application._id)).emit(
      status === "accepted" ? "call:accepted" : "call:rejected",
      {
        applicationId: call.application._id,
        call,
      },
    );

    return res.status(200).json({
      call,
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

export const blockContact = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    const application = await getAcceptedApplicationForUser(
      req.params.applicationId,
      req.id,
    );

    if (!application || user?.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can block accepted students",
        success: false,
      });
    }

    application.status = "rejected";
    await application.save();

    await Call.updateMany(
      { application: application._id, status: "ringing" },
      { status: "ended" },
    );

    return res.status(200).json({
      message: "Student blocked and application rejected",
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

export const endCall = async (req, res) => {
  try {
    const call = await Call.findById(req.params.callId);

    if (!call) {
      return res.status(404).json({
        message: "Call not found",
        success: false,
      });
    }

    const application = await getAcceptedApplicationForUser(
      call.application.toString(),
      req.id,
    );

    if (!application) {
      return res.status(403).json({
        message: "Call access denied",
        success: false,
      });
    }

    call.status = "ended";
    await call.save();

    req.app.get("io")?.to(getApplicationRoom(application._id)).emit("call:ended", {
      applicationId: application._id,
      call,
    });

    return res.status(200).json({
      call,
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
