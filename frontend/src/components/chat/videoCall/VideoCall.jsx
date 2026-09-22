import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import useVideoCall from "@/hooks/useVideoCall";

import VideoCallHeader from "./VideoCallHeader";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";

const VideoCall = ({ socket, onClose }) => {
  const containerRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { contacts, selectedId, activeCall } = useSelector(
    (state) => state.chat,
  );

  const { user } = useSelector((state) => state.auth);

  const {
    status,
    micOn,
    cameraOn,
    localStream,
    remoteStream,
    toggleMic,
    toggleCamera,
    finishCall,
  } = useVideoCall({
    socket,
    call: activeCall,
    applicationId: selectedId,
    isCaller: user?.role === "recruiter",
    onClose,
  });

  const contact = contacts.find((item) => item.applicationId === selectedId);

  const toggleFullScreen = useCallback(async () => {
    const el = containerRef.current;

    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullScreen(true);
        return;
      }

      await document.exitFullscreen();
      setIsFullScreen(false);
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  if (!activeCall) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`border-b border-[#F8CFA8] bg-[#1f1712] p-3 text-white ${
        isFullScreen ? "fixed inset-0 z-50 rounded-none p-4" : "relative"
      }`}
    >
      <VideoCallHeader
        contact={contact}
        status={status}
        micOn={micOn}
        cameraOn={cameraOn}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        onEndCall={() => finishCall()}
      />

      <div
        className={`grid gap-3 ${
          isFullScreen
            ? "h-[calc(100vh-6rem)] md:grid-cols-[1fr_260px]"
            : "md:grid-cols-[1fr_220px]"
        }`}
      >
        <RemoteVideo stream={remoteStream} />

        <LocalVideo stream={localStream} />
      </div>
    </div>
  );
};

export default VideoCall;
