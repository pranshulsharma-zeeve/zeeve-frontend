/**
 * Encode a string to URL-safe base64.
 */
const encodeToBase64Url = (value: string): string => {
  const encodeBase64 = (input: string): string => {
    if (typeof globalThis !== "undefined" && typeof globalThis.Buffer !== "undefined") {
      return globalThis.Buffer.from(input, "utf-8").toString("base64");
    }

    if (typeof window !== "undefined" && typeof window.btoa === "function") {
      const binary = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
        String.fromCharCode(Number.parseInt(p1, 16)),
      );
      return window.btoa(binary);
    }

    return "";
  };

  const base64 = encodeBase64(value);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export { encodeToBase64Url };
