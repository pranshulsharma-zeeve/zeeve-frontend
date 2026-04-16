"use client";
import React from "react";
import { IconButton } from "@zeeve-platform/ui";
import Image from "next/image";
import { withBasePath } from "@/utils/helpers";
import { getConfig } from "@/config";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import type { TrackingParams } from "@/utils/tracking";
import { encodeToBase64Url } from "@/utils/base64";
import useAuthService from "@/services/auth/use-auth-service";

const googleLogo = withBasePath("/assets/images/social/google.svg");
const gitHubLogo = withBasePath("/assets/images/social/github.svg");
const appleLogo = withBasePath("/assets/images/social/apple.svg");

type SocialLoginsProps = {
  serviceURL: string | null;
  trackingParams?: TrackingParams;
};

const SocialLogins = ({ serviceURL, trackingParams }: SocialLoginsProps) => {
  const config = getConfig();
  const host = config.url?.external?.auth?.backend ?? "";
  const platformURL = config.url?.host ?? "";
  const { request, url } = useAuthService().oauthLogin();

  const safeDecode = (value: string | null) => {
    if (!value) {
      return null;
    }

    try {
      return decodeURIComponent(value);
    } catch (error) {
      console.error("[SocialLogins] Failed to decode value", value, error);
      return value;
    }
  };

  const buildManageUrl = (segment: "full" | "archive" | "validator") => {
    const relativePath = `/manage/nodes/${segment}/protocols`;
    const resolved = withBasePath(relativePath);
    if (!platformURL) {
      return resolved;
    }
    try {
      const base = platformURL.endsWith("/") ? platformURL : `${platformURL}/`;
      return new URL(resolved, base).toString();
    } catch (error) {
      console.error("[SocialLogins] Failed to resolve manage URL", error);
      return resolved;
    }
  };

  const getBasePath = (url: string) => {
    try {
      const baseOrigin = typeof window !== "undefined" ? window.location.origin : undefined;
      const urlObj = baseOrigin ? new URL(url, baseOrigin) : new URL(url);
      const path = urlObj.pathname.toLowerCase();
      if (path.includes("/manage/nodes/full")) {
        return buildManageUrl("full");
      }
      if (path.includes("/manage/nodes/archive")) {
        return buildManageUrl("archive");
      }
      if (path.includes("/manage/nodes/validator")) {
        return buildManageUrl("validator");
      }
      return urlObj.toString();
    } catch (error) {
      console.error("Invalid URL:", error);
      return url;
    }
  };

  const getFirstSearchParam = (urlObj: URL, keys: string[]) => {
    for (const key of keys) {
      const value = urlObj.searchParams.get(key);
      if (value && value.trim().length > 0) {
        return value.trim();
      }
    }
    return null;
  };

  // Extract base path and encode it
  const basePathSource = serviceURL ?? trackingParams?.sourceUrl ?? "";
  const basePath = basePathSource ? getBasePath(basePathSource) : "";
  const encodedBasePath = basePath ? encodeURIComponent(basePath) : "";

  const handleLogin = async (provider: string) => {
    let utmEncodedString;
    if (serviceURL) {
      const managePathFragments = ["/manage/nodes/full", "/manage/nodes/archive", "/manage/nodes/validator"] as const;
      if (managePathFragments.some((fragment) => serviceURL.includes(fragment))) {
        try {
          localStorage.setItem("serviceURL", serviceURL);
        } catch (storageError) {
          console.warn("[SocialLogins] Unable to persist serviceURL in localStorage", storageError);
        }
      }
    }

    const urlForTracking = trackingParams?.sourceUrl ?? serviceURL ?? null;
    const fallbackParams = (() => {
      if (!urlForTracking) {
        return { utmTitle: null, utmUrl: null, protocolId: null };
      }

      try {
        const urlObj = new URL(urlForTracking);
        return {
          utmTitle: getFirstSearchParam(urlObj, ["utm_title", "utm_medium", "utm_campaign"]),
          utmUrl: getFirstSearchParam(urlObj, ["utm_url", "utm_source"]),
          protocolId: urlObj.searchParams.get("id"),
        };
      } catch (error) {
        console.error("[SocialLogins] Failed to parse tracking URL", urlForTracking, error);
        return { utmTitle: null, utmUrl: null, protocolId: null };
      }
    })();

    const rawUtmTitle = trackingParams?.utmTitle ?? fallbackParams.utmTitle;
    const rawUtmUrl = trackingParams?.utmUrl ?? fallbackParams.utmUrl;
    const protocolId = trackingParams?.protocolId ?? fallbackParams.protocolId;

    const protocol = protocolId ? PROTOCOL_MAPPING[protocolId] : null;

    const decodedUtmUrl = safeDecode(rawUtmUrl);
    const utmTitle = rawUtmTitle ? rawUtmTitle.slice(0, 50) : null;
    const utmUrl = decodedUtmUrl ? decodedUtmUrl.slice(0, 50) : null;

    if (rawUtmTitle || rawUtmUrl || protocol) {
      const utm = {
        utm_source: utmUrl ? utmUrl : "zeeve.io",
        utm_medium: protocol ? protocol.name : utmTitle ? utmTitle : "default",
        SiteTarget: "app.zeeve.io",
      };

      utmEncodedString = encodeToBase64Url(JSON.stringify(utm));
    }

    let loginURL = `${host}/oauth/${provider}`;
    const queryParams = new URLSearchParams();

    if (encodedBasePath && (encodedBasePath.includes("full") || encodedBasePath.includes("archive"))) {
      queryParams.set("serviceURL", encodedBasePath);
    }

    if (utmEncodedString) {
      queryParams.set("utm_info", utmEncodedString);
    }

    const queryString = queryParams.toString();
    if (queryString) {
      loginURL += `?${queryString}`;
    }
    let updatedUrl = `${url}/${provider}/authorize`;
    if (queryString) {
      updatedUrl += `?${queryString}`;
    }
    const response = await request(updatedUrl);
    const data = response?.data;
    if (data?.success && data?.data?.authorization_url) {
      window.open(data.data.authorization_url, "_self");
    }
  };

  return (
    <div className="flex w-full flex-row items-center justify-start gap-4">
      <IconButton
        variant="ghost"
        colorScheme="dark"
        size="medium"
        className="rounded"
        onClick={() => handleLogin("google")}
      >
        <Image src={googleLogo} alt="Google logo" width={30} height={30} />
      </IconButton>

      <IconButton
        variant="ghost"
        colorScheme="dark"
        size="medium"
        className="rounded"
        onClick={() => handleLogin("github")}
      >
        <Image src={gitHubLogo} alt="GitHub logo" width={30} height={30} />
      </IconButton>

      <IconButton
        variant="ghost"
        colorScheme="dark"
        size="medium"
        className="rounded"
        onClick={() => handleLogin("apple")}
      >
        <Image src={appleLogo} alt="Apple logo" width={30} height={30} />
      </IconButton>
    </div>
  );
};

export default SocialLogins;
