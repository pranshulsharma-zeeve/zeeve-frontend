import type {
  InfrastructureHealthReport,
  HealthStatus,
  ReportRange,
  RpcFleetReport,
  RpcNodeReport,
  ValidatorFleetReport,
  ValidatorNodeReport,
} from "@/types/reporting";

const weeklyDates = ["Jan 19", "Jan 20", "Jan 21", "Jan 22", "Jan 23", "Jan 24", "Jan 25"];
const monthlyDates = ["Dec 29", "Jan 5", "Jan 12", "Jan 19", "Jan 26"];

const buildTrend = (range: ReportRange, values: number[], key: string) => {
  const labels = range === "monthly" ? monthlyDates : weeklyDates;
  return labels.map((label, index) => ({ date: label, [key]: values[index] ?? values[values.length - 1] }));
};

const buildMultiTrend = (range: ReportRange, entries: Array<{ key: string; values: number[] }>) => {
  const labels = range === "monthly" ? monthlyDates : weeklyDates;
  return labels.map((label, index) => {
    const row: Record<string, string | number> = { date: label };
    entries.forEach((entry) => {
      row[entry.key] = entry.values[index] ?? entry.values[entry.values.length - 1];
    });
    return row;
  });
};

const buildMeta = (range: ReportRange) => ({
  accountId: "acc_001",
  accountName: "Acme Labs",
  periodStart: range === "monthly" ? "2025-12-29" : "2026-01-19",
  periodEnd: range === "monthly" ? "2026-01-25" : "2026-01-25",
  generatedAt: "2026-01-26T08:30:00Z",
  range,
  timezone: "UTC",
});

const rpcNodes = [
  {
    nodeId: "rpc-001",
    nodeName: "RPC-Primary",
    region: "US East",
    network: "Ethereum",
    status: "good" as HealthStatus,
    uptimePct: 99.6,
    uptimeDeltaPct: 0.3,
    latencyMs: 120,
    latencyDeltaPct: -6.1,
    requestCount: 820000,
    requestDeltaPct: 6.8,
    errorRatePct: 0.08,
    errorRateDeltaPct: -0.02,
    incidents: 0,
  },
  {
    nodeId: "rpc-002",
    nodeName: "RPC-Backup",
    region: "EU West",
    network: "Ethereum",
    status: "warning" as HealthStatus,
    uptimePct: 98.9,
    uptimeDeltaPct: -0.4,
    latencyMs: 175,
    latencyDeltaPct: 4.2,
    requestCount: 430000,
    requestDeltaPct: 2.1,
    errorRatePct: 0.2,
    errorRateDeltaPct: 0.04,
    incidents: 1,
  },
];

const validatorNodes = [
  {
    nodeId: "val-001",
    nodeName: "Validator-Alpha",
    network: "Cosmos",
    status: "good" as HealthStatus,
    uptimePct: 99.1,
    uptimeDeltaPct: 0.2,
    stake: 725000,
    stakeDeltaPct: 1.8,
    rewards: 104.5,
    rewardsDeltaPct: 5.4,
    delegators: 190,
    delegatorsDeltaPct: 4.2,
    aprPct: 8.8,
    aprDeltaPct: 0.3,
    missedBlocks: 6,
    jailed: false,
  },
  {
    nodeId: "val-002",
    nodeName: "Validator-Beta",
    network: "Cosmos",
    status: "good" as HealthStatus,
    uptimePct: 98.6,
    uptimeDeltaPct: -0.1,
    stake: 525000,
    stakeDeltaPct: 1.1,
    rewards: 79.7,
    rewardsDeltaPct: 3.6,
    delegators: 122,
    delegatorsDeltaPct: 3.2,
    aprPct: 8.1,
    aprDeltaPct: 0.1,
    missedBlocks: 6,
    jailed: false,
  },
];

