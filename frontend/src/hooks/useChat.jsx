import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import {
  setContacts,
  setMessages,
  setLoadingContacts,
  setLoadingMessages,
  setSending,
  setCalling,
  setActiveCall,
  clearActiveCall,
  setSelectedId,
  clearMessages,
  clearComposer,
} from "@/redux/chatSlice";

import { CHAT_API_END_POINT } from "@/utils/constant";

export const useChat = () => {
  const dispatch = useDispatch();

  const {
    selectedId,
    contacts,
    messages,
    activeCall,
    sending,
    calling,
    loadingContacts,
    loadingMessages,
    text,
    file,
  } = useSelector((state) => state.chat);

  const fetchContacts = useCallback(async (quiet = false) => {
    try {
      if (!quiet) {
        dispatch(setLoadingContacts(true));
      }

      const res = await axios.get(
        `${CHAT_API_END_POINT}/contacts`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setContacts(res.data.contacts || []));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load chats"
      );
    } finally {
      if (!quiet) {
        dispatch(setLoadingContacts(false));
      }
    }
  }, [dispatch]);

  const fetchMessages = useCallback(async () => {
    if (!selectedId) return;

    try {
      dispatch(setLoadingMessages(true));

      const res = await axios.get(
        `${CHAT_API_END_POINT}/${selectedId}/messages`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(
          setMessages(res.data.messages || [])
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load messages"
      );
    } finally {
      dispatch(setLoadingMessages(false));
    }
  }, [dispatch, selectedId]);

  const sendMessage = async (event) => {
    event.preventDefault();

    if ((!text.trim() && !file) || !selectedId) {
      return;
    }

    try {
      dispatch(setSending(true));

      const formData = new FormData();

      formData.append("text", text);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post(
        `${CHAT_API_END_POINT}/${selectedId}/messages`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        dispatch({
          type: "chat/addMessage",
          payload: res.data.message,
        });

        dispatch(clearComposer());

        fetchContacts(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send message"
      );
    } finally {
      dispatch(setSending(false));
    }
  };

  const startCall = async () => {
    if (!selectedId) return;

    try {
      dispatch(setCalling(true));

      const res = await axios.post(
        `${CHAT_API_END_POINT}/${selectedId}/call`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setActiveCall(res.data.call));

        toast.success("Video call invite sent");

        fetchContacts(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to start call"
      );
    } finally {
      dispatch(setCalling(false));
    }
  };

  const respondToCall = async (call, status) => {
    try {
      const res = await axios.post(
        `${CHAT_API_END_POINT}/calls/${call._id}/respond`,
        { status },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        if (status === "accepted") {
          dispatch(setActiveCall(res.data.call));
        }

        if (status === "rejected") {
          dispatch(clearActiveCall());
        }

        toast.success(
          status === "accepted"
            ? "Call accepted"
            : "Call declined"
        );

        fetchContacts(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to respond to call"
      );
    }
  };

  const blockContact = async () => {
    if (!selectedId) return;

    const shouldBlock = window.confirm(
      "Block this student? Their application will be rejected."
    );

    if (!shouldBlock) return;

    try {
      const res = await axios.post(
        `${CHAT_API_END_POINT}/${selectedId}/block`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        dispatch(clearMessages());
        dispatch(clearActiveCall());

        await fetchContacts();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to block contact"
      );
    }
  };

  return {
    contacts,
    selectedId,
    messages,
    activeCall,

    sending,
    calling,

    loadingContacts,
    loadingMessages,

    fetchContacts,
    fetchMessages,
    sendMessage,
    startCall,
    respondToCall,
    blockContact,
  };
};