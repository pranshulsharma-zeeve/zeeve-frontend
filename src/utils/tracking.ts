export type TrackingParams = {
  utmTitle: string | null;
  utmUrl: string | null;
  protocolId: string | null;
  sourceUrl: string | null;
};

type ParsedParams = {
  utmTitle: string | null;
  utmUrl: string | null;
  protocolId: string | null;
};

const decodeValue = (value: string | null): string | null => {
  if (!value) {
    return null;
  }
  try {
    return decodeURIComponent(value);
  } catch (error) {
    console.error("[Tracking] Failed to decode value", value, error);
    return value;
  }
};

const getFirstParam = (urlObj: URL, candidates: string[]): string | null => {
  for (const key of candidates) {
    const value = urlObj.searchParams.get(key);
    if (value && value.trim().length > 0) {
      return decodeValue(value.trim());
    }
  }
  return null;
};

const parseParams = (rawUrl: string | null): ParsedParams => {
  if (!rawUrl) {
    return { utmTitle: null, utmUrl: null, protocolId: null };
  }

  try {
    const urlObj = new URL(rawUrl);
    return {
      utmTitle: getFirstParam(urlObj, ["utm_title", "utm_medium", "utm_campaign"]),
      utmUrl: getFirstParam(urlObj, ["utm_url", "utm_source"]),
      protocolId:
        urlObj.searchParams.get("id") ??
        urlObj.searchParams.get("protocolId") ??
        urlObj.searchParams.get("protocol_id"),
    };
  } catch (error) {
    console.error("[Tracking] Failed to parse URL", rawUrl, error);
    return { utmTitle: null, utmUrl: null, protocolId: null };
  }
};

const extractServiceUrlParam = (rawUrl: string | null): string | null => {
  if (!rawUrl) {
    return null;
  }

  try {
    const urlObj = new URL(rawUrl);
    const candidate =
      urlObj.searchParams.get("serviceURL") ??
      urlObj.searchParams.get("service_url") ??
      urlObj.searchParams.get("redirect") ??
      urlObj.searchParams.get("redirectTo") ??
      urlObj.searchParams.get("redirect_to");

    if (!candidate) {
      return null;
    }

    return decodeValue(candidate);
  } catch (error) {
    console.error("[Tracking] Failed to extract serviceURL from URL", rawUrl, error);
    return null;
  }
};

export const resolveTrackingDetails = (
  referrer?: string | null,
  currentHref?: string | null,
): { serviceURL: string | null; trackingParams: TrackingParams } => {
  const normalizedReferrer = referrer && referrer.trim().length > 0 ? referrer : null;
  const normalizedCurrent = currentHref && currentHref.trim().length > 0 ? currentHref : null;

  const refParams = parseParams(normalizedReferrer);
  const currentParams = parseParams(normalizedCurrent);

  const hasCurrentUtm = Boolean(currentParams.utmTitle || currentParams.utmUrl);
  const serviceUrlFromCurrent = extractServiceUrlParam(normalizedCurrent);
  const serviceUrlFromReferrer = extractServiceUrlParam(normalizedReferrer);

  const selectedUrl = hasCurrentUtm ? normalizedCurrent : (normalizedReferrer ?? normalizedCurrent);
  const selectedParams = hasCurrentUtm ? currentParams : refParams;

  const resolvedProtocolId = selectedParams.protocolId ?? currentParams.protocolId ?? refParams.protocolId ?? null;

  return {
    serviceURL: serviceUrlFromCurrent ?? serviceUrlFromReferrer ?? normalizedReferrer ?? null,
    trackingParams: {
      utmTitle: selectedParams.utmTitle,
      utmUrl: selectedParams.utmUrl,
      protocolId: resolvedProtocolId,
      sourceUrl: selectedUrl ?? normalizedReferrer ?? normalizedCurrent ?? null,
    },
  };
};
