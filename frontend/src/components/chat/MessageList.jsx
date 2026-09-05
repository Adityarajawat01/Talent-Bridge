import { Loader2, UserRound } from "lucide-react";
import { formatChatTime } from "./chatUtils";

const MessageList = ({ loading, messages, user, bottomRef }) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading messages
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
        <UserRound className="mb-3 h-10 w-10 text-[#D96B00]" />
        <p className="font-medium text-[#3D2B1F]">Start the conversation</p>
        <p className="mt-1 text-sm">
          Share interview details, questions, or next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((item) => {
        const mine = item.sender?._id === user?._id;

        return (
          <div key={item._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-md px-3 py-2 shadow-sm md:max-w-[70%] ${
                mine ? "bg-[#D96B00] text-white" : "bg-white text-[#3D2B1F]"
              }`}
            >
              {item.mediaUrl && item.type === "image" ? (
                <img
                  src={item.mediaUrl}
                  alt="message attachment"
                  className="mb-2 max-h-72 rounded-md object-contain"
                />
              ) : null}
              {item.mediaUrl && item.type === "video" ? (
                <video src={item.mediaUrl} controls className="mb-2 max-h-72 rounded-md" />
              ) : null}
              {item.text ? (
                <p className="whitespace-pre-wrap break-words text-sm">{item.text}</p>
              ) : null}
              <p className={`mt-1 text-[11px] ${mine ? "text-white/80" : "text-gray-500"}`}>
                {formatChatTime(item.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
