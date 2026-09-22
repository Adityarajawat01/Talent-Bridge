import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../shared/Navbar";

import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

import { setSelectedId } from "@/redux/chatSlice";

import { createChatSocket } from "@/lib/socket";

import { useChat } from "@/hooks/useChat";
import { useChatSocket } from "@/hooks/useChatSocket";

const Chat = () => {
  const { applicationId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [socket] = useState(() => createChatSocket());

  const { contacts, fetchContacts, fetchMessages } = useChat();

  const { selectedId } = useSelector((state) => state.chat);

  useChatSocket(socket);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (applicationId) {
      dispatch(setSelectedId(applicationId));
    }
  }, [applicationId, dispatch]);

  useEffect(() => {
    fetchMessages();
  }, [selectedId, fetchMessages]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const hasSelectedChat = contacts.some(
    (contact) => contact.applicationId === selectedId,
  );

  const handleBack = () => {
    dispatch(setSelectedId(""));

    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1]">
      <Navbar />

      <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl overflow-hidden border-x border-[#F8CFA8] bg-white">
        <ChatSidebar showOnMobile={!hasSelectedChat} />

        <ChatWindow socket={socket} onBack={handleBack} />
      </main>
    </div>
  );
};

export default Chat;
