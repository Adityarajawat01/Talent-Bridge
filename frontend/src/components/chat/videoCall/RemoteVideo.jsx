import { useEffect, useRef } from "react";

const RemoteVideo = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject =
      stream || null;

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="aspect-video w-full rounded-md bg-black object-cover"
    />
  );
};

export default RemoteVideo;