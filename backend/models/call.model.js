import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ringing", "accepted", "rejected", "ended"],
      default: "ringing",
    },
  },
  { timestamps: true },
);

export const Call = mongoose.model("Call", callSchema);
