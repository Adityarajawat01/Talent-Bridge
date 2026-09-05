import { io } from "socket.io-client";
import { API_BASE_URL } from "@/utils/constant";

export const createChatSocket = () =>
  io(API_BASE_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
