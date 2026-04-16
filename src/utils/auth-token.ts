import { AUTH_PRESENCE_COOKIE } from "@/constants/auth";

const ACCESS_TOKEN_STORAGE_KEY = "platform_access_token";

/**
 * In-memory access token storage. Never persist to local/session storage.
 * We still clear any old localStorage token if present, but do not write to it.
 */
let accessTokenMemory: string | null = null;
type TokenListener = (token: string | null) => void;
const tokenListeners: TokenListener[] = [];

const isBrowser = () => typeof window !== "undefined";

const setAuthPresenceCookie = () => {
  if (!isBrowser() || typeof document === "undefined") {
    return;
  }

  try {
    document.cookie = `${AUTH_PRESENCE_COOKIE}=1; path=/; SameSite=Lax`;
  } catch (error) {
    console.warn("[AuthToken] Failed to set auth presence cookie", error);
  }
};

const clearAuthPresenceCookie = () => {
  if (!isBrowser() || typeof document === "undefined") {
    return;
  }

  try {
    document.cookie = `${AUTH_PRESENCE_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
  } catch (error) {
    console.warn("[AuthToken] Failed to clear auth presence cookie", error);
  }
};

const storeAccessToken = (token: string) => {
  accessTokenMemory = token ?? null;
  // notify listeners
  for (const fn of tokenListeners) {
    try {
      fn(accessTokenMemory);
    } catch {
      // ignore listener errors
    }
  }
  // ensure we don't keep any legacy token persisted in localStorage
  if (isBrowser() && typeof window.localStorage !== "undefined") {
    try {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      // no-op
    }
  }
  setAuthPresenceCookie();
};

const clearAccessToken = () => {
  accessTokenMemory = null;
  for (const fn of tokenListeners) {
    try {
      fn(accessTokenMemory);
    } catch {
      // ignore listener errors
    }
  }
  if (isBrowser() && typeof window.localStorage !== "undefined") {
    try {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      // no-op
    }
  }
  clearAuthPresenceCookie();
};

const getStoredAccessToken = (): string | null => {
  return accessTokenMemory;
};

export { ACCESS_TOKEN_STORAGE_KEY, storeAccessToken, clearAccessToken, getStoredAccessToken };
/** Subscribe to access token changes (in-memory). Returns unsubscribe function. */
export const onAccessTokenChange = (listener: TokenListener) => {
  tokenListeners.push(listener);
  return () => {
    const idx = tokenListeners.indexOf(listener);
    if (idx >= 0) tokenListeners.splice(idx, 1);
  };
};
