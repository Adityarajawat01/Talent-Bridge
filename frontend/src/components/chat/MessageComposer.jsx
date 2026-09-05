import {
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Send,
  Video,
  X,
} from "lucide-react";
import { Button } from "../ui/button";

const MessageComposer = ({
  text,
  file,
  sending,
  onTextChange,
  onFileChange,
  onClearFile,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="border-t border-[#F8CFA8] bg-white px-4 py-3">
      {file ? (
        <div className="mb-2 flex items-center justify-between rounded-md border border-[#F8CFA8] bg-[#FFF8F1] px-3 py-2 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-[#3D2B1F]">
            {file.type.startsWith("video/") ? (
              <Video className="h-4 w-4 shrink-0" />
            ) : (
              <ImageIcon className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">{file.name}</span>
          </span>
          <button
            type="button"
            onClick={onClearFile}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex items-end gap-2">
        <label
          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#F8CFA8] hover:bg-[#FFF3E0]"
          title="Attach image or video"
        >
          <Paperclip className="h-4 w-4" />
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />
        </label>
        <textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Write a message"
          rows={1}
          className="max-h-28 min-h-9 flex-1 resize-none rounded-lg border border-[#F8CFA8] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F8CFA8]"
        />
        <Button
          type="submit"
          className="h-9 bg-[#D96B00] hover:bg-[#B45309]"
          disabled={sending || (!text.trim() && !file)}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send
        </Button>
      </div>
    </form>
  );
};

export default MessageComposer;
