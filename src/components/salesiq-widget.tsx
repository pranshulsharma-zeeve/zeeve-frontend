"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/user";
import useIsAuthRoute from "@/hooks/use-is-auth-route";

const SALESIQ_MAIN_SCRIPT_ID = "zoho-salesiq-loader";
const SALESIQ_BOOTSTRAP_ID = "zoho-salesiq";
const SALESIQ_WIDGET_URL = process.env.NEXT_PUBLIC_SALESIQ_WIDGET_URL?.trim();

const removeExistingScripts = () => {
  document.getElementById(SALESIQ_MAIN_SCRIPT_ID)?.remove();
  document.getElementById(SALESIQ_BOOTSTRAP_ID)?.remove();
  document.getElementById("zsiqwidget")?.remove();
  document.getElementById("zsiqcustomcontainer")?.remove();
  document.getElementById("siqiframe")?.remove();
};

/** Handles loading Zoho SalesIQ once a user is authenticated. */
const SalesIQWidget = () => {
  const user = useUserStore((state) => state.user);
  const isAuthRoute = useIsAuthRoute();
  const initialized = useRef(false);
  const shouldLoad = !!user && !isAuthRoute && !!SALESIQ_WIDGET_URL;

  useEffect(() => {
    if (user && !isAuthRoute && !SALESIQ_WIDGET_URL) {
      console.warn("NEXT_PUBLIC_SALESIQ_WIDGET_URL is missing; SalesIQ widget will not load.");
    }
  }, [isAuthRoute, user]);

  useEffect(() => {
    if (!shouldLoad) {
      removeExistingScripts();
      initialized.current = false;
      if (typeof window !== "undefined" && (window as any).$zoho?.salesiq) {
        delete (window as any).$zoho.salesiq;
      }
      return;
    }

    if (initialized.current || typeof window === "undefined" || !SALESIQ_WIDGET_URL) {
      return;
    }

    (window as any).$zoho = (window as any).$zoho || {};
    (window as any).$zoho.salesiq = (window as any).$zoho.salesiq || {
      ready: function () {},
    };

    const bootstrapScript = document.createElement("script");
    bootstrapScript.id = SALESIQ_BOOTSTRAP_ID;
    bootstrapScript.type = "text/javascript";
    bootstrapScript.innerHTML = `
      window.$zoho = window.$zoho || {};
      $zoho.salesiq = $zoho.salesiq || { ready: function() {} };
    `;

    const loaderScript = document.createElement("script");
    loaderScript.id = SALESIQ_MAIN_SCRIPT_ID;
    loaderScript.src = SALESIQ_WIDGET_URL;
    loaderScript.defer = true;

    document.body.appendChild(bootstrapScript);
    document.body.appendChild(loaderScript);

    initialized.current = true;
  }, [shouldLoad]);

  return null;
};

export default SalesIQWidget;
