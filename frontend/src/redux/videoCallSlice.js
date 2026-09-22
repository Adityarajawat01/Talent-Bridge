import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "Idle",

  micOn: true,
  cameraOn: true,

  isCallActive: false,
};

const videoCallSlice = createSlice({
  name: "videoCall",

  initialState,

  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setMicOn: (state, action) => {
      state.micOn = action.payload;
    },

    setCameraOn: (state, action) => {
      state.cameraOn = action.payload;
    },

    setCallActive: (state, action) => {
      state.isCallActive = action.payload;
    },

    resetVideoCall: (state) => {
      state.status = "Idle";
      state.micOn = true;
      state.cameraOn = true;
      state.isCallActive = false;
    },
  },
});

export const {
  setStatus,
  setMicOn,
  setCameraOn,
  setCallActive,
  resetVideoCall,
} = videoCallSlice.actions;

export default videoCallSlice.reducer;