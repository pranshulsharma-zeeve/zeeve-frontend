/**
 * Normalize URL-like env values:
 * - trims whitespace and surrounding quotes
 * - adds https:// if missing
 * - fixes single-slash schemes (https:/example.com -> https://example.com)
 * - removes trailing slash
 * Returns empty string if the value cannot be parsed.
 */
const normalizeUrlEnv = (value?: string | null): string => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";

  const unquoted = trimmed.replace(/^['"]|['"]$/g, "");
  const withScheme = /^https?:\/\//i.test(unquoted) ? unquoted : `https://${unquoted}`;
  const fixedSlashes = withScheme.replace(/^(https?):\/(?!\/)/i, "$1://");

  try {
    const normalized = new URL(fixedSlashes);
    return normalized.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
};

const isDevLikeUrl = (url: string): boolean => {
  if (!url) return false;
  const markers = ["localhost", "127.0.0.1", "odoo-dev.zeeve.net", "dev.zeeve.net"];
  return markers.some((marker) => url.includes(marker));
};

/**
 * Resolve the backend API base URL using NEXT_PUBLIC_API_URL,
 * falling back to NEXT_PUBLIC_HOST + /api if needed.
 * In production we require a non-dev URL unless the declared environment is dev/local.
 */
const getNormalizedApiBackend = (): string => {
  const apiUrl = normalizeUrlEnv(process.env.NEXT_PUBLIC_API_URL);
  const host = normalizeUrlEnv(process.env.NEXT_PUBLIC_HOST);
  const candidate = apiUrl || (host ? `${host}/api` : "");
  const environment = (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "local").trim().toLowerCase();
  const allowDevBackend = environment === "dev" || environment === "local";
  const shouldEnforceProdBackend = process.env.NODE_ENV === "production" && !allowDevBackend;

  if (shouldEnforceProdBackend) {
    if (!candidate) {
      throw new Error("Missing NEXT_PUBLIC_API_URL (or NEXT_PUBLIC_HOST). Set a production API URL before building.");
    }
    if (isDevLikeUrl(candidate)) {
      throw new Error(
        `Refusing to build production bundle with a dev API URL (${candidate}). Set NEXT_PUBLIC_API_URL to the prod backend.`,
      );
    }
  }

  return candidate;
};

export { normalizeUrlEnv, getNormalizedApiBackend };
