import { useCallback, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { CHAT_API_END_POINT } from "@/utils/constant";
import { iceServers } from "@/components/chat/videoCall/iceServers";

import {
  setStatus,
  setMicOn,
  setCameraOn,
  setCallActive,
  resetVideoCall,
} from "@/redux/videoCallSlice";
import { clearActiveCall } from "@/redux/chatSlice";

const useVideoCall = ({ socket, call, applicationId, isCaller, onClose }) => {
  const dispatch = useDispatch();

  const { status, micOn, cameraOn } = useSelector((state) => state.videoCall);

  const localStreamRef = useRef(null);
  const peerRef = useRef(null);

  const offeredRef = useRef(false);
  const mountedRef = useRef(true);

  const [remoteStream, setRemoteStream] = useState(null);

  /*
  ------------------------------------------------
  CALL ID
  ------------------------------------------------
  */

  const callId = call?._id;

  /*
  ------------------------------------------------
  CLEANUP
  ------------------------------------------------
  */

  const cleanup = useCallback(() => {
    console.log("Cleaning WebRTC resources");

    // Close PeerConnection
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    // Stop camera + microphone
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());

      localStreamRef.current = null;
    }

    // Remove remote video
    setRemoteStream(null);

    // Allow another offer later
    offeredRef.current = false;
  }, []);

  /*
  ------------------------------------------------
  END CALL
  ------------------------------------------------
  */

  const finishCall = useCallback(
    async ({ showErrorToast = true } = {}) => {
      if (!callId) {
        cleanup();
        dispatch(resetVideoCall());
        onClose?.();
        return;
      }

      try {
        cleanup();

        const res = await axios.post(
          `${CHAT_API_END_POINT}/calls/${callId}/end`,
          {},
          {
            withCredentials: true,
          },
        );

        dispatch(clearActiveCall());

        onClose?.(
          res.data.call || {
            ...call,
            status: "ended",
          },
        );
      } catch (error) {
        console.error("End call error:", error);

        if (showErrorToast) {
          toast.error(error.response?.data?.message || "Unable to end call");
        }

        onClose?.({
          ...call,
          status: "ended",
        });
      } finally {
        dispatch(clearActiveCall());
        dispatch(resetVideoCall());
      }
    },
    [call, callId, cleanup, dispatch, onClose],
  );

  /*
  ------------------------------------------------
  CREATE PEER CONNECTION
  ------------------------------------------------
  */

  const getPeer = useCallback(() => {
    if (peerRef.current) {
      return peerRef.current;
    }

    if (!callId) {
      return null;
    }

    console.log("Creating RTCPeerConnection");

    const peer = new RTCPeerConnection({
      iceServers,
    });

    /*
    ----------------------------------------------
    ICE CANDIDATE
    ----------------------------------------------
    */

    peer.onicecandidate = (event) => {
      if (!event.candidate) return;

      console.log("Sending ICE candidate");

      socket?.emit("webrtc:ice-candidate", {
        applicationId,
        callId,
        candidate: event.candidate,
      });
    };

    /*
    ----------------------------------------------
    REMOTE STREAM
    ----------------------------------------------
    */

    peer.ontrack = (event) => {
      console.log("Remote track received");

      const stream = event.streams?.[0];

      if (stream) {
        setRemoteStream(stream);
      }
    };

    /*
    ----------------------------------------------
    CONNECTION STATE
    ----------------------------------------------
    */

    peer.onconnectionstatechange = () => {
      console.log("Connection state:", peer.connectionState);

      switch (peer.connectionState) {
        case "connected":
          dispatch(setStatus("Connected"));
          break;

        case "connecting":
          dispatch(setStatus("Connecting"));
          break;

        case "disconnected":
          dispatch(setStatus("Reconnecting"));
          break;

        case "failed":
          dispatch(setStatus("Connection failed"));
          break;

        case "closed":
          dispatch(setStatus("Call ended"));
          break;

        default:
          break;
      }
    };

    /*
    ----------------------------------------------
    ICE CONNECTION STATE
    ----------------------------------------------
    */

    peer.oniceconnectionstatechange = () => {
      console.log("ICE state:", peer.iceConnectionState);

      if (peer.iceConnectionState === "failed") {
        dispatch(setStatus("Connection failed"));
      }
    };

    peerRef.current = peer;

    return peer;
  }, [applicationId, callId, dispatch, socket]);

  /*
  ------------------------------------------------
  CREATE OFFER
  ------------------------------------------------
  */

  const createOffer = useCallback(async () => {
    if (!socket || !callId) return;

    if (offeredRef.current) {
      return;
    }

    offeredRef.current = true;

    try {
      const peer = getPeer();

      if (!peer) {
        offeredRef.current = false;
        return;
      }

      console.log("Creating offer");

      const offer = await peer.createOffer();

      await peer.setLocalDescription(offer);

      socket.emit("webrtc:offer", {
        applicationId,
        callId,
        offer,
      });

      dispatch(setStatus("Waiting for answer"));
    } catch (error) {
      console.error("Offer creation failed:", error);

      offeredRef.current = false;

      dispatch(setStatus("Call failed"));
    }
  }, [applicationId, callId, dispatch, getPeer, socket]);

  /*
  ------------------------------------------------
  START CAMERA + MICROPHONE
  ------------------------------------------------
  */

  const startMedia = useCallback(async () => {
    if (!callId) return;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia is not available");
      }

      console.log("Requesting camera and microphone");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());

        return;
      }

      localStreamRef.current = stream;

      const peer = getPeer();

      if (!peer) return;

      /*
      ----------------------------------------------
      ADD LOCAL TRACKS
      ----------------------------------------------
      */

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      /*
      ----------------------------------------------
      CALLER CREATES OFFER
      ----------------------------------------------
      */

      if (isCaller && call?.status === "accepted") {
        await createOffer();
      }
    } catch (error) {
      console.error("Media permission error:", error);

      toast.error(
        "Camera/microphone permission blocked. Allow browser permission and try again.",
      );

      dispatch(setStatus("Permission blocked"));

      await finishCall({
        showErrorToast: false,
      });
    }
  }, [
    call?.status,
    callId,
    createOffer,
    dispatch,
    finishCall,
    getPeer,
    isCaller,
  ]);

  /*
  ------------------------------------------------
  SOCKET EVENTS
  ------------------------------------------------
  */

  useEffect(() => {
    if (!socket || !callId) return;

    /*
    ----------------------------------------------
    CALL ACCEPTED
    ----------------------------------------------
    */

    const handleAccepted = async ({ call: acceptedCall }) => {
      if (acceptedCall?._id !== callId) {
        return;
      }

      if (!isCaller) return;

      dispatch(setStatus("Connecting"));

      await createOffer();
    };

    /*
    ----------------------------------------------
    OFFER RECEIVED
    ----------------------------------------------
    */

    const handleOffer = async ({ callId: incomingCallId, offer }) => {
      if (incomingCallId !== callId) {
        return;
      }

      if (isCaller) return;

      try {
        console.log("Offer received");

        const peer = getPeer();

        if (!peer) return;

        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peer.createAnswer();

        await peer.setLocalDescription(answer);

        socket.emit("webrtc:answer", {
          applicationId,
          callId,
          answer,
        });

        dispatch(setStatus("Connecting"));
      } catch (error) {
        console.error("Answer creation failed:", error);

        dispatch(setStatus("Call failed"));
      }
    };

    /*
    ----------------------------------------------
    ANSWER RECEIVED
    ----------------------------------------------
    */

    const handleAnswer = async ({ callId: incomingCallId, answer }) => {
      if (incomingCallId !== callId) {
        return;
      }

      if (!isCaller) return;

      try {
        console.log("Answer received");

        const peer = getPeer();

        if (!peer) return;

        await peer.setRemoteDescription(new RTCSessionDescription(answer));

        dispatch(setStatus("Connecting"));
      } catch (error) {
        console.error("Setting answer failed:", error);

        dispatch(setStatus("Call failed"));
      }
    };

    /*
    ----------------------------------------------
    ICE CANDIDATE
    ----------------------------------------------
    */

    const handleCandidate = async ({ callId: incomingCallId, candidate }) => {
      if (incomingCallId !== callId) {
        return;
      }

      if (!candidate) return;

      try {
        const peer = getPeer();

        if (!peer) return;

        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("ICE candidate error:", error);
      }
    };

    /*
    ----------------------------------------------
    CALL ENDED
    ----------------------------------------------
    */

    const handleEnded = ({ call: endedCall }) => {
      if (endedCall?._id !== callId) {
        return;
      }

      cleanup();
      dispatch(clearActiveCall());
      dispatch(resetVideoCall());
      onClose?.();
    };

    /*
    ----------------------------------------------
    REGISTER EVENTS
    ----------------------------------------------
    */

    socket.on("call:accepted", handleAccepted);

    socket.on("webrtc:offer", handleOffer);

    socket.on("webrtc:answer", handleAnswer);

    socket.on("webrtc:ice-candidate", handleCandidate);

    socket.on("call:ended", handleEnded);

    socket.on("call:rejected", handleEnded);

    /*
    ----------------------------------------------
    CLEAN SOCKET EVENTS
    ----------------------------------------------
    */

    return () => {
      socket.off("call:accepted", handleAccepted);

      socket.off("webrtc:offer", handleOffer);

      socket.off("webrtc:answer", handleAnswer);

      socket.off("webrtc:ice-candidate", handleCandidate);

      socket.off("call:ended", handleEnded);

      socket.off("call:rejected", handleEnded);
    };
  }, [
    applicationId,
    callId,
    cleanup,
    createOffer,
    dispatch,
    getPeer,
    isCaller,
    onClose,
    socket,
  ]);

  /*
  ------------------------------------------------
  START MEDIA
  ------------------------------------------------
  */

  useEffect(() => {
    mountedRef.current = true;

    if (!callId) {
      return;
    }

    dispatch(setStatus(isCaller ? "Calling" : "Connecting"));

    dispatch(setCallActive(true));

    startMedia();

    return () => {
      mountedRef.current = false;

      cleanup();
    };
  }, [callId, cleanup, dispatch, isCaller, startMedia]);

  /*
  ------------------------------------------------
  MICROPHONE
  ------------------------------------------------
  */

  const toggleMic = useCallback(() => {
    const tracks = localStreamRef.current?.getAudioTracks();

    if (!tracks?.length) return;

    const nextValue = !tracks[0].enabled;

    tracks.forEach((track) => {
      track.enabled = nextValue;
    });

    dispatch(setMicOn(nextValue));
  }, [dispatch]);

  /*
  ------------------------------------------------
  CAMERA
  ------------------------------------------------
  */

  const toggleCamera = useCallback(() => {
    const tracks = localStreamRef.current?.getVideoTracks();

    if (!tracks?.length) return;

    const nextValue = !tracks[0].enabled;

    tracks.forEach((track) => {
      track.enabled = nextValue;
    });

    dispatch(setCameraOn(nextValue));
  }, [dispatch]);

  /*
  ------------------------------------------------
  RETURN
  ------------------------------------------------
  */

  return {
    status,
    micOn,
    cameraOn,

    localStream: localStreamRef.current,

    remoteStream,

    toggleMic,
    toggleCamera,

    finishCall,
  };
};

export default useVideoCall;
