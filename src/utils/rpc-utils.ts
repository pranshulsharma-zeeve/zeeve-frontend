const normalizeHttpUrl = (value?: string | string[]) => {
  if (!value) return undefined;
  const resolved = Array.isArray(value) ? value.find((entry) => typeof entry === "string" && entry.trim()) : value;
  if (!resolved) return undefined;
  const trimmed = resolved.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const formatWeiToEther = (hexValue: string): string | undefined => {
  try {
    const normalized = hexValue ? (hexValue.startsWith("0x") ? hexValue : `0x${hexValue}`) : "0x0";
    const wei = BigInt(normalized);
    const divisor = 10n ** 18n;
    const whole = wei / divisor;
    const fraction = wei % divisor;
    if (fraction === 0n) return whole.toString();
    const fractionText = fraction.toString().padStart(18, "0").replace(/0+$/, "");
    return `${whole.toString()}.${fractionText || "0"}`;
  } catch {
    return undefined;
  }
};

const fetchBalanceFromRpc = async (rpcUrl: string, address: string): Promise<string | undefined> => {
  try {
    const response = await fetch("/api/rpc/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rpcUrl, address }),
    });
    if (!response.ok) return undefined;
    const payload = (await response.json()) as { balance?: string | number };
    if (payload?.balance !== undefined && payload?.balance !== null) {
      return String(payload.balance);
    }
  } catch {
    return undefined;
  }
  return undefined;
};

export { normalizeHttpUrl, fetchBalanceFromRpc, formatWeiToEther };
