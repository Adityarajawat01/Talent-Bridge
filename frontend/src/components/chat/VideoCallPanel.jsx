import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Loader2, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CHAT_API_END_POINT } from "@/utils/constant";

const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

const VideoCallPanel = ({ socket, call, applicationId, isCaller, contact, onClose }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const offeredRef = useRef(false);
  const [status, setStatus] = useState(isCaller ? "Calling" : "Connecting");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const cleanup = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    offeredRef.current = false;
  }, []);

  const finishCall = useCallback(
    async ({ showErrorToast = true } = {}) => {
      let closedCall = null;

      try {
        cleanup();
        const res = await axios.post(
          `${CHAT_API_END_POINT}/calls/${call._id}/end`,
          {},
          { withCredentials: true },
        );
        closedCall = res.data.call;
      } catch (error) {
        if (showErrorToast) {
          toast.error(error.response?.data?.message || "Unable to end call");
        }
      } finally {
        onClose(closedCall || { ...call, status: "ended" });
      }
    },
    [call, cleanup, onClose],
  );

  const getPeer = useCallback(() => {
    if (peerRef.current) return peerRef.current;

    const peer = new RTCPeerConnection({ iceServers });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("webrtc:ice-candidate", {
          applicationId,
          callId: call._id,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "connected") setStatus("Connected");
      if (["failed", "disconnected"].includes(peer.connectionState)) {
        setStatus("Reconnecting");
      }
    };

    peerRef.current = peer;
    return peer;
  }, [applicationId, call._id, socket]);

  const createOffer = useCallback(async () => {
    if (!socket || offeredRef.current) return;

    offeredRef.current = true;
    const peer = getPeer();
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("webrtc:offer", {
      applicationId,
      callId: call._id,
      offer,
    });
    setStatus("Waiting for answer");
  }, [applicationId, call._id, getPeer, socket]);

  useEffect(() => {
    let mounted = true;

    const startMedia = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Media devices are not available");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        const peer = getPeer();
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));

        if (isCaller && call.status === "accepted") {
          await createOffer();
        }
      } catch (error) {
        console.log(error);
        toast.error(
          "Camera/microphone permission blocked. Allow browser permission and try again.",
        );
        setStatus("Permission blocked");
        await finishCall({ showErrorToast: false });
      }
    };

    startMedia();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [call.status, cleanup, createOffer, finishCall, getPeer, isCaller]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleAccepted = async ({ call: acceptedCall }) => {
      if (acceptedCall?._id !== call._id || !isCaller) return;
      setStatus("Connecting");
      await createOffer();
    };

    const handleOffer = async ({ callId, offer }) => {
      if (callId !== call._id || isCaller) return;

      const peer = getPeer();
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("webrtc:answer", {
        applicationId,
        callId: call._id,
        answer,
      });
      setStatus("Connecting");
    };

    const handleAnswer = async ({ callId, answer }) => {
      if (callId !== call._id || !isCaller) return;

      const peer = getPeer();
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
      setStatus("Connecting");
    };

    const handleCandidate = async ({ callId, candidate }) => {
      if (callId !== call._id || !candidate) return;

      try {
        const peer = getPeer();
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.log(error);
      }
    };

    const handleEnded = ({ call: endedCall }) => {
      if (endedCall?._id === call._id) {
        cleanup();
        onClose();
      }
    };

    socket.on("call:accepted", handleAccepted);
    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleCandidate);
    socket.on("call:ended", handleEnded);
    socket.on("call:rejected", handleEnded);

    return () => {
      socket.off("call:accepted", handleAccepted);
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleCandidate);
      socket.off("call:ended", handleEnded);
      socket.off("call:rejected", handleEnded);
    };
  }, [applicationId, call._id, cleanup, createOffer, getPeer, isCaller, onClose, socket]);

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
  };

  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setCameraOn(track.enabled);
    });
  };

  return (
    <div className="border-b border-[#F8CFA8] bg-[#1f1712] p-3 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            Video call with {contact?.contact?.fullname || "contact"}
          </p>
          <p className="flex items-center gap-2 text-xs text-white/70">
            {!["Connected", "Permission blocked"].includes(status) ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : null}
            {status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="icon-sm" variant="outline" onClick={toggleMic}>
            {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button type="button" size="icon-sm" variant="outline" onClick={toggleCamera}>
            {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="destructive"
            onClick={() => finishCall()}
            title="End call"
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="aspect-video w-full rounded-md bg-black object-cover"
        />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="aspect-video w-full rounded-md bg-black object-cover"
        />
      </div>
    </div>
  );
};

export default VideoCallPanel;
