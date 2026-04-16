import { create } from "zustand";

export type ZksyncDashboard = {
  data: {
    rollUpStatus: {
      totalVerifiedBatches: string;
      // lastVerifiedBatch: string;
      nextUpdateIn: string;
      // timeSinceLastBatch: string;
      lastVerfiedTime: string;
      currentBatchNumber: string;
      totalSequencedBatches: string;
      timeSinceLastSequencedBatch: string;
      protocolVersion: string;
      proofs: string;
      healthCheck: string;
      heartBeat: string;
    };
    financials: {
      // rewardPerBatch: number;
      // batchFee: string;
      // transactionFeeCollected: number;
      // bridgeDepositCount: string;
      sequenceBalance: string;
      // gasTrend: number;
      aggregaterBalance: string;
      sequenceAddress: string;
      aggregaterAddress: string;
      minL2GasPrice: string | number;
      feeAccountBalanceL2: string | number;
      gasUsed: string | number;
      gasInfo: {
        slow: number;
        average: number;
        fast: number;
      };
    };
    rollUpAnalysis: {
      totalTransactions: string;
      gasUsed: string | number;
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
    additionalInfo: {
      rpcSslDaysLeft: string;
      clientVersion: string;
      clientName: string;
      l1BlockHeight: string;
      rollupBlockHeight: string;
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
  gasTracker: string;
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
  zksyncDashboard: ZksyncDashboard | null;
};

type Actions = {
  setZksyncDashboard: (zksyncDashboard: ZksyncDashboard) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  zksyncDashboard: null,
};

// config store
const useZksyncDashboardStore = create<State & Actions>((set) => ({
  ...initialState,
  setZksyncDashboard: (zksyncDashboard: ZksyncDashboard) => {
    set({ zksyncDashboard });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useZksyncDashboardStore };
