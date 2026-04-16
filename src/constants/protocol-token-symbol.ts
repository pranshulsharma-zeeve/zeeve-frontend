const PROTOCOL_TOKEN_SYMBOLS: Record<string, string> = {
  Avalanche: "AVAX",
  Cosmos: "ATOM",
  Coreum: "CORE",
  Flow: "FLOW",
  Near: "NEAR",
  Injective: "INJ",
  "Energy Web": "EWT",
  Nillion: "NIL",
  Skale: "SKL",
  Solana: "SOL",
  Subsquid: "SQD",
  Theta: "THETA",
  XDC: "XDC",
  TFUEL: "TFUEL",
};

const normalizeName = (value?: string): string => (value ?? "").trim().toLowerCase();

export const getProtocolTokenSymbol = (protocolName?: string): string => {
  const normalized = normalizeName(protocolName);
  for (const [name, symbol] of Object.entries(PROTOCOL_TOKEN_SYMBOLS)) {
    if (normalizeName(name) === normalized) {
      return symbol;
    }
  }
  return "CORE";
};

export { PROTOCOL_TOKEN_SYMBOLS };
