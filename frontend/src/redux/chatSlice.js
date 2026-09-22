import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
  selectedId: "",

  messages: [],

  activeCall: null,

  loadingContacts: false,
  loadingMessages: false,

  sending: false,
  calling: false,

  text: "",
  file: null,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },

    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      const exists = state.messages.some(
        (message) => message._id === action.payload._id
      );

      if (!exists) {
        state.messages.push(action.payload);
      }
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    setActiveCall: (state, action) => {
      state.activeCall = action.payload;
    },

    clearActiveCall: (state) => {
      state.activeCall = null;
    },

    updateContactCall: (state, action) => {
      const call = action.payload;

      const applicationId =
        call.application?._id || call.application;

      state.contacts = state.contacts.map((contact) =>
        contact.applicationId === applicationId
          ? {
              ...contact,
              activeCall:
                call.status === "ringing" ? call : null,
            }
          : contact
      );
    },

    setLoadingContacts: (state, action) => {
      state.loadingContacts = action.payload;
    },

    setLoadingMessages: (state, action) => {
      state.loadingMessages = action.payload;
    },

    setSending: (state, action) => {
      state.sending = action.payload;
    },

    setCalling: (state, action) => {
      state.calling = action.payload;
    },

    setText: (state, action) => {
      state.text = action.payload;
    },

    setFile: (state, action) => {
      state.file = action.payload;
    },

    clearComposer: (state) => {
      state.text = "";
      state.file = null;
    },

    resetChat: (state) => {
      state.messages = [];
      state.activeCall = null;
      state.text = "";
      state.file = null;
    },
  },
});

export const {
  setContacts,
  setSelectedId,
  setMessages,
  addMessage,
  clearMessages,
  setActiveCall,
  clearActiveCall,
  updateContactCall,
  setLoadingContacts,
  setLoadingMessages,
  setSending,
  setCalling,
  setText,
  setFile,
  clearComposer,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;