import { NextResponse } from "next/server";

type DeleteAccountTicketRequest = {
  userEmail?: string;
  userId?: string | number | null;
  userName?: string | null;
  phoneNumber?: string | null;
  reason?: string | null;
  additionalContext?: string | null;
};

type ZohoDeskConfig = {
  baseUrl: string;
  orgId: string;
  departmentId: string;
};

type TokenCache = {
  token: string;
  expiresAt?: number | null;
};

let cachedZohoToken: TokenCache | null = null;

const getZohoDeskConfig = (): { config?: ZohoDeskConfig; error?: string } => {
  const baseUrl = process.env.ZOHO_DESK_BASE_URL?.replace(/\/$/, "");
  const orgId = process.env.ZOHO_DESK_ORG_ID;
  const departmentId = process.env.ZOHO_DESK_DEPARTMENT_ID;

  const hasStaticToken = Boolean(process.env.ZOHO_DESK_ACCESS_TOKEN?.trim());
  const hasRefreshFlow =
    Boolean(process.env.ZOHO_DESK_REFRESH_TOKEN?.trim()) &&
    Boolean(process.env.ZOHO_DESK_CLIENT_ID?.trim()) &&
    Boolean(process.env.ZOHO_DESK_CLIENT_SECRET?.trim());

  const missing = [
    ["ZOHO_DESK_BASE_URL", baseUrl],
    ["ZOHO_DESK_ORG_ID", orgId],
    ["ZOHO_DESK_DEPARTMENT_ID", departmentId],
    // At least one auth strategy must be configured
    ["ZOHO_DESK_ACCESS_TOKEN or refresh credentials", hasStaticToken || hasRefreshFlow ? "configured" : ""],
  ].filter(([, value]) => !value);

  if (missing.length) {
    const missingKeys = missing.map(([key]) => key).join(", ");
    return {
      error: `Zoho Desk is not configured on the server. Missing: ${missingKeys}`,
    };
  }

  return {
    config: {
      baseUrl: baseUrl as string,
      orgId: orgId as string,
      departmentId: departmentId as string,
    },
  };
};

const getZohoStaticAccessToken = () => process.env.ZOHO_DESK_ACCESS_TOKEN?.trim() || null;

const refreshZohoAccessToken = async (): Promise<TokenCache> => {
  const refreshToken = process.env.ZOHO_DESK_REFRESH_TOKEN?.trim();
  const clientId = process.env.ZOHO_DESK_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOHO_DESK_CLIENT_SECRET?.trim();
  const accountsBaseUrl = process.env.ZOHO_ACCOUNTS_BASE_URL?.replace(/\/$/, "") || "https://accounts.zoho.com";

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error("Missing refresh credentials");
  }

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const tokenResponse = await fetch(`${accountsBaseUrl}/oauth/v2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    throw new Error(`Zoho token refresh failed (${tokenResponse.status}): ${errorBody}`);
  }

  const json = (await tokenResponse.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) {
    throw new Error("Zoho token refresh response missing access_token");
  }

  const expiresInMs = Math.max((json.expires_in ?? 3600) - 60, 60) * 1000;
  const tokenCache: TokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + expiresInMs,
  };

  cachedZohoToken = tokenCache;
  return tokenCache;
};

const getZohoAccessToken = async (): Promise<{ token?: string; error?: string }> => {
  const refreshToken = process.env.ZOHO_DESK_REFRESH_TOKEN?.trim();
  const clientId = process.env.ZOHO_DESK_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOHO_DESK_CLIENT_SECRET?.trim();
  const canRefresh = Boolean(refreshToken && clientId && clientSecret);

  if (!canRefresh) {
    const staticToken = getZohoStaticAccessToken();
    if (staticToken) {
      return { token: staticToken };
    }
    return { error: "Zoho Desk access token is not configured." };
  }

  if (cachedZohoToken?.token && cachedZohoToken.expiresAt && cachedZohoToken.expiresAt > Date.now()) {
    return { token: cachedZohoToken.token };
  }

  try {
    const refreshed = await refreshZohoAccessToken();
    return { token: refreshed.token };
  } catch (error) {
    console.error("Zoho Desk token refresh failed:", error);
    const fallbackToken = getZohoStaticAccessToken();
    if (fallbackToken) {
      return { token: fallbackToken };
    }
    return { error: "Unable to refresh Zoho Desk token. Please check credentials." };
  }
};

const buildDescription = ({ userId, phoneNumber, reason, additionalContext }: DeleteAccountTicketRequest): string => {
  const sections = [
    "A user requested account deletion from the Zeeve platform via the settings page.",
    userId ? `• User ID: ${userId}` : null,
    phoneNumber ? `• Phone: ${phoneNumber}` : null,
    reason ? `• User reason: ${reason}` : null,
    additionalContext ? `• Additional context: ${additionalContext}` : null,
  ].filter(Boolean);

  return sections.join("\n");
};

const buildContact = (userEmail: string, userName?: string | null) => {
  if (!userName) {
    return {
      email: userEmail,
      lastName: userEmail.split("@")[0] ?? "User",
    };
  }

  const [firstName, ...rest] = userName.split(" ").filter(Boolean);
  const lastName = rest.join(" ") || firstName;

  return {
    email: userEmail,
    firstName: firstName || undefined,
    lastName: lastName || userEmail.split("@")[0] || "User",
  };
};

export async function POST(request: Request) {
  let payload: DeleteAccountTicketRequest;

  try {
    payload = (await request.json()) as DeleteAccountTicketRequest;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      { status: 400 },
    );
  }

  if (!payload?.userEmail) {
    return NextResponse.json(
      {
        success: false,
        message: "User email is required to submit a deletion request.",
      },
      { status: 400 },
    );
  }

  const configResult = getZohoDeskConfig();
  const config = configResult.config;
  const configError = configResult.error;

  if (!config || configError) {
    console.error("Delete account ticket misconfiguration:", configError);
    return NextResponse.json(
      {
        success: false,
        message: "Account deletion is temporarily unavailable. Please contact support.",
      },
      { status: 500 },
    );
  }

  const description = buildDescription(payload);
  const ticketBody = {
    departmentId: config.departmentId,
    channel: "Web",
    subject: "Account deletion request",
    description,
    status: "Open",
    priority: "High",
    classification: "Request",
    contact: buildContact(payload.userEmail, payload.userName),
  };

  const accessTokenResult = await getZohoAccessToken();
  if (!accessTokenResult.token) {
    return NextResponse.json(
      {
        success: false,
        message: accessTokenResult.error ?? "Unable to authenticate with Zoho Desk.",
      },
      { status: 500 },
    );
  }

  try {
    const zohoResponse = await fetch(`${config.baseUrl}/tickets`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessTokenResult.token}`,
        orgId: config.orgId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketBody),
    });

    const responseText = await zohoResponse.text();
    let parsedResponse: unknown = null;
    if (responseText) {
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = responseText;
      }
    }

    if (!zohoResponse.ok) {
      console.error("Zoho Desk ticket creation failed:", parsedResponse ?? zohoResponse.statusText);
      return NextResponse.json(
        {
          success: false,
          message: "Unable to create the account deletion ticket. Please try again later.",
          details: typeof parsedResponse === "string" ? undefined : parsedResponse,
        },
        { status: zohoResponse.status >= 400 ? zohoResponse.status : 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: parsedResponse,
      },
      { status: 200 },
    );
  } catch (error_) {
    console.error("Zoho Desk ticket creation encountered an error:", error_);
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error while creating the deletion ticket.",
      },
      { status: 500 },
    );
  }
}
