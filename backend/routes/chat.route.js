import express from "express";
import {
  blockContact,
  endCall,
  getChatContacts,
  getMessages,
  respondCall,
  sendMessage,
  startCall,
} from "../controllers/chat.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/contacts").get(isAuthenticated, getChatContacts);
router
  .route("/:applicationId/messages")
  .get(isAuthenticated, getMessages)
  .post(isAuthenticated, singleUpload, sendMessage);
router.route("/:applicationId/call").post(isAuthenticated, startCall);
router.route("/calls/:callId/respond").post(isAuthenticated, respondCall);
router.route("/calls/:callId/end").post(isAuthenticated, endCall);
router.route("/:applicationId/block").post(isAuthenticated, blockContact);

export default router;
