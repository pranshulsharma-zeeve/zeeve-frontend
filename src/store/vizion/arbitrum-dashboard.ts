import { create } from "zustand";

export type ArbitrumDashboard = {
  data: {
    rollUpStatus: {
      totalVerifiedBatches: string;
      lastBatchSequenced: string;
      nextUpdateIn: string;
      protocolVersion: string;
      proofs: string;
      healthCheck: string;
      heartBeat: string;
    };
    financials: {
      batcherBalance: string;
      validatorBalance: string;
      blockGasFee: string;
      transactionGasPrice: string;
      batchGasUsed: string;
    };
    rollUpAnalysis: {
      totalTransactions: string;
      gasUsed: string;
      verifiedSmartContracts: string;
      totalUsers: string;
      transactionSuccessCount: string;
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
  arbitrumDashboard: ArbitrumDashboard | null;
};

type Actions = {
  setArbitrumDashboard: (arbitrumDashboard: ArbitrumDashboard) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  arbitrumDashboard: null,
};

// config store
const useArbitrumDashboardStore = create<State & Actions>((set) => ({
  ...initialState,
  setArbitrumDashboard: (arbitrumDashboard: ArbitrumDashboard) => {
    set({ arbitrumDashboard });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useArbitrumDashboardStore };
