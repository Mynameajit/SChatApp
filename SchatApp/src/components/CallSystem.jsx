import React, { useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk";

const CallSystem = () => {
  const localStreamRef = useRef(null);

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    client.init("YOUR_AGORA_APP_ID", () => {
      client.join("YOUR_TOKEN", "CHANNEL_NAME", null, (uid) => {
        const localStream = AgoraRTC.createStream({
          audio: true,
          video: true,
        });
        localStream.init(() => {
          localStreamRef.current = localStream;
          client.publish(localStream);
        });
      });
    });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h2>Calling System</h2>
      <div id="local-stream"></div>
    </div>
  );
};

export default CallSystem;