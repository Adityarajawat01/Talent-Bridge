import {
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Send,
  Video,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { setText, setFile } from "@/redux/chatSlice";

import { Button } from "../ui/button";
import { useChat } from "@/hooks/useChat";

const MessageComposer = () => {
  const dispatch = useDispatch();

  const { text, file, sending } = useSelector((state) => state.chat);

  const { sendMessage } = useChat();

  return (
    <form
      onSubmit={sendMessage}
      className="border-t border-[#F8CFA8] bg-white px-4 py-3"
    >
      {file ? (
        <div className="mb-2 flex items-center justify-between rounded-md border border-[#F8CFA8] bg-[#FFF8F1] px-3 py-2 text-sm">
          <span className="flex items-center gap-2">
            {file.type.startsWith("video/") ? (
              <Video className="h-4 w-4" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}

            <span className="truncate">{file.name}</span>
          </span>

          <button type="button" onClick={() => dispatch(setFile(null))}>
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex items-end gap-2">
        <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border">
          <Paperclip className="h-4 w-4" />

          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(event) =>
              dispatch(setFile(event.target.files?.[0] || null))
            }
          />
        </label>

        <textarea
          value={text}
          onChange={(event) => dispatch(setText(event.target.value))}
          placeholder="Write a message"
          rows={1}
          className="max-h-28 min-h-9 flex-1 resize-none rounded-lg border px-3 py-2 text-sm"
        />

        <Button
          type="submit"
          disabled={sending || (!text.trim() && !file)}
          className="h-9 bg-[#D96B00]"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </Button>
      </div>
    </form>
  );
};

export default MessageComposer;
