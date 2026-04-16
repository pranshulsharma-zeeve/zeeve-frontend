// Theta Transaction Types

export type ThetaTransactionType = 0 | 2 | 8 | 9;

export interface ThetaCoins {
  thetawei: string;
  tfuelwei: string;
}

export interface ThetaAddress {
  address: string;
  coins: ThetaCoins;
  sequence?: string;
  signature?: string;
}

export interface ThetaOutput {
  address: string;
  coins: ThetaCoins;
}

// Type 0 (Coinbase) transaction data
export interface ThetaCoinbaseData {
  proposer: ThetaAddress;
  outputs: ThetaOutput[];
  block_height: string;
}

// Type 2 (Transfer), Type 8 (Deposit Stake), Type 9 (Withdraw Stake) transaction data
export interface ThetaTransferData {
  fee: ThetaCoins;
  source: ThetaAddress;
  holder?: ThetaAddress;
  purpose?: number;
  BlsPubkey?: Record<string, unknown>;
  BlsPop?: Record<string, unknown>;
  HolderSig?: string;
  inputs?: ThetaAddress[];
  outputs?: ThetaOutput[];
}

export interface ThetaTransaction {
  _id: string;
  block_height: string;
  data: ThetaCoinbaseData | ThetaTransferData;
  eth_tx_hash: string;
  hash: string;
  number: number;
  receipt: unknown | null;
  status: string;
  timestamp: string;
  type: ThetaTransactionType;
}

export interface ThetaTransactionsData {
  type: "account_tx_list";
  body: ThetaTransaction[];
  totalPageNumber: number;
  currentPageNumber: number;
}

export interface ThetaTransactionsResponse {
  success: boolean;
  message: string;
  data: ThetaTransactionsData;
}

export interface ThetaTransactionFilters {
  type: number;
  pageNumber: number;
  limitNumber: number;
  isEqualType: boolean;
  types: string[];
}

export const THETA_TRANSACTION_TYPE_LABELS: Record<ThetaTransactionType, string> = {
  0: "Coinbase",
  2: "Transfer",
  8: "Deposit Stake",
  9: "Withdraw Stake",
  //   10: "Stake Deposit/Withdrawal"
};

export const DEFAULT_THETA_TRANSACTION_TYPES = ["0", "2", "8", "9"];
