"use client";

import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import ROUTES from "@/routes";

const normalizeBasePath = (path?: string) => {
  if (!path) return "";
  const prefixed = path.startsWith("/") ? path : `/${path}`;
  return prefixed.replace(/\/$/, "");
};

/** Returns true when the active route belongs to the auth module. */
const useIsAuthRoute = () => {
  const pathname = usePathname();
  const normalizedEnvBasePath = useMemo(() => normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH), []);

  const basePathCandidates = useMemo(
    () => Array.from(new Set([normalizedEnvBasePath, "/platform"].filter((path) => path && path !== "/"))),
    [normalizedEnvBasePath],
  );

  const stripBasePath = useCallback((path: string, basePath: string) => {
    if (!basePath) return path;
    return path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
  }, []);

  const normalizedPath = useMemo(() => {
    return basePathCandidates.reduce<string>((currentPath, basePath) => stripBasePath(currentPath, basePath), pathname);
  }, [basePathCandidates, pathname, stripBasePath]);

  const authRoutes = useMemo(
    () =>
      [
        ROUTES.AUTH.PAGE.ROOT,
        ROUTES.AUTH.PAGE.LOGIN,
        ROUTES.AUTH.PAGE.REGISTER,
        ROUTES.AUTH.PAGE.FORGOT_PASSWORD,
        ROUTES.AUTH.PAGE.RESET_PASSWORD,
        ROUTES.AUTH.PAGE.VERIFY_OTP,
      ] as const,
    [],
  );

  return useMemo(
    () => authRoutes.some((route) => normalizedPath === route || normalizedPath.startsWith(`${route}/`)),
    [authRoutes, normalizedPath],
  );
};

export default useIsAuthRoute;
