import { Loader2, MessageCircle, RefreshCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setSelectedId } from "@/redux/chatSlice";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import defaultProfile from "@/assets/default.png";

import { formatChatTime, getInitials } from "@/components/chat/chatUtils";
import { useChat } from "@/hooks/useChat";

const ChatSidebar = ({ showOnMobile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contacts, loadingContacts, fetchContacts } = useChat();

  const { selectedId } = useSelector((state) => state.chat);

  const selectContact = (contact) => {
    dispatch(setSelectedId(contact.applicationId));

    navigate(`/chat/${contact.applicationId}`);
  };

  return (
    <aside
      className={`w-full border-r border-[#F8CFA8] bg-[#FFFDF9] md:block md:w-80 ${
        showOnMobile ? "block" : "hidden"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#F8CFA8] px-4">
        <div>
          <h1 className="text-lg font-semibold text-[#3D2B1F]">Messages</h1>

          <p className="text-xs text-gray-500">Accepted applications only</p>
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => fetchContacts()}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        {loadingContacts ? (
          <div className="flex h-40 items-center justify-center text-gray-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading chats
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center px-6 text-center text-gray-500">
            <MessageCircle className="mb-3 h-10 w-10 text-[#D96B00]" />

            <p className="font-medium text-[#3D2B1F]">No chats yet</p>

            <p className="mt-1 text-sm">
              Chats appear after an application is accepted.
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <button
              key={contact.applicationId}
              type="button"
              onClick={() => selectContact(contact)}
              className={`flex w-full gap-3 border-b border-[#F8CFA8] px-4 py-3 text-left ${
                contact.applicationId === selectedId
                  ? "bg-[#FFF0DE]"
                  : "hover:bg-[#FFF8F5]"
              }`}
            >
              <Avatar className="mt-1">
                <AvatarImage
                  src={contact.contact?.profile?.profilePhoto || defaultProfile}
                />
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-[#3D2B1F]">
                    {contact.contact?.fullname || getInitials(contact.jobTitle)}
                  </p>

                  <span className="shrink-0 text-[11px] text-gray-500">
                    {formatChatTime(contact.lastMessageAt)}
                  </span>
                </div>

                <p className="truncate text-sm text-gray-600">
                  {contact.jobTitle}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {contact.lastMessage ||
                    contact.company?.name ||
                    "Start the chat"}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
