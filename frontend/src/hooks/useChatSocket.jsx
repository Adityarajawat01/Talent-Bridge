import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  addMessage,
  setActiveCall,
  updateContactCall,
} from "@/redux/chatSlice";

export const useChatSocket = (socket) => {
  const dispatch = useDispatch();

  const { selectedId } = useSelector(
    (state) => state.chat
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!socket || !selectedId) return;

    socket.emit(
      "chat:join",
      { applicationId: selectedId },
      (response) => {
        if (!response?.success) {
          toast.error(
            response?.message ||
              "Unable to join chat room"
          );
        }
      }
    );

    return () => {
      socket.emit("chat:leave", {
        applicationId: selectedId,
      });
    };
  }, [socket, selectedId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({
      applicationId,
      message,
    }) => {
      if (applicationId !== selectedId) return;

      dispatch(addMessage(message));
    };

    const handleIncomingCall = ({
      applicationId,
      call,
    }) => {
      dispatch(updateContactCall(call));

      if (
        applicationId === selectedId &&
        user?.role === "student"
      ) {
        toast.info("Incoming video call");
      }
    };

    const handleAcceptedCall = ({
      applicationId,
      call,
    }) => {
      dispatch(updateContactCall(call));

      if (applicationId === selectedId) {
        dispatch(
          setActiveCall({
            ...call,
            status: "accepted",
          })
        );
      }
    };

    const handleClosedCall = ({ call }) => {
      dispatch(updateContactCall(call));

      dispatch({
        type: "chat/clearActiveCall",
      });
    };

    socket.on(
      "message:new",
      handleNewMessage
    );

    socket.on(
      "call:incoming",
      handleIncomingCall
    );

    socket.on(
      "call:accepted",
      handleAcceptedCall
    );

    socket.on(
      "call:rejected",
      handleClosedCall
    );

    socket.on(
      "call:ended",
      handleClosedCall
    );

    return () => {
      socket.off(
        "message:new",
        handleNewMessage
      );

      socket.off(
        "call:incoming",
        handleIncomingCall
      );

      socket.off(
        "call:accepted",
        handleAcceptedCall
      );

      socket.off(
        "call:rejected",
        handleClosedCall
      );

      socket.off(
        "call:ended",
        handleClosedCall
      );
    };
  }, [
    socket,
    selectedId,
    user?.role,
    dispatch,
  ]);
};