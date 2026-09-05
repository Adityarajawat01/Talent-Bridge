import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { getAcceptedApplicationForUser } from "../utils/chatAccess.js";

const parseCookies = (cookieHeader = "") =>
  cookieHeader.split(";").reduce((cookies, item) => {
    const [key, ...value] = item.trim().split("=");
    if (key) cookies[key] = decodeURIComponent(value.join("="));
    return cookies;
  }, {});

export const getApplicationRoom = (applicationId) => `application:${applicationId}`;

export const initializeSocket = (server, corsOptions) => {
  const io = new Server(server, {
    cors: corsOptions,
  });

  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token = cookies.token;

      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      socket.userId = decoded.userId;
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("chat:join", async ({ applicationId }, callback) => {
      try {
        const application = await getAcceptedApplicationForUser(
          applicationId,
          socket.userId,
        );

        if (!application) {
          callback?.({ success: false, message: "Chat access denied" });
          return;
        }

        socket.join(getApplicationRoom(applicationId));
        callback?.({ success: true });
      } catch (error) {
        callback?.({ success: false, message: "Unable to join chat" });
      }
    });

    socket.on("chat:leave", ({ applicationId }) => {
      if (applicationId) socket.leave(getApplicationRoom(applicationId));
    });

    socket.on("webrtc:offer", ({ applicationId, callId, offer }) => {
      socket.to(getApplicationRoom(applicationId)).emit("webrtc:offer", {
        applicationId,
        callId,
        offer,
      });
    });

    socket.on("webrtc:answer", ({ applicationId, callId, answer }) => {
      socket.to(getApplicationRoom(applicationId)).emit("webrtc:answer", {
        applicationId,
        callId,
        answer,
      });
    });

    socket.on("webrtc:ice-candidate", ({ applicationId, callId, candidate }) => {
      socket.to(getApplicationRoom(applicationId)).emit("webrtc:ice-candidate", {
        applicationId,
        callId,
        candidate,
      });
    });
  });

  return io;
};
