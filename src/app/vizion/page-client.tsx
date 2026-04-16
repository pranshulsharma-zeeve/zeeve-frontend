// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/user";

interface VisionIFrameProps {
  networkId?: string;
  theme?: "light" | "dark";
  protocolId?: string;
  createdAt?: string;
}

const VisionIFrame = ({ networkId, theme, protocolId, createdAt }: VisionIFrameProps) => {
  const iframeOrigin = process.env.NEXT_PUBLIC_IFRAME_ORIGIN;
  // const iframeOrigin = "https://vision-frontend-test.zeeve.net";
  console.log("iframeOrigin in vizionIframe:", iframeOrigin);
  // const iframeOrigin = "http://localhost:3003";
  const user = useUserStore((state) => state.user);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (window.AuthScript) {
        console.log("AuthScript loaded. Logging in...");
        console.log("Passing selectedNetworkCreated:", createdAt);

        if (user?.usercred === "jamol47996@rowplant.com") {
          window.AuthScript.login("hello@optimisticlabsltd.com");
        } else {
          window.AuthScript.login(user?.usercred);
        }

        const iframe = iframeRef.current;
        if (iframe?.contentWindow) {
          window.AuthScript.populateData({
            selectedProtocolName: "ethereum",
            selectedNetworkId: networkId,
            selectedTheme: theme ?? "dark",
            selectedProtocolId: protocolId,
            selectedNetworkCreated: createdAt,
          });
        } else {
          console.warn("iframe is not available");
        }

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [networkId, user]);

  return (
    <div className="flex size-full flex-col rounded-lg">
      <iframe
        ref={iframeRef}
        src={`${iframeOrigin}/iframe`}
        allow="clipboard-read; clipboard-write"
        width="100%"
        id="vizion-iframe"
        title="Vizion"
        style={{
          border: "none",
          display: "block",
          overflow: "hidden",
          height: "1800px", // Start from 0, update dynamically
        }}
        sandbox="allow-same-origin allow-scripts allow-modals allow-forms allow-popups"
      />
    </div>
  );
};

export default VisionIFrame;
