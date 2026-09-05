import { Ban, Check, Loader2, Phone, X } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import defaultProfile from "@/assets/default.png";

const ChatHeader = ({
  contact,
  user,
  calling,
  onBack,
  onStartCall,
  onRespondCall,
  onBlockContact,
}) => {
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-[#F8CFA8] px-3 md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="md:hidden"
          onClick={onBack}
          title="Back to chats"
        >
          <X className="h-4 w-4" />
        </Button>
        <Avatar>
          <AvatarImage
            src={contact.contact?.profile?.profilePhoto || defaultProfile}
            alt={contact.contact?.fullname || "contact"}
          />
        </Avatar>
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-[#3D2B1F]">
            {contact.contact?.fullname}
          </h2>
          <p className="truncate text-sm text-gray-500">
            {contact.jobTitle}
            {contact.company?.name ? ` at ${contact.company.name}` : ""}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {contact.activeCall && user?.role === "student" ? (
          <div className="flex items-center gap-2 rounded-md border border-[#F8CFA8] bg-[#FFF8F1] px-2 py-1">
            <Phone className="h-4 w-4 text-[#D96B00]" />
            <Button
              type="button"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onRespondCall(contact.activeCall, "accepted")}
            >
              <Check className="h-4 w-4" />
              Join
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="destructive"
              onClick={() => onRespondCall(contact.activeCall, "rejected")}
              title="Decline call"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : null}

        {user?.role === "recruiter" ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onStartCall}
              disabled={calling}
            >
              {calling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
              Video Call
            </Button>
            <Button type="button" variant="destructive" onClick={onBlockContact}>
              <Ban className="h-4 w-4" />
              Block
            </Button>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default ChatHeader;