const getSampleInfrastructureHealthReport = (range: ReportRange): InfrastructureHealthReport => ({
  meta: buildMeta(range),
  overview: {
    totalNodes: 4,
    totalRpcNodes: 2,
    totalValidatorNodes: 2,
    overallUptimePct: 99.1,
    uptimeDeltaPct: 0.2,
    totalRequests: 1250000,
    requestsDeltaPct: 5.6,
    totalRewards: 184.2,
    rewardsDeltaPct: 4.9,
    totalStake: 1250000,
    stakeDeltaPct: 1.4,
    avgLatencyMs: 145,
    latencyDeltaPct: -3.5,
    alertCount: 1,
    alertsDeltaPct: -50,
    securityScore: 92,
  },
  rpcSummary: {
    totalNodes: 2,
    healthyNodes: 1,
    warningNodes: 1,
    criticalNodes: 0,
    avgUptimePct: 99.25,
    uptimeDeltaPct: 0.1,
    avgLatencyMs: 147,
    latencyDeltaPct: -2.4,
    totalRequests: 1250000,
    requestsDeltaPct: 5.6,
    errorRatePct: 0.12,
    errorRateDeltaPct: -0.03,
    incidents: 1,
  },
  validatorSummary: {
    totalValidators: 2,
    activeValidators: 2,
    jailedValidators: 0,
    jailedCount: 0,
    totalStake: 1250000,
    totalRewards: 184.2,
    avgAPR: 8.4,
    score: 85,
    grade: "A",
  },
  rpcHighlights: rpcNodes,
  validatorHighlights: validatorNodes,
  incidents: [
    {
      id: "alert-001",
      title: "Latency spike detected",
      description: "RPC-Backup latency exceeded 200 ms for 18 minutes.",
      severity: "warning",
      status: "open",
      startedAt: "2026-01-23T12:10:00Z",
      durationMinutes: 18,
      nodeName: "RPC-Backup",
      nodeType: "rpc",
    },
  ],
  insights: [
    {
      id: "insight-001",
      title: "Shift traffic to RPC-Primary",
      description: "RPC-Primary is 20% faster. Route additional traffic there to reduce latency.",
      severity: "warning",
    },
    {
      id: "insight-002",
      title: "Delegator growth is steady",
      description: "Delegator count grew 4.2% week-over-week. Maintain current outreach cadence.",
      severity: "good",
    },
    {
      id: "insight-003",
      title: "No validator risks detected",
      description: "Both validators remain unjailed with stable uptime above 98%.",
      severity: "good",
    },
  ],
  trends: buildMultiTrend(range, [
    {
      key: "requests",
      values:
        range === "monthly"
          ? [210000, 235000, 260000, 280000, 300000]
          : [160000, 170000, 182000, 190000, 200000, 205000, 220000],
    },
    { key: "rewards", values: range === "monthly" ? [32, 35, 39, 41, 46] : [22, 24, 25, 26, 27, 28, 32] },
  ]),
});

const getSampleRpcFleetReport = (range: ReportRange): RpcFleetReport => ({
  meta: buildMeta(range),
  summary: {
    totalNodes: 2,
    healthyNodes: 1,
    warningNodes: 1,
    criticalNodes: 0,
    avgUptimePct: 99.25,
    uptimeDeltaPct: 0.1,
    avgLatencyMs: 147,
    latencyDeltaPct: -2.4,
    totalRequests: 1250000,
    requestsDeltaPct: 5.6,
    errorRatePct: 0.12,
    errorRateDeltaPct: -0.03,
    incidents: 1,
  },
  usageTrend: buildTrend(
    range,
    range === "monthly"
      ? [210000, 235000, 260000, 280000, 300000]
      : [160000, 170000, 182000, 190000, 200000, 205000, 220000],
    "requests",
  ),
  trends: buildTrend(
    range,
    range === "monthly"
      ? [210000, 235000, 260000, 280000, 300000]
      : [160000, 170000, 182000, 190000, 200000, 205000, 220000],
    "requestCount",
  ),
  latencyTrend: buildTrend(
    range,
    range === "monthly" ? [160, 155, 150, 145, 140] : [155, 150, 148, 145, 142, 140, 138],
    "latency",
  ),
  nodes: rpcNodes,
  bestPerformers: [rpcNodes[0]],
  worstPerformers: [rpcNodes[1]],
  alerts: [
    {
      id: "alert-001",
      title: "Latency spike detected",
      description: "RPC-Backup latency exceeded 200 ms for 18 minutes.",
      severity: "warning",
      status: "open",
      startedAt: "2026-01-23T12:10:00Z",
      durationMinutes: 18,
      nodeName: "RPC-Backup",
      nodeType: "rpc",
    },
  ],
  insights: [
    {
      id: "insight-001",
      title: "Improve cache hit ratio",
      description: "Top method volume suggests adding cache for eth_getBlockByNumber.",
      severity: "good",
    },
  ],
});

