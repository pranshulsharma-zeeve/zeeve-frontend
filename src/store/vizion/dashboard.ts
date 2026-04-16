import { create } from "zustand";

export type Dashboard = {
  data: {
    rollUpStatus: {
      totalVerifiedBatches: string;
      lastVerifiedBatch: string;
      nextUpdateIn: string;
      timeSinceLastBatch: string;
      lastVerfiedTime: string;
    };
    financials: {
      rewardPerBatch: number;
      batchFee: string;
      transactionFeeCollected: number;
      bridgeDepositCount: string;
      sequenceBalance: string;
      gasTrend: number;
      aggregaterBalance: string;
    };
    rollUpAnalysis: {
      totalTransactions: string;
      gasUsed: number;
      verifiedSmartContracts: string;
      totalUsers: string;
    };
    chainData: {
      L1: ChainInfo;
      RollUp: ChainInfo;
    };
    transactionData: {
      L1: TransactionInfo;
      RollUp: TransactionInfo;
    };
    counters: {
      averageBlockTime: string;
      completedTxns: string;
      lastNewContracts: string;
      lastNewVerifiedContracts: string;
      totalAccounts: string;
      totalAddresses: string;
      totalBlocks: string;
      totalContracts: string;
      totalNativeCoinTransfers: string;
      totalTokens: string;
      totalTxns: string;
      totalVerifiedContracts: string;
      newTxns24h: string;
      pendingTxns30m: string;
      txnsFee24h: string;
      averageTxnFee24h: string;
      relativeLinks: RelativeLink[];
    };
  };
};

type ChainInfo = {
  totalBlock: string;
  avgBlocktime: number;
  gasTracker: number;
  totalTransaction: string;
  walletAddress: string;
  latestBlock: string | null;
  relativeLinks: RelativeLink[];
};

type RelativeLink = {
  name: string;
  url: string;
};

type TransactionInfo = {
  transactionGasLimit: number;
  gasLimitLastCheck: string;
  transactionValue: number;
  transactionCost: number;
  gasPrice: number;
  latestBlock: string;
};

// types
type State = {
  dashboard: Dashboard | null;
};

type Actions = {
  setDashboard: (dashboard: Dashboard) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  dashboard: null,
};

// config store
const useDashboardStore = create<State & Actions>((set) => ({
  ...initialState,
  setDashboard: (dashboard: Dashboard) => {
    set({ dashboard });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useDashboardStore };
