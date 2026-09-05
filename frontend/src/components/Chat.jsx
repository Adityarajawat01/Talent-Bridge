import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import Navbar from "./shared/Navbar";
import ChatHeader from "./chat/ChatHeader";
import ChatSidebar from "./chat/ChatSidebar";
import MessageComposer from "./chat/MessageComposer";
import MessageList from "./chat/MessageList";
import VideoCallPanel from "./chat/VideoCallPanel";
import { createChatSocket } from "@/lib/socket";
import { CHAT_API_END_POINT } from "@/utils/constant";

const Chat = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [contacts, setContacts] = useState([]);
  const [selectedId, setSelectedId] = useState(applicationId || "");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [calling, setCalling] = useState(false);
  const [socket] = useState(() => createChatSocket());
  const bottomRef = useRef(null);

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.applicationId === selectedId),
    [contacts, selectedId],
  );

  const syncContactCall = useCallback((nextCall) => {
    const callApplicationId = nextCall.application?._id || nextCall.application;

    setContacts((prev) =>
      prev.map((contact) =>
        contact.applicationId === callApplicationId
          ? { ...contact, activeCall: nextCall.status === "ringing" ? nextCall : null }
          : contact,
      ),
    );
  }, []);

  const fetchContacts = useCallback(
    async (quiet = false) => {
      try {
        if (!quiet) setLoadingContacts(true);
        const res = await axios.get(`${CHAT_API_END_POINT}/contacts`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const nextContacts = res.data.contacts || [];
          setContacts(nextContacts);

          if (!selectedId && nextContacts.length) {
            setSelectedId(nextContacts[0].applicationId);
            navigate(`/chat/${nextContacts[0].applicationId}`, { replace: true });
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load chats");
      } finally {
        if (!quiet) setLoadingContacts(false);
      }
    },
    [navigate, selectedId],
  );

  const fetchMessages = useCallback(
    async (quiet = false) => {
      if (!selectedId) return;

      try {
        if (!quiet) setLoadingMessages(true);
        const res = await axios.get(
          `${CHAT_API_END_POINT}/${selectedId}/messages`,
          { withCredentials: true },
        );

        if (res.data.success) setMessages(res.data.messages || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load messages");
      } finally {
        if (!quiet) setLoadingMessages(false);
      }
    },
    [selectedId],
  );

  useEffect(() => {
    socket.on("connect_error", () => {
      toast.error("Realtime chat connection failed");
    });

    return () => socket.disconnect();
  }, [socket]);

  useEffect(() => {
    if (!socket || !selectedId) return undefined;

    socket.emit("chat:join", { applicationId: selectedId }, (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Unable to join chat room");
      }
    });

    return () => {
      socket.emit("chat:leave", { applicationId: selectedId });
    };
  }, [selectedId, socket]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleNewMessage = ({ applicationId: incomingApplicationId, message }) => {
      if (incomingApplicationId !== selectedId) return;

      setMessages((prev) => {
        if (prev.some((item) => item._id === message._id)) return prev;
        return [...prev, message];
      });
      fetchContacts(true);
    };

    const handleIncomingCall = ({ applicationId: incomingApplicationId, call }) => {
      syncContactCall(call);
      if (incomingApplicationId === selectedId && user?.role === "student") {
        toast.info("Incoming video call");
      }
    };

    const handleAcceptedCall = ({ applicationId: incomingApplicationId, call }) => {
      syncContactCall(call);
      if (incomingApplicationId === selectedId) {
        setActiveCall({ ...call, status: "accepted" });
      }
    };

    const handleClosedCall = ({ call }) => {
      syncContactCall(call);
      setActiveCall((current) => (current?._id === call?._id ? null : current));
    };

    socket.on("message:new", handleNewMessage);
    socket.on("call:incoming", handleIncomingCall);
    socket.on("call:accepted", handleAcceptedCall);
    socket.on("call:rejected", handleClosedCall);
    socket.on("call:ended", handleClosedCall);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:accepted", handleAcceptedCall);
      socket.off("call:rejected", handleClosedCall);
      socket.off("call:ended", handleClosedCall);
    };
  }, [fetchContacts, selectedId, socket, syncContactCall, user?.role]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (applicationId && applicationId !== selectedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedId(applicationId);
    }
  }, [applicationId, selectedId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedId]);

  const selectContact = (contact) => {
    setActiveCall(null);
    setSelectedId(contact.applicationId);
    navigate(`/chat/${contact.applicationId}`);
  };

  const submitMessage = async (event) => {
    event.preventDefault();
    if ((!text.trim() && !file) || !selectedId) return;

    try {
      setSending(true);
      const formData = new FormData();
      formData.append("text", text);
      if (file) formData.append("file", file);

      const res = await axios.post(
        `${CHAT_API_END_POINT}/${selectedId}/messages`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success) {
        setMessages((prev) => {
          if (prev.some((item) => item._id === res.data.message._id)) return prev;
          return [...prev, res.data.message];
        });
        setText("");
        setFile(null);
        fetchContacts(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send message");
    } finally {
      setSending(false);
    }
  };

  const startCall = async () => {
    if (!selectedId) return;

    try {
      setCalling(true);
      const res = await axios.post(
        `${CHAT_API_END_POINT}/${selectedId}/call`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        setActiveCall(res.data.call);
        toast.success("Video call invite sent");
        fetchContacts(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start call");
    } finally {
      setCalling(false);
    }
  };

  const respondToCall = async (call, status) => {
    try {
      const res = await axios.post(
        `${CHAT_API_END_POINT}/calls/${call._id}/respond`,
        { status },
        { withCredentials: true },
      );

      if (res.data.success) {
        if (status === "accepted") setActiveCall(res.data.call);
        if (status === "rejected") {
          syncContactCall({ ...res.data.call, status: "rejected" });
          setActiveCall(null);
        }
        toast.success(status === "accepted" ? "Call accepted" : "Call declined");
        fetchContacts(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to respond to call");
    }
  };

  const blockContact = async () => {
    if (!selectedId) return;
    const shouldBlock = window.confirm(
      "Block this student? Their application will be rejected.",
    );
    if (!shouldBlock) return;

    try {
      const res = await axios.post(
        `${CHAT_API_END_POINT}/${selectedId}/block`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setMessages([]);
        setActiveCall(null);
        await fetchContacts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to block contact");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1]">
      <Navbar />

      <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl overflow-hidden border-x border-[#F8CFA8] bg-white">
        <ChatSidebar
          contacts={contacts}
          loading={loadingContacts}
          selectedId={selectedId}
          showOnMobile={!selectedContact}
          onRefresh={() => {
            fetchContacts();
            fetchMessages();
          }}
          onSelectContact={selectContact}
        />

        <section
          className={`flex-1 flex-col ${selectedContact ? "flex" : "hidden md:flex"}`}
        >
          {selectedContact ? (
            <>
              <ChatHeader
                contact={selectedContact}
                user={user}
                calling={calling}
                onBack={() => {
                  setSelectedId("");
                  setActiveCall(null);
                  navigate("/chat");
                }}
                onStartCall={startCall}
                onRespondCall={respondToCall}
                onBlockContact={blockContact}
              />

              {activeCall ? (
                <VideoCallPanel
                  socket={socket}
                  call={activeCall}
                  applicationId={selectedId}
                  isCaller={user?.role === "recruiter"}
                  contact={selectedContact}
                  onClose={(closedCall) => {
                    if (closedCall) {
                      syncContactCall({ ...closedCall, status: "ended" });
                    }
                    setContacts((prev) =>
                      prev.map((contact) =>
                        contact.applicationId === selectedId
                          ? { ...contact, activeCall: null }
                          : contact,
                      ),
                    );
                    setActiveCall(null);
                    fetchContacts(true);
                  }}
                />
              ) : null}

              <div className="flex-1 overflow-y-auto bg-[#FFF8F1] px-5 py-4">
                <MessageList
                  loading={loadingMessages}
                  messages={messages}
                  user={user}
                  bottomRef={bottomRef}
                />
              </div>

              <MessageComposer
                text={text}
                file={file}
                sending={sending}
                onTextChange={setText}
                onFileChange={setFile}
                onClearFile={() => setFile(null)}
                onSubmit={submitMessage}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <MessageCircle className="mb-3 h-12 w-12 text-[#D96B00]" />
              <h2 className="text-lg font-semibold text-[#3D2B1F]">Select a chat</h2>
              <p className="mt-1 text-sm">Choose an accepted application to begin.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Chat;
