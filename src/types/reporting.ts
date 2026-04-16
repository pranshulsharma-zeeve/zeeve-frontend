export type ReportRange = "weekly" | "monthly";
export type HealthStatus = "good" | "warning" | "high" | "average" | "info" | "critical";

export interface ReportMeta {
  accountId?: string;
  accountName?: string;
  periodStart?: string;
  periodEnd?: string;
  generatedAt?: string;
  range: ReportRange;
  timezone?: string;
}

export interface ReportResponse<T> {
  success: boolean;
  data: T;
}

export interface ReportInsight {
  id: string;
  title: string;
  description?: string;
  severity?: HealthStatus;
  actionLabel?: string;
  actionUrl?: string;
}

export interface ReportAlert {
  id: string;
  title: string;
  description?: string;
  severity: HealthStatus;
  status?: "open" | "resolved";
  startedAt?: string;
  resolvedAt?: string;
  durationMinutes?: number;
  nodeName?: string;
  nodeType?: "rpc" | "validator";
}

export interface ReportTrendPoint {
  date?: string;
  label?: string;
  metric?: string;
  [key: string]: string | number | undefined;
}

export interface RpcNodeSummary {
  nodeId: string;
  nodeName: string;
  region?: string;
  network?: string;
  status: HealthStatus;
  uptimePct?: number;
  uptimeDeltaPct?: number;
  latencyMs?: number;
  latencyDeltaPct?: number;
  requestCount?: number;
  requestDeltaPct?: number;
  errorRatePct?: number;
  errorRateDeltaPct?: number;
  incidents?: number;
}

export interface RpcFleetSummary {
  totalNodes: number;
  healthyNodes: number;
  warningNodes?: number;
  criticalNodes?: number;
  avgUptimePct?: number;
  uptimeDeltaPct?: number;
  avgLatencyMs?: number;
  latencyDeltaPct?: number;
  totalRequests?: number;
  requestsDeltaPct?: number;
  errorRatePct?: number;
  errorRateDeltaPct?: number;
  incidents?: number;
  score?: number;
  scoreChange?: number;
}

export interface RpcFleetReport {
  meta: ReportMeta;
  summary: RpcFleetSummary;
  usageTrend: ReportTrendPoint[];
  trends: ReportTrendPoint[];
  latencyTrend: ReportTrendPoint[];
  nodes: RpcNodeSummary[];
  bestPerformers?: RpcNodeSummary[];
  worstPerformers?: RpcNodeSummary[];
  alerts?: ReportAlert[];
  incidents?: ReportAlert[];
  insights?: ReportInsight[];
}

export interface RpcMethodBreakdown {
  method: string;
  callCount?: number;
  callPercent?: number;
  avgLatencyMs?: number;
  errorCount?: number;
  errorRatePct?: number;
  count?: number;
}

export interface RpcNodeOverview {
  status: HealthStatus;
  score?: number;
  grade?: string;
  scoreChange?: number;
  scoreChangePercent?: number;
}

export interface RpcNodeMetrics {
  uptimePct?: number;
  uptimeChangePercent?: number;
  latencyMs?: number;
  latencyChangePercent?: number;
  requestCount?: number;
  requestChangePercent?: number;
  errorCount?: number;
  errorRatePct?: number;
  errorChangePercent?: number;
}

export interface RpcSecurityInfo {
  ddosProtection?: boolean | "enabled" | "disabled";
  firewallEnabled?: boolean | "enabled" | "disabled";
  tlsStatus?: "valid" | "expiring" | "expired";
  lastSecurityCheck?: string;
}

export interface RpcBenchmarks {
  uptimeVsNetwork?: number;
  latencyVsNetwork?: number;
  reliabilityVsNetwork?: number;
  avgLatencyMs?: number;
  p95LatencyMs?: number;
  availabilityPct?: number;
  errorRatePct?: number;
  peakRps?: number;
}

export interface RpcNodeReport {
  meta: ReportMeta & {
    nodeId?: string;
    nodeName?: string;
  };
  overview?: RpcNodeOverview;
  node?: RpcNodeSummary & {
    endpoint?: string;
    provider?: string;
    version?: string;
  };
  metrics?: RpcNodeMetrics;
  healthTimeline?: ReportTrendPoint[];
  usageTrend?: ReportTrendPoint[];
  methodBreakdown?: RpcMethodBreakdown[];
  benchmarks?: RpcBenchmarks;
  security?: RpcSecurityInfo;
  incidents?: ReportAlert[];
  insights?: ReportInsight[];
  trends?: ReportTrendPoint[];
}

