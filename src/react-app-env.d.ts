/// <reference types="react-scripts" />
import { Window as KeplrWindow, OfflineAminoSigner } from "@keplr-wallet/types";
import {} from "@cosmjs/stargate";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";

declare global {
  interface Window extends KeplrWindow {
    getOfflineSigner?: (string) => OfflineAminoSigner & OfflineDirectSigner;
    cosmostation: {
      providers: { keplr: Keplr };
    };
    leap?: Keplr;
  }
}
