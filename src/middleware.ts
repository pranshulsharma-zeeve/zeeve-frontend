import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_PRESENCE_COOKIE } from "@/constants/auth";

const normalizePathname = (pathname: string): string => {
  const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalizedEnvBasePath = rawBasePath
    ? (rawBasePath.startsWith("/") ? rawBasePath : `/${rawBasePath}`).replace(/\/$/, "")
    : "";
  const basePathCandidates = Array.from(
    new Set([normalizedEnvBasePath, "/platform"].filter((candidate) => candidate && candidate !== "/")),
  );

  return basePathCandidates.reduce<string>((current, base) => {
    if (!current.startsWith(base)) {
      return current;
    }
    const stripped = current.slice(base.length);
    if (!stripped) {
      return "/";
    }
    return stripped.startsWith("/") ? stripped : `/${stripped}`;
  }, pathname);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPathname = normalizePathname(pathname);

  const acceptHeader = request.headers.get("accept") ?? "";
  const isHtmlRequest = acceptHeader.includes("text/html");

  if (!isHtmlRequest) {
    return NextResponse.next();
  }

  const refreshTokenCookie =
    request.cookies.get("refresh_token")?.value ??
    request.cookies.get("refreshToken")?.value ??
    request.cookies.get("REFRESH_TOKEN")?.value ??
    null;
  const presenceCookie = request.cookies.get(AUTH_PRESENCE_COOKIE)?.value ?? null;
  const isAuthenticated = Boolean(refreshTokenCookie || presenceCookie);

  const accountBasePath = "/account";
  const authBasePaths = [accountBasePath];
  const isAuthPath = authBasePaths.some(
    (basePath) => normalizedPathname === basePath || normalizedPathname.startsWith(`${basePath}/`),
  );

  const loginPath = `${accountBasePath}/login`;
  const platformRoot = "/";

  const rewrites: Array<[string, string]> = [
    ["/login", loginPath],
    ["/register", `${accountBasePath}/register`],
    ["/forget-pass", `${accountBasePath}/forget`],
    ["/forget", `${accountBasePath}/forget`],
    ["/forgot", `${accountBasePath}/forget`],
    [`${accountBasePath}/forgot`, `${accountBasePath}/forget`],
    ["/reset-password", `${accountBasePath}/reset`],
    ["/reset", `${accountBasePath}/reset`],
    [`${accountBasePath}/reset-password`, `${accountBasePath}/reset`],
    ["/verify-otp", `${accountBasePath}/register`],
    [`${accountBasePath}/verify-otp`, `${accountBasePath}/register`],
    [`${accountBasePath}/login`, loginPath],
    [`${accountBasePath}/register`, `${accountBasePath}/register`],
    [`${accountBasePath}/forget`, `${accountBasePath}/forget`],
    [`${accountBasePath}/reset`, `${accountBasePath}/reset`],
    [accountBasePath, accountBasePath],
  ];
  const publicRoutes = rewrites.map(([publicRoute]) => publicRoute);

  // Root handling: if unauthenticated, send to login; otherwise allow dashboard
  if (normalizedPathname === "/") {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = loginPath;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const isPublicAliasPath =
      publicRoutes.some(
        (publicRoute) => normalizedPathname === publicRoute || normalizedPathname.startsWith(`${publicRoute}/`),
      ) || authBasePaths.some((basePath) => normalizedPathname === basePath);

    if (!isAuthPath && !isPublicAliasPath) {
      const url = request.nextUrl.clone();
      const originalTarget = request.nextUrl.clone();
      url.pathname = loginPath;
      url.search = "";
      try {
        url.searchParams.set("serviceURL", originalTarget.toString());
      } catch {
        const fallbackTarget = `${originalTarget.pathname}${originalTarget.search}`;
        url.searchParams.set("serviceURL", fallbackTarget);
      }
      return NextResponse.redirect(url);
    }
  }

  if (isAuthenticated) {
    if (isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = platformRoot;
      return NextResponse.redirect(url);
    }
  }

  for (const [publicRoute, targetRoute] of rewrites) {
    if (normalizedPathname === publicRoute || normalizedPathname.startsWith(`${publicRoute}/`)) {
      const suffix = normalizedPathname.slice(publicRoute.length);
      const normalizedSuffix = suffix.startsWith("/") ? suffix : suffix ? `/${suffix}` : "";
      const destination = `${targetRoute}${normalizedSuffix}`.replace(/\/{2,}/g, "/");

      if (normalizedPathname !== destination) {
        const url = request.nextUrl.clone();
        url.pathname = destination;
        // For public aliases like "/login" → redirect so the URL shows "/account/login"
        const shouldRedirect = !publicRoute.startsWith(accountBasePath);
        return shouldRedirect ? NextResponse.redirect(url) : NextResponse.rewrite(url);
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon\\.ico).*)"],
};
