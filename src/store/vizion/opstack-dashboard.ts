import { create } from "zustand";

export type OpStackDashboard = {
  data: {
    rollUpStatus: {
      totalConfirmedBatches: string;
      totalPublishedBatches: string;
      nextUpdateIn: string;
      protocolVersion: string;
      proofs: string;
      healthCheck: string;
      heartBeat: string;
    };
    financials: {
      batcherBalance: string;
      proposerBalance: string;
      baseFee: string;
      blobBaseFee: string;
      totalBatcherFees: string;
    };
    rollUpAnalysis: {
      totalTransactions: string;
      avgGasPrice: number;
      verifiedSmartContracts: string;
      totalUsers: string;
    };
    chainData: {
      L1: ChainInfo;
      RollUp: ChainInfo;
    };
    transactionData: {
      RollUp: {
        transactionPerBlock: string;
        transactionGasUsed: string;
      };
    };
    counters: CountersData;
  };
};

type ChainInfo = {
  totalBlock: string;
  avgBlocktime: number;
  gasTracker: string;
  totalTransaction: string;
  walletAddress: string;
  latestBlock: string | null;
  relativeLinks: RelativeLink[];
};

export interface CountersData {
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
}

type RelativeLink = {
  name: string;
  url: string;
};

// types
type State = {
  opStackDashboard: OpStackDashboard | null;
};

type Actions = {
  setOpStackDashboard: (opStackDashboard: OpStackDashboard) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  opStackDashboard: null,
};

// config store
const useOpStackDashboardStore = create<State & Actions>((set) => ({
  ...initialState,
  setOpStackDashboard: (opStackDashboard: OpStackDashboard) => {
    set({ opStackDashboard });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useOpStackDashboardStore };
