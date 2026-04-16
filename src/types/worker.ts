interface Worker {
  id: string;
  peerId: string;
  name: string;
  bond: string;
  createdAt: string;
  storedData: string;
  apr: string;
  version: string;
  totalDelegation: string;
  delegationCount: number;
  stakerApr: string;
  uptime24Hours: string;
  uptime90Days: string;
  totalDelegationRewards: string;
  claimableReward: string;
  queries90Days: string;
  queries24Hours: string;
  servedData24Hours: string;
  servedData90Days: string;
}

interface WorkerQueryResponse {
  workers: Worker[];
}

export type { Worker, WorkerQueryResponse };
