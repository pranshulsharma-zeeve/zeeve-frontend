/* eslint-disable prettier/prettier */
export type WalletRelevantLayer = "L1" | "L2" | "L3";

export type WALLET_INFO = {
  name: string;
  address: string;
  l2Balance?: string;
  l3Balance?: string;
  currency: string;
  relevantFor: WalletRelevantLayer[];
  explorerL2Url?: string;
  explorerL3Url?: string;
};

export type GENERAL_WALLET_INFO = {
  name: string;
  address: string;
  currency: string;
  explorerL2Url: string;
  explorerL3Url: string;
  l2Balance: string;
  l3Balance: string;
  monthlyProjectedSpent: string;
  relevantFor: WalletRelevantLayer[];
};