export interface ValidatorNodeSummary {
  nodeId?: string;
  validatorId?: string;
  nodeName?: string;
  validatorName?: string;
  network?: string;
  status: HealthStatus;
  stake?: number;
  rewards?: number;
  apr?: number;
  uptimePct?: number;
  jailed?: boolean;
  slashingEvents?: number;
  score?: number;
  scoreChange?: number;
}

export interface ValidatorFleetSummary {
  totalValidators?: number;
  healthyNodes?: number;
  criticalNodes?: number;
  activeValidators?: number;
  jailedValidators?: number;
  jailedCount?: number;
  totalStake?: number;
  totalRewards?: number;
  avgAPR?: number;
  score?: number;
  grade?: string;
  status?: HealthStatus;
  scoreChange?: number;
  scoreChangePercent?: number;
}

export interface RiskIndicators {
  slashingRisk: string;
  jailingRisk: string;
  stakeConcentration: string;
}

export interface HealthMix {
  good: number;
  warning: number;
  critical: number;
}

export interface ValidatorFleetReport {
  meta: ReportMeta;
  summary: ValidatorFleetSummary;
  validators: ValidatorNodeSummary[];
  healthMix: HealthMix;
  riskIndicators: RiskIndicators;
  incidents: ReportAlert[];
  insights: ReportInsight[];
  trends: ReportTrendPoint[];
}

export interface DelegatorInfo {
  delegatorAddress: string;
  delegatedStake: number;
  delegatePercentOfValidator: number;
  joinedDate?: string | null;
}

export interface DelegatorsData {
  totalCount: number;
  topDelegators: DelegatorInfo[];
}

export interface NetworkComparison {
  uptimeVsNetwork: number;
  rewardsVsNetwork: number;
  aprVsNetwork: number;
  reliabilityVsNetwork: number;
}

export interface ValidatorMetrics {
  stake: number;
  stakeChange: number;
  stakeChangePercent: number;
  rewards: number;
  rewardsChangePercent: number;
  apr: number;
  aprChange: number;
  uptimePct: number;
  jailed: boolean;
  slashingEvents: number;
  uptimeChangePercent: number;
}

export interface ValidatorOverview {
  status: HealthStatus;
  score: number;
  grade: string;
  scoreChange: number;
  scoreChangePercent: number;
}

export interface ValidatorNodeReport {
  meta: ReportMeta & {
    nodeId?: string | null;
    nodeName?: string | null;
    validatorId?: string;
    validatorName?: string;
  };
  overview: ValidatorOverview;
  metrics: ValidatorMetrics;
  delegators: DelegatorsData;
  networkComparison: NetworkComparison;
  incidents: ReportAlert[];
  insights: ReportInsight[];
  trends: ReportTrendPoint[];
}

export interface InfrastructureHealthOverview {
  totalNodes: number;
  totalRpcNodes?: number;
  totalValidatorNodes?: number;
  overallUptimePct?: number;
  uptimeDeltaPct?: number;
  totalRequests?: number;
  requestsDeltaPct?: number;
  totalRewards?: number;
  rewardsDeltaPct?: number;
  totalStake?: number;
  stakeDeltaPct?: number;
  avgLatencyMs?: number;
  latencyDeltaPct?: number;
  alertCount?: number;
  alertsDeltaPct?: number;
  securityScore?: number;
  overallScore?: number;
  overallGrade?: string;
  overallStatus?: HealthStatus;
  scoreChange?: number;
  scoreChangePercent?: number;
}

export interface InfrastructureHealthReport {
  meta: ReportMeta;
  overview: InfrastructureHealthOverview;
  rpcSummary: RpcFleetSummary;
  validatorSummary: ValidatorFleetSummary;
  rpcHighlights?: RpcNodeSummary[];
  validatorHighlights?: ValidatorNodeSummary[];
  incidents?: ReportAlert[];
  insights?: ReportInsight[];
  trends?: ReportTrendPoint[];
}