const getSampleRpcNodeReport = (range: ReportRange): RpcNodeReport => ({
  meta: buildMeta(range),
  node: {
    ...rpcNodes[0],
    endpoint: "https://rpc-primary.zeeve.io",
    provider: "AWS",
    version: "v1.2.4",
  },
  healthTimeline: buildMultiTrend(range, [
    {
      key: "uptime",
      values: range === "monthly" ? [99.5, 99.6, 99.7, 99.6, 99.8] : [99.4, 99.6, 99.5, 99.7, 99.8, 99.6, 99.7],
    },
    { key: "latency", values: range === "monthly" ? [140, 135, 130, 128, 125] : [135, 132, 130, 128, 125, 124, 122] },
  ]),
  usageTrend: buildTrend(
    range,
    range === "monthly"
      ? [120000, 135000, 148000, 162000, 175000]
      : [110000, 115000, 120000, 125000, 130000, 135000, 145000],
    "requests",
  ),
  methodBreakdown: [
    { method: "eth_call", count: 420000 },
    { method: "eth_getBlockByNumber", count: 280000 },
    { method: "eth_getBalance", count: 150000 },
    { method: "eth_getTransactionByHash", count: 120000 },
  ],
  benchmarks: {
    avgLatencyMs: 120,
    p95LatencyMs: 210,
    availabilityPct: 99.6,
    errorRatePct: 0.08,
    peakRps: 820,
  },
  security: {
    ddosProtection: "enabled",
    tlsStatus: "valid",
    firewallEnabled: "enabled",
    lastSecurityCheck: "2026-01-24T08:00:00Z",
  },
  incidents: [
    {
      id: "incident-001",
      title: "Short-lived latency spike",
      description: "Latency exceeded 190 ms for 6 minutes.",
      severity: "warning",
      status: "resolved",
      startedAt: "2026-01-21T09:14:00Z",
      resolvedAt: "2026-01-21T09:20:00Z",
      durationMinutes: 6,
      nodeName: "RPC-Primary",
      nodeType: "rpc",
    },
  ],
});

const getSampleValidatorFleetReport = (range: ReportRange): ValidatorFleetReport => ({
  meta: buildMeta(range),
  summary: {
    totalValidators: 2,
    activeValidators: 2,
    jailedValidators: 0,
    jailedCount: 0,
    totalStake: 1250000,
    totalRewards: 184.2,
    avgAPR: 8.4,
    score: 85,
    grade: "A",
  },
  validators: validatorNodes,
  healthMix: {
    good: 2,
    warning: 0,
    critical: 0,
  },
  riskIndicators: {
    slashingRisk: "low",
    jailingRisk: "low",
    stakeConcentration: "medium",
  },
  incidents: [],
  insights: [
    {
      id: "insight-001",
      title: "Increase commission review",
      description: "APR is stable; consider reviewing commission for competitiveness.",
      severity: "good",
    },
  ],
  trends: buildTrend(range, range === "monthly" ? [32, 35, 39, 41, 46] : [22, 24, 25, 26, 27, 28, 32], "rewards"),
});

const getSampleValidatorNodeReport = (range: ReportRange): ValidatorNodeReport => ({
  meta: {
    ...buildMeta(range),
    nodeId: "validator-1",
    nodeName: "Validator-Alpha",
    validatorId: "val-001",
    validatorName: "Alpha Validator",
  },
  overview: {
    status: "good",
    score: 88,
    grade: "A",
    scoreChange: 2,
    scoreChangePercent: 2.3,
  },
  metrics: {
    stake: 250000,
    stakeChange: 5000,
    stakeChangePercent: 2.0,
    rewards: 26.5,
    rewardsChangePercent: 3.5,
    apr: 8.8,
    aprChange: 0.3,
    uptimePct: 99.1,
    uptimeChangePercent: 0.2,
    jailed: false,
    slashingEvents: 0,
  },
  delegators: {
    totalCount: 125,
    topDelegators: [],
  },
  networkComparison: {
    uptimeVsNetwork: 0.7,
    rewardsVsNetwork: 0.8,
    aprVsNetwork: 0.9,
    reliabilityVsNetwork: 0.85,
  },
  incidents: [],
  insights: [
    {
      id: "insight-002",
      title: "Delegator base is diversified",
      description: "No single delegator controls more than 15% of stake.",
      severity: "good",
    },
  ],
  trends: buildTrend(range, range === "monthly" ? [18, 20, 22, 24, 26] : [12, 13, 14, 15, 15.5, 16, 18], "rewards"),
});

export {
  getSampleInfrastructureHealthReport,
  getSampleRpcFleetReport,
  getSampleRpcNodeReport,
  getSampleValidatorFleetReport,
  getSampleValidatorNodeReport,
};
