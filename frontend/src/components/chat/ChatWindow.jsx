import { useDispatch, useSelector } from "react-redux";
import { MessageCircle } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import VideoCall from "./videoCall/VideoCall";
import { clearActiveCall } from "@/redux/chatSlice";

const ChatWindow = ({ socket, onBack }) => {
  const dispatch = useDispatch();

  const { contacts, selectedId, activeCall } = useSelector(
    (state) => state.chat,
  );

  const { user } = useSelector((state) => state.auth);

  const selectedContact = contacts.find(
    (contact) => contact.applicationId === selectedId,
  );

  if (!selectedContact) {
    return (
      <section className="hidden flex-1 items-center justify-center md:flex">
        <div className="text-center text-gray-500">
          <MessageCircle className="mx-auto mb-3 h-12 w-12 text-[#D96B00]" />

          <h2 className="text-lg font-semibold text-[#3D2B1F]">
            Select a chat
          </h2>

          <p className="mt-1 text-sm">
            Choose an accepted application to begin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col">
      <ChatHeader onBack={onBack} />

      {activeCall ? (
        <VideoCall
          socket={socket}
          onClose={() => dispatch(clearActiveCall())}
        />
      ) : null}

      <div className="flex-1 overflow-y-auto bg-[#FFF8F1] px-5 py-4">
        <MessageList />
      </div>

      <MessageComposer />
    </section>
  );
};

export default ChatWindow;
