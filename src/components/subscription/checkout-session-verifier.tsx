"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import usePlatformService from "@/services/platform/use-platform-service";
import ZeeveLoader from "@/components/shared/ZeeveLoader";

const STORAGE_PREFIX = "checkout_session_verified:";

const useCheckoutSessionVerification = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const {
    subscription: { verifyCheckoutSession },
  } = usePlatformService();
  const { request } = verifyCheckoutSession();

  const shouldVerify = status === "success" && !!sessionId;
  const storageKey = useMemo(() => (sessionId ? `${STORAGE_PREFIX}${sessionId}` : ""), [sessionId]);
  const storageValue = typeof window !== "undefined" && storageKey ? window.sessionStorage.getItem(storageKey) : null;
  const hasVerified = storageValue === "done";
  const isBlocking = shouldVerify && !hasVerified;

  useEffect(() => {
    if (!shouldVerify || !sessionId || !storageKey) return;
    if (typeof window === "undefined") return;

    const currentValue = window.sessionStorage.getItem(storageKey);
    if (currentValue === "done" || currentValue === "pending") return;

    window.sessionStorage.setItem(storageKey, "pending");

    const runVerification = async () => {
      try {
        // Call verify checkout session API
        const response = await request("", { session_id: sessionId });

        if (response.data.success) {
          setVerificationStatus("success");

          // Wait longer to ensure backend DB is fully synced across all tables
          // The verify API updates the node state, subscription list needs more time to reflect this
          // Increased to 10s to ensure Odoo database transaction is committed and readable
          await new Promise((resolve) => setTimeout(resolve, 10000));

          window.sessionStorage.setItem(storageKey, "done");

          // Hard reload to bypass all caches (browser, service worker, SWR)
          // This ensures fresh API calls are made to the backend
          window.location.reload();
        } else {
          setVerificationStatus("error");
          window.sessionStorage.setItem(storageKey, "done");

          // Even on error, reload after delay so user can see error message
          await new Promise((resolve) => setTimeout(resolve, 2000));
          window.location.reload();
        }
      } catch (error) {
        setVerificationStatus("error");
        window.sessionStorage.setItem(storageKey, "done");

        // Reload even on error
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.reload();
      }
    };

    void runVerification();
  }, [shouldVerify, sessionId, storageKey, request]);

  return { isBlocking, verificationStatus };
};

const CheckoutSessionBlockingScreen = ({ status }: { status: "pending" | "success" | "error" }) => {
  const messages = {
    pending: "Verifying payment...",
    success: "Payment verified! Setting up your node...",
    error: "Verifying payment... Please wait.",
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <ZeeveLoader label={messages[status]} />
    </div>
  );
};

const CheckoutSessionVerifier = () => {
  const { isBlocking, verificationStatus } = useCheckoutSessionVerification();

  if (!isBlocking) {
    return null;
  }

  return <CheckoutSessionBlockingScreen status={verificationStatus} />;
};

export { CheckoutSessionBlockingScreen, useCheckoutSessionVerification };
export default CheckoutSessionVerifier;
