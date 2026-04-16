import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getNormalizedApiBackend } from "@/utils/env";

export const runtime = "nodejs";

interface UserInfoResponseData {
  email?: string | null;
  usercred?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

interface UserInfoResponse {
  success?: boolean;
  data?: UserInfoResponseData;
  message?: string;
}

const getUserInfoUrl = () => {
  const apiBase = getNormalizedApiBackend();
  const needsApiPrefix = apiBase.endsWith("/api");
  const path = needsApiPrefix ? "/v1/user-info" : "/api/v1/user-info";
  return `${apiBase}${path}`;
};

const extractBearerToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get("authorization") ?? "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = match[1]?.trim();
  return token ? token : null;
};

const resolveUserEmail = (data?: UserInfoResponseData | null): string | null => {
  const candidate = data?.email ?? data?.usercred ?? "";
  const normalized = candidate.trim().toLowerCase();
  return normalized.length ? normalized : null;
};

export async function GET(request: NextRequest) {
  const secret = process.env.CRISP_TICKET_CENTER_SECRET?.trim();
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID?.trim();

  if (!secret || !websiteId) {
    return NextResponse.json({ message: "Crisp Ticket Center is not configured." }, { status: 500 });
  }

  const token = extractBearerToken(request);
  if (!token) {
    return NextResponse.json({ message: "Missing authorization token." }, { status: 401 });
  }

  let userInfoResponse: Response;
  try {
    userInfoResponse = await fetch(getUserInfoUrl(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Crisp Ticket Center: failed to reach user-info", error);
    return NextResponse.json({ message: "Unable to validate your session." }, { status: 502 });
  }

  if (!userInfoResponse.ok) {
    const status = userInfoResponse.status === 401 || userInfoResponse.status === 403 ? 401 : 502;
    return NextResponse.json({ message: "Unable to validate your session." }, { status });
  }

  let userInfo: UserInfoResponse | null = null;
  try {
    userInfo = (await userInfoResponse.json()) as UserInfoResponse;
  } catch {
    userInfo = null;
  }

  const email = resolveUserEmail(userInfo?.data ?? null);
  if (!email) {
    return NextResponse.json({ message: "Missing user email for ticket access." }, { status: 400 });
  }

  const hmac = createHmac("sha256", secret).update(email).digest("hex");
  const iframeUrl = `https://plugins.crisp.chat/urn:crisp.im:ticket-center:0/tickets/${websiteId}?email=${encodeURIComponent(
    email,
  )}&hmac=${hmac}`;

  return NextResponse.json({ iframeUrl });
}
