const PARTNER_ICON_MAP: Record<string, string> = {
  "arbitrum-orbit": "/assets/images/partners/arbitrum-orbit.png",
  ethereum: "/assets/images/partners/ethereum.svg",
  custom: "/assets/images/partners/custom.svg",
  celestia: "/assets/images/partners/celestia.svg",
  near: "/assets/images/partners/near.svg",
  avail: "/assets/images/partners/avail.svg",
  eigen: "/assets/images/partners/eigen.svg",
  "0g": "/assets/images/partners/0g.svg",
  cero: "/assets/images/partners/cero.svg",
  superbridge: "/assets/images/partners/superbridge.svg",
  rpc: "/assets/images/partners/rpc.svg",
  chainlink: "/assets/images/partners/chainlink.svg",
  pyth: "/assets/images/partners/pyth.svg",
  blockscout: "/assets/images/partners/blockscout.svg",
  chainlens: "/assets/images/partners/chainlens.svg",
  arweave: "/assets/images/partners/arweave.svg",
  filecoin: "/assets/images/partners/filecoin.svg",
  ipfs: "/assets/images/partners/ipfs.svg",
  thirdweb: "/assets/images/partners/thirdweb.svg",
  tracehawk: "/assets/images/partners/tracehawk.png",
  traceye: "/assets/images/partners/traceye.png",
};

const getPartnerIconPath = (partnerKey: string): string => {
  const normalizedKey = partnerKey.toLowerCase();
  return PARTNER_ICON_MAP[normalizedKey] ?? PARTNER_ICON_MAP.custom;
};

export { PARTNER_ICON_MAP, getPartnerIconPath };
