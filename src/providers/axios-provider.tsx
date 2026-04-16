"use client";
import React, { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useRef } from "react";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { clearAccessToken, getStoredAccessToken, storeAccessToken } from "@/utils/auth-token";
import { authAxiosInstance } from "@/utils/auth-axios";
import { withApiBasePath } from "@/constants/api";
import { normalizePathname } from "@/utils/path";

interface AxiosProviderProps extends PropsWithChildren {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backendAxiosRequestConfig?: AxiosRequestConfig<any>;
}

const AxiosContext = createContext<{
  backendAxiosInstance: AxiosInstance;
  setAuthToken: (token: string | null) => void;
} | null>(null);
AxiosContext.displayName = "AxiosContext";
const AxiosContextProvider = AxiosContext.Provider;

const AxiosProvider = (props: AxiosProviderProps) => {
  const { children, backendAxiosRequestConfig } = props;

  const backendAxiosInstanceRef = useRef(
    axios.create({
      withCredentials: true,
      ...(backendAxiosRequestConfig ?? {}),
    }),
  );
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshInFlightRef = useRef<Promise<string | null> | null>(null);
  const scheduleRefreshRef = useRef<(token: string) => void>(() => {});
  const refreshFnRef = useRef<() => Promise<string | null>>(() => Promise.resolve(null));
  const redirectingToLoginRef = useRef(false);

  const redirectToLogin = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loginPath = "/account/login";
    const authRoutes = [
      "/account",
      "/account/login",
      "/account/register",
      "/account/forget",
      "/account/reset",
      "/account/verify-otp",
    ];
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
    const normalizedEnvBasePath = basePath
      ? (basePath.startsWith("/") ? basePath : `/${basePath}`).replace(/\/$/, "")
      : "";
    const basePathCandidates = Array.from(
      new Set([normalizedEnvBasePath, "/platform"].filter((candidate) => candidate)),
    );

    const normalizePath = (path: string | null | undefined) => {
      if (!path) {
        return "/";
      }
      const trimmed = path.replace(/\/+$/, "");
      return trimmed.length > 0 ? trimmed : "/";
    };

    const stripBasePath = (path: string, base: string) => {
      if (!base || base === "/") {
        return path;
      }
      return path.startsWith(base) ? path.slice(base.length) || "/" : path;
    };

    const currentPath = normalizePath(window.location.pathname);
    const normalizedCurrentPath = basePathCandidates.reduce(
      (acc, candidate) => stripBasePath(acc, candidate),
      currentPath,
    );
    const normalizedLoginPath = "/account/login";

    const isAuthRoute = authRoutes.some(
      (route) => normalizedCurrentPath === route || normalizedCurrentPath.startsWith(`${route}/`),
    );

    if (normalizedCurrentPath === normalizedLoginPath || normalizedCurrentPath.startsWith(`${normalizedLoginPath}/`)) {
      return;
    }

    // Avoid bouncing users off active auth pages (e.g., reset) if a refresh fails.
    if (isAuthRoute) {
      return;
    }

    const targetLoginPath = basePath ? `${basePath.replace(/\/$/, "")}${normalizedLoginPath}` : normalizedLoginPath;

    if (redirectingToLoginRef.current) {
      return;
    }
    redirectingToLoginRef.current = true;

    try {
      const loginUrl = new URL(targetLoginPath, window.location.origin);
      loginUrl.searchParams.set("serviceURL", window.location.href);
      window.open(loginUrl.toString(), "_self");
    } catch (navigationError) {
      console.error("[AxiosProvider] Failed to build login redirect URL:", navigationError);
      window.open(targetLoginPath, "_self");
    }
  }, []);

  const decodeJwtExp = (token: string): number | null => {
    const decodeBase64Url = (segment: string): string | null => {
      const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

      const tryBinaryToString = (binary: string) => {
        try {
          return decodeURIComponent(
            Array.from(binary)
              .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
              .join(""),
          );
        } catch {
          return binary;
        }
      };

      if (typeof atob === "function") {
        try {
          return tryBinaryToString(atob(padded));
        } catch {
          // continue to Buffer fallback
        }
      }

      if (typeof Buffer !== "undefined") {
        return Buffer.from(padded, "base64").toString("utf-8");
      }

      return null;
    };

    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const jsonString = decodeBase64Url(parts[1]);
      if (!jsonString) {
        return null;
      }
      const payload = JSON.parse(jsonString) as Record<string, unknown>;
      const exp = payload?.exp;
      return typeof exp === "number" ? exp : null;
    } catch {
      return null;
    }
  };

  const scheduleRefresh = useCallback((token: string) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    const exp = decodeJwtExp(token);
    if (!exp) {
      // fallback: refresh after ~12 minutes if we can't decode exp
      refreshTimeoutRef.current = setTimeout(() => void refreshFnRef.current(), 12 * 60 * 1000);
      return;
    }
    const nowSec = Math.floor(Date.now() / 1000);
    const secondsUntilExpiry = Math.max(exp - nowSec, 0);
    const msUntilRefresh = Math.max((secondsUntilExpiry - 60) * 1000, 5_000); // refresh 60s before expiry (min 5s)
    refreshTimeoutRef.current = setTimeout(() => void refreshFnRef.current(), msUntilRefresh);
  }, []);

  const setAuthToken = useCallback((token: string | null) => {
    if (token) {
      backendAxiosInstanceRef.current.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios.defaults.headers.common.Authorization = `Bearer ${token}`; // also set global axios for stray calls
      storeAccessToken(token);
      // schedule via ref to avoid circular deps
      scheduleRefreshRef.current(token);
    } else {
      delete backendAxiosInstanceRef.current.defaults.headers.common.Authorization;
      delete axios.defaults.headers.common.Authorization;
      clearAccessToken();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    }
  }, []);

  const extractAccessToken = (response: AxiosResponse | undefined): string | null => {
    try {
      if (!response) return null;
      const extractToken = (record: unknown): string | null => {
        if (record && typeof record === "object") {
          const r = record as Record<string, unknown>;
          const possibleKeys = ["access_token", "accessToken", "token", "bearer_token", "bearerToken", "accesstoken"];
          for (const key of possibleKeys) {
            const candidate = r[key];
            if (typeof candidate === "string" && candidate.trim().length > 0) return candidate;
          }
        }
        return null;
      };
      const headerToken = (() => {
        const authHeader =
          (response.headers as Record<string, string | undefined>)?.authorization ??
          (response.headers as Record<string, string | undefined>)?.Authorization;
        if (typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")) {
          return authHeader.slice(7);
        }
        return null;
      })();
      return extractToken(response.data?.data) || extractToken(response.data) || headerToken;
    } catch {
      return null;
    }
  };

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (refreshInFlightRef.current) {
      return refreshInFlightRef.current;
    }
    refreshInFlightRef.current = (async () => {
      try {
        // Try GET /access_token first
        let response: AxiosResponse | undefined;
        try {
          response = await authAxiosInstance.get(withApiBasePath("/access_token"));
        } catch (e) {
          // Fallback to POST /refresh if GET route is unavailable
          response = await authAxiosInstance.post(withApiBasePath("/refresh"), {});
        }
        const token = extractAccessToken(response);
        if (token) {
          setAuthToken(token);
          return token;
        }
        return null;
      } catch {
        // refresh failed; clear token in memory and redirect to login
        setAuthToken(null);
        redirectToLogin();
        return null;
      } finally {
        refreshInFlightRef.current = null;
      }
    })();
    return refreshInFlightRef.current;
  }, [redirectToLogin, setAuthToken]);

  // Bind scheduleRefresh to a stable ref so setAuthToken can call it without circular deps
  useEffect(() => {
    scheduleRefreshRef.current = scheduleRefresh;
  }, [scheduleRefresh]);

  // Keep refreshFnRef pointing to the latest refreshAccessToken implementation
  useEffect(() => {
    refreshFnRef.current = () => refreshAccessToken();
  }, [refreshAccessToken]);

  useEffect(() => {
    const existingToken = getStoredAccessToken();
    const shouldAttemptInitialRefresh = (() => {
      if (existingToken) {
        return false;
      }
      if (typeof window === "undefined") {
        return true;
      }
      try {
        const normalizePath = (path: string) => {
          if (!path || path === "/") {
            return "/";
          }
          const trimmed = path.replace(/\/+$/, "");
          return trimmed.length > 0 ? (trimmed.startsWith("/") ? trimmed : `/${trimmed}`) : "/";
        };
        const normalizedPath = normalizePath(normalizePathname(window.location.pathname));
        const authRoutes = ["/account", "/account/login", "/account/register", "/account/forget", "/account/reset"];
        const loginRoutes = ["/account", "/account/login"];
        const isRouteMatch = (route: string) => {
          const normalizedRoute = normalizePath(route);
          if (normalizedRoute === "/") {
            return normalizedPath === "/";
          }
          return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
        };
        const isAuthRoute = authRoutes.some(isRouteMatch);
        if (!isAuthRoute) {
          return true;
        }
        const isLoginRoute = loginRoutes.some(isRouteMatch);
        return isLoginRoute;
      } catch {
        return true;
      }
    })();

    if (existingToken) {
      setAuthToken(existingToken);
    } else if (shouldAttemptInitialRefresh) {
      // Try initial silent refresh in case a refresh cookie exists
      void refreshAccessToken();
    }
    // keep refresh function ref up to date
    refreshFnRef.current = () => refreshAccessToken();
    // set up response interceptor for 401 -> refresh + retry once
    const instance = backendAxiosInstanceRef.current;
    const resInterceptor = instance.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
        if (status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers = {
              ...(originalRequest.headers ?? {}),
              Authorization: `Bearer ${newToken}`,
            };
            return instance.request(originalRequest);
          }
          // Refresh failed: redirect to login
          redirectToLogin();
        }
        return Promise.reject(error);
      },
    );

    return () => {
      instance.interceptors.response.eject(resInterceptor);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [redirectToLogin, refreshAccessToken, setAuthToken]);

  // Keep global axios baseURL in sync for modules that import axios directly
  useEffect(() => {
    if (backendAxiosRequestConfig?.baseURL) {
      axios.defaults.baseURL = backendAxiosRequestConfig.baseURL;
    }
  }, [backendAxiosRequestConfig?.baseURL]);

  const values = useMemo(() => {
    return {
      backendAxiosInstance: backendAxiosInstanceRef.current,
      setAuthToken,
    };
  }, [setAuthToken]);

  return <AxiosContextProvider value={values}>{children}</AxiosContextProvider>;
};

export { AxiosContext };
export default AxiosProvider;
