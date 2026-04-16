import { formateNumber } from "@/utils/helpers";
import type { HealthStatus, RpcNodeSummary, ValidatorNodeSummary } from "@/types/reporting";

const HEALTH_LABELS: Record<HealthStatus, string> = {
  good: "Healthy",
  warning: "Warning",
  high: "High",
  average: "Average",
  info: "Info",
  critical: "Critical",
};

const HEALTH_STYLES: Record<HealthStatus, { bg: string; border: string; text: string }> = {
  good: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  high: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
  average: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700" },
  info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
};

type MetricStatus = "excellent" | "good" | "needs-attention";

const METRIC_STATUS_LABELS: Record<MetricStatus, string> = {
  excellent: "Excellent",
  good: "Good",
  "needs-attention": "Needs Attention",
};

const METRIC_STATUS_STYLES: Record<MetricStatus, { bg: string; text: string; border: string }> = {
  excellent: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  good: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  "needs-attention": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

const formatPercent = (value?: number, decimals = 2): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "NA";
  }
  return `${formateNumber(value, decimals)}%`;
};

const formatSignedPercent = (value?: number, decimals = 2): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "NA";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${formateNumber(value, decimals)}%`;
};

const formatNumberCompact = (value?: number, decimals = 2): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "NA";
  }
  return formateNumber(value, decimals, "compact", true);
};

const formatCurrencyCompact = (value?: number, decimals = 2): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "NA";
  }

  const sign = value < 0 ? "-" : "";
  const compact = formateNumber(Math.abs(value), decimals, "compact", true);
  return `${sign}$${compact}`;
};

const formatLatency = (value?: number): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "NA";
  }
  return `${formateNumber(value, 2)} ms`;
};

const getHealthLabel = (status?: HealthStatus): string => {
  if (!status) {
    return "Unknown";
  }
  return HEALTH_LABELS[status] ?? "Unknown";
};

const getHealthStyles = (status?: HealthStatus) => {
  if (!status) {
    return HEALTH_STYLES.good;
  }
  return HEALTH_STYLES[status] ?? HEALTH_STYLES.good;
};

const sortRpcNodesByUptime = (nodes: RpcNodeSummary[]) => {
  return [...nodes].sort((a, b) => (b.uptimePct ?? 0) - (a.uptimePct ?? 0));
};

const sortValidatorNodesByRewards = (nodes: ValidatorNodeSummary[]) => {
  return [...nodes].sort((a, b) => (b.rewards ?? 0) - (a.rewards ?? 0));
};

const toPercentageParts = (value?: number) => {
  const safe = typeof value === "number" && value >= 0 ? value : 0;
  return Math.min(Math.max(safe, 0), 100);
};

const getMetricStatusLabel = (status: MetricStatus) => {
  const label = METRIC_STATUS_LABELS[status] ?? "Good";
  console.log("getMetricStatusLabel called with status:", status, "returning:", label);
  return label;
};
const getMetricStatusStyles = (status: MetricStatus) => METRIC_STATUS_STYLES[status] ?? METRIC_STATUS_STYLES.good;

const clampScore = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const scoreLatency = (latencyMs?: number) => {
  if (typeof latencyMs !== "number" || Number.isNaN(latencyMs)) {
    return 70;
  }
  if (latencyMs <= 120) return 100;
  if (latencyMs <= 200) return 85;
  if (latencyMs <= 300) return 70;
  if (latencyMs <= 450) return 55;
  return 40;
};

const scoreErrorRate = (errorRatePct?: number) => {
  if (typeof errorRatePct !== "number" || Number.isNaN(errorRatePct)) {
    return 70;
  }
  if (errorRatePct <= 0.1) return 100;
  if (errorRatePct <= 0.3) return 85;
  if (errorRatePct <= 0.7) return 70;
  if (errorRatePct <= 1.5) return 55;
  return 40;
};

const scoreIncidents = (incidents?: number) => {
  if (typeof incidents !== "number" || Number.isNaN(incidents)) {
    return 80;
  }
  if (incidents <= 0) return 100;
  if (incidents === 1) return 85;
  if (incidents === 2) return 70;
  return 55;
};

const scoreMissedBlocks = (missedBlocks?: number) => {
  if (typeof missedBlocks !== "number" || Number.isNaN(missedBlocks)) {
    return 80;
  }
  if (missedBlocks <= 5) return 100;
  if (missedBlocks <= 10) return 85;
  if (missedBlocks <= 25) return 70;
  if (missedBlocks <= 50) return 55;
  return 40;
};

const calculateRpcScore = (params: {
  uptimePct?: number;
  latencyMs?: number;
  errorRatePct?: number;
  incidents?: number;
}) => {
  const uptimeScore = typeof params.uptimePct === "number" ? clampScore(params.uptimePct, 40, 100) : 70;
  const latencyScore = scoreLatency(params.latencyMs);
  const errorScore = scoreErrorRate(params.errorRatePct);
  const incidentScore = scoreIncidents(params.incidents);
  return Math.round(uptimeScore * 0.4 + latencyScore * 0.2 + errorScore * 0.2 + incidentScore * 0.2);
};

const calculateValidatorScore = (params: { uptimePct?: number; missedBlocks?: number; jailed?: boolean }) => {
  const uptimeScore = typeof params.uptimePct === "number" ? clampScore(params.uptimePct, 40, 100) : 70;
  const missedScore = scoreMissedBlocks(params.missedBlocks);
  const baseScore = Math.round(uptimeScore * 0.7 + missedScore * 0.3);
  return params.jailed ? Math.min(baseScore, 45) : baseScore;
};

const calculateAccountScore = (params: {
  uptimePct?: number;
  latencyMs?: number;
  errorRatePct?: number;
  alerts?: number;
}) => {
  return calculateRpcScore({
    uptimePct: params.uptimePct,
    latencyMs: params.latencyMs,
    errorRatePct: params.errorRatePct,
    incidents: params.alerts,
  });
};

const getGradeFromScore = (score?: number) => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return "NA";
  }
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  return "C";
};

const getStatusFromScore = (score?: number) => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return { label: "Needs attention", tone: "warning" as HealthStatus };
  }
  if (score >= 85) return { label: "Healthy", tone: "good" as HealthStatus };
  if (score >= 70) return { label: "Needs attention", tone: "warning" as HealthStatus };
  return { label: "Critical", tone: "critical" as HealthStatus };
};

const pickMetricStatus = (
  value: number | undefined,
  thresholds: { excellent: number; good: number },
  invert = false,
): MetricStatus => {
  console.log("Picking metric status for value:", value, "with thresholds:", thresholds, "invert:", invert);
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "good";
  }
  if (invert) {
    if (value <= thresholds.excellent) return "excellent";
    if (value <= thresholds.good) return "good";
    return "needs-attention";
  }
  if (value >= thresholds.excellent) return "excellent";
  if (value >= thresholds.good) return "good";
  return "needs-attention";
};

const finalizeHighlights = (candidates: Array<string | null | undefined>, fallbacks: string[], min = 3, max = 5) => {
  const unique: string[] = [];
  const seen = new Set<string>();
  candidates.forEach((item) => {
    if (item && !seen.has(item)) {
      unique.push(item);
      seen.add(item);
    }
  });
  fallbacks.forEach((fallback) => {
    if (unique.length >= min) {
      return;
    }
    if (!seen.has(fallback)) {
      unique.push(fallback);
      seen.add(fallback);
    }
  });
  return unique.slice(0, Math.min(max, unique.length));
};

export {
  type MetricStatus,
  formatPercent,
  formatSignedPercent,
  formatNumberCompact,
  formatCurrencyCompact,
  formatLatency,
  getHealthLabel,
  getHealthStyles,
  getMetricStatusLabel,
  getMetricStatusStyles,
  sortRpcNodesByUptime,
  sortValidatorNodesByRewards,
  toPercentageParts,
  calculateRpcScore,
  calculateValidatorScore,
  calculateAccountScore,
  getGradeFromScore,
  getStatusFromScore,
  pickMetricStatus,
  finalizeHighlights,
};
