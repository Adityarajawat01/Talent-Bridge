import {
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";

import { Button } from "../../ui/button";

const VideoCallControls = ({
  micOn,
  cameraOn,
  onToggleMic,
  onToggleCamera,
  onToggleFullScreen,
  isFullScreen,
  onEndCall,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        onClick={onToggleMic}
        className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        title={micOn ? "Mute microphone" : "Unmute microphone"}
      >
        {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>

      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        onClick={onToggleCamera}
        className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        title={cameraOn ? "Turn camera off" : "Turn camera on"}
      >
        {cameraOn ? (
          <Video className="h-4 w-4" />
        ) : (
          <VideoOff className="h-4 w-4" />
        )}
      </Button>

      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        onClick={onToggleFullScreen}
        className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        title={isFullScreen ? "Exit full screen" : "Full screen"}
      >
        {isFullScreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>

      <Button
        type="button"
        size="icon-sm"
        variant="destructive"
        onClick={onEndCall}
        className="bg-red-500 text-white hover:bg-red-600"
        title="End call"
      >
        <PhoneOff className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VideoCallControls;
