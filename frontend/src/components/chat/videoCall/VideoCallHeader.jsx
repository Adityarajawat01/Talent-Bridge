import { Loader2 } from "lucide-react";

import VideoCallControls from "./VideoCallControls";

const VideoCallHeader = ({
  contact,
  status,
  micOn,
  cameraOn,
  onToggleMic,
  onToggleCamera,
  onToggleFullScreen,
  isFullScreen,
  onEndCall,
}) => {
  const showLoader = ![
    "Connected",
    "Permission blocked",
    "Call ended",
    "Connection failed",
  ].includes(status);

  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          Video call with {contact?.contact?.fullname || "contact"}
        </p>

        <p className="flex items-center gap-2 text-xs text-white/70">
          {showLoader ? <Loader2 className="h-3 w-3 animate-spin" /> : null}

          {status}
        </p>
      </div>

      <VideoCallControls
        micOn={micOn}
        cameraOn={cameraOn}
        onToggleMic={onToggleMic}
        onToggleCamera={onToggleCamera}
        onToggleFullScreen={onToggleFullScreen}
        isFullScreen={isFullScreen}
        onEndCall={onEndCall}
      />
    </div>
  );
};

export default VideoCallHeader;
