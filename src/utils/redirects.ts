const STRIPE_DOMAIN = "stripe.com";

const isStripeHost = (hostname: string) => hostname === STRIPE_DOMAIN || hostname.endsWith(`.${STRIPE_DOMAIN}`);

export const isStripeHttpsUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && isStripeHost(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
};

export const redirectToStripeUrl = (url: string): boolean => {
  if (typeof window === "undefined") return false;
  if (!isStripeHttpsUrl(url)) return false;
  window.location.assign(url);
  return true;
};
