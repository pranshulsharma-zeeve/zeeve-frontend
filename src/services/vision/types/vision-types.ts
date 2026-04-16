interface Chain {
  l1Supported: string;
  rpc: string;
  l1ContractAddress: string;
  blockTime: string;
  explorer: string;
  daSupported: string;
  docs: string;
  rollupSupported: [];
}

interface SequenceInfo {
  sequenceNumber: number;
  publisher: string;
  batchCount: number;
  timestamp: string;
  url: string;
}

interface BatchesInfo {
  rollupId: string;
  batchNumber: string;
  transactions: string;
  sequenceNumber: number;
  timestamp: string;
  url: string;
}

interface Validator {
  totalValidators: number;
  totalStackedAmount: string;
  rewardsPerBlock: string;
  monthlyRewards: string;
  currentTokensSupply: string;
  rollupSubscriptionCost: string;
}

interface Rollups {
  name: string;
  chainId: string;
  stack: string;
  token: string;
  explorer: string;
  website: string;
}

interface Chart {
  period: string;
  total_transactions: string;
}
interface BlockStatus {
  rollupsRegistered: number;
  totalTransactionSequenced: number;
  blockCount: number;
  totalBatchesGenerated: number;
  globalSequenceCount: number;
}

export type { Chain, Validator, Rollups, BlockStatus, Chart, BatchesInfo, SequenceInfo };
