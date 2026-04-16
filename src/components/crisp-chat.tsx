"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/user";

declare global {
  interface Window {
    $crisp?: Array<unknown>;
    CRISP_WEBSITE_ID?: string;
  }
}

const showChat = () => {
  window.$crisp?.push(["do", "chat:show"]);
};

const CRISP_SCRIPT_ID = "crisp-chat-script";
const CRISP_CLIENT_SRC = "https://client.crisp.chat/l.js";
const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID?.trim();
const DEFAULT_CRISP_WEBSITE_ID = "46ae07f6-ad3f-4e32-9af8-1351f64507a5";

const markLoaded = (script: HTMLScriptElement) => {
  script.dataset.loaded = "true";
};

const ensureCrispScript = (onReady?: () => void) => {
  if (typeof document === "undefined") {
    return;
  }

  const existingScript = document.getElementById(CRISP_SCRIPT_ID);
  if (existingScript) {
    if (onReady && existingScript instanceof HTMLScriptElement) {
      if (existingScript.dataset.loaded === "true") {
        onReady();
      } else {
        existingScript.addEventListener(
          "load",
          () => {
            markLoaded(existingScript);
            onReady();
          },
          { once: true },
        );
      }
    }
    return;
  }

  const script = document.createElement("script");
  script.id = CRISP_SCRIPT_ID;
  script.src = CRISP_CLIENT_SRC;
  script.async = true;
  script.addEventListener("load", () => markLoaded(script), { once: true });
  if (onReady) {
    script.addEventListener("load", onReady, { once: true });
  }
  document.head.appendChild(script);
};

const bootstrapCrisp = (websiteId: string, onReady?: () => void) => {
  if (typeof window === "undefined") {
    return;
  }

  // Globals must be defined BEFORE loading the SDK so Crisp can initialize correctly even from cache
  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = websiteId;
  ensureCrispScript(onReady);
};

const hasChatbox = () => {
  if (typeof document === "undefined") {
    return false;
  }
  return Boolean(document.getElementById("crisp-chatbox") || document.querySelector(".crisp-client"));
};

const resetCrisp = (websiteId: string, onReady?: () => void) => {
  if (typeof window === "undefined") {
    return;
  }

  document.getElementById(CRISP_SCRIPT_ID)?.remove();
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = websiteId;
  ensureCrispScript(onReady);
};

const CrispChat = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() ?? "";
  const reinitAttemptedRef = useRef(false);
  const user = useUserStore((state) => state.user);
  const userEmail = useMemo(() => {
    const candidates = [user?.email, user?.usercred].filter((value) => typeof value === "string");
    const isEmailLike = (value: string) => /.+@.+\..+/.test(value);
    const match = candidates.find((value) => isEmailLike(value.trim()));
    return match?.trim();
  }, [user?.email, user?.usercred]);
  const userName = useMemo(() => {
    const first = user?.first_name?.trim();
    const last = user?.last_name?.trim();
    const fullName = [first, last].filter(Boolean).join(" ");
    return fullName || undefined;
  }, [user?.first_name, user?.last_name]);

  useEffect(() => {
    const trimmedWebsiteId = CRISP_WEBSITE_ID?.trim() || DEFAULT_CRISP_WEBSITE_ID;
    if (!trimmedWebsiteId) {
      console.warn("Crisp: website id is missing; chat will not load.");
      return;
    }
    if (!CRISP_WEBSITE_ID?.trim()) {
      console.warn("Crisp: NEXT_PUBLIC_CRISP_WEBSITE_ID is missing; using fallback website id.");
    }

    let timeoutId: number | undefined;
    let verifyTimeoutId: number | undefined;
    reinitAttemptedRef.current = false;

    const setCrispUser = () => {
      if (!userEmail) {
        return;
      }
      window.$crisp = window.$crisp || [];
      window.$crisp.push(["set", "user:email", [userEmail]]);
      if (userName) {
        window.$crisp.push(["set", "user:nickname", [userName]]);
      }
    };

    const ensureVisible = async () => {
      // Bootstrap Crisp client when script is missing (e.g. after remounts)
      bootstrapCrisp(trimmedWebsiteId, showChat);
      setCrispUser();
      showChat();
      timeoutId = window.setTimeout(showChat, 1000);
      verifyTimeoutId = window.setTimeout(() => {
        if (hasChatbox() || reinitAttemptedRef.current) {
          return;
        }
        reinitAttemptedRef.current = true;
        resetCrisp(trimmedWebsiteId, showChat);
        setCrispUser();
        showChat();
      }, 2000);
    };

    void ensureVisible();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      if (verifyTimeoutId !== undefined) {
        window.clearTimeout(verifyTimeoutId);
      }
    };
  }, [pathname, searchKey, userEmail, userName]);

  useEffect(() => {
    if (!userEmail || typeof window === "undefined") {
      return;
    }
    window.$crisp = window.$crisp || [];
    window.$crisp.push(["set", "user:email", [userEmail]]);
    if (userName) {
      window.$crisp.push(["set", "user:nickname", [userName]]);
    }
  }, [userEmail, userName]);

  return null;
};

export default CrispChat;
