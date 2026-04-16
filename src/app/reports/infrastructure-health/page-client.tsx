"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heading, Tooltip, Z4Navigation } from "@zeeve-platform/ui";
import DonutHealthChart from "@/components/reports/DonutHealthChart";
import TrendsAreaChart from "@/components/reports/TrendsAreaChart";
import HighlightsList from "@/components/reports/HighlightsList";
import MetricsOverview from "@/components/reports/MetricsOverview";
import KeyInsights from "@/components/reports/KeyInsights";
import PaginatedComparisonTable from "@/components/reports/PaginatedComparisonTable";
import { EmptyState, ReportCard, FancyReportLoader } from "@/modules/reports/components";
import { downloadCsvReport, downloadHtmlReport, downloadPdfReport } from "@/modules/reports/export";
import {
  finalizeHighlights,
  formatCurrencyCompact,
  formatLatency,
  formatNumberCompact,
  formatPercent,
  formatSignedPercent,
  getHealthLabel,
  sortRpcNodesByUptime,
  sortValidatorNodesByRewards,
} from "@/modules/reports/utils";
import type { ReportRange } from "@/types/reporting";
import usePlatformService from "@/services/platform/use-platform-service";
import ROUTES from "@/routes";
import { formatDateWithoutTime } from "@/utils/date";
import { NoNodesBanner } from "@/components/reports/NoNodesBanner";
import { ReportActions } from "@/components/reports/ReportActions";

const InfrastructureHealthReportPageClient = () => {
  const [range, setRange] = useState<ReportRange>("weekly");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const {
    request: { data, isLoading },
  } = usePlatformService().reports.infrastructureHealth(range);

  const report = data?.data || null;
  const overview = report?.overview;
  const reportTitle =
    range === "monthly" ? "Infrastructure Health Report (Monthly)" : "Infrastructure Health Report (Weekly)";
  const loaderMessage =
    range === "monthly" ? "Loading monthly infrastructure report..." : "Loading weekly infrastructure report...";

  // Check if user has RPC nodes or validators
  const hasRpcNodes = (report?.rpcSummary?.totalNodes ?? 0) > 0;
  const hasValidators = (report?.validatorSummary?.totalValidators ?? 0) > 0;
  const highlightsGridClass =
    hasRpcNodes && hasValidators ? "grid grid-cols-1 gap-6 xl:grid-cols-2" : "grid grid-cols-1 gap-6";

  const periodLabel = useMemo(() => {
    if (!report?.meta?.periodStart || !report?.meta?.periodEnd) {
      return "";
    }
    return `${formatDateWithoutTime(report.meta.periodStart)} - ${formatDateWithoutTime(report.meta.periodEnd)}`;
  }, [report?.meta?.periodStart, report?.meta?.periodEnd]);

  // RPC Health data for donut chart
  const rpcHealthData = useMemo(() => {
    const rpcSummary = report?.rpcSummary;
    return [
      { name: "Healthy", value: rpcSummary?.healthyNodes ?? 0, color: "#22c55e" },
      { name: "Warning", value: rpcSummary?.warningNodes ?? 0, color: "#f59e0b" },
      { name: "Critical", value: rpcSummary?.criticalNodes ?? 0, color: "#ef4444" },
    ];
  }, [report?.rpcSummary]);

  // Validator Health data for donut chart
  const validatorHealthData = useMemo(() => {
    const validatorSummary = report?.validatorSummary;
    return [
      { name: "Healthy", value: validatorSummary?.healthyNodes ?? 0, color: "#22c55e" },
      { name: "Critical", value: validatorSummary?.criticalNodes ?? 0, color: "#ef4444" },
    ];
  }, [report?.validatorSummary]);

  // RPC Trends data
  const rpcTrendsData = useMemo(() => {
    if (!report?.trends || report.trends.length === 0) {
      return [];
    }
    return report.trends.map((trend) => ({
      date: trend.date,
      requests: trend.requestCount ?? 0,
    }));
  }, [report?.trends]);

  // Validator Trends data
  const validatorTrendsData = useMemo(() => {
    if (!report?.trends || report.trends.length === 0) {
      return [];
    }
    return report.trends.map((trend) => ({
      date: trend.date,
      rewards: trend.rewards ?? 0,
    }));
  }, [report?.trends]);

  const topRpcNodes = useMemo(() => {
    if (!report?.rpcHighlights?.length) {
      return [];
    }
    return sortRpcNodesByUptime(report.rpcHighlights).slice(0, 1);
  }, [report?.rpcHighlights]);

  const topValidators = useMemo(() => {
    if (!report?.validatorHighlights?.length) {
      return [];
    }
    return sortValidatorNodesByRewards(report.validatorHighlights).slice(0, 1);
  }, [report?.validatorHighlights]);

  const periodHighlights = useMemo(() => {
    const requestDelta = overview?.requestsDeltaPct;
    const rewardsDelta = overview?.rewardsDeltaPct;
    const latencyDelta = overview?.latencyDeltaPct;
    const alertCount = overview?.alertCount ?? 0;
    const incidentName = report?.incidents?.[0]?.title;

    return finalizeHighlights(
      [
        overview?.overallUptimePct
          ? `Uptime held at ${formatPercent(overview.overallUptimePct)} across all nodes.`
          : null,
        typeof requestDelta === "number"
          ? requestDelta >= 0
            ? `RPC traffic increased by ${formatSignedPercent(requestDelta)}.`
            : `RPC traffic dipped by ${formatPercent(Math.abs(requestDelta))}.`
          : null,
        typeof rewardsDelta === "number"
          ? rewardsDelta >= 0
            ? `Validator rewards grew by ${formatSignedPercent(rewardsDelta)}.`
            : `Validator rewards slipped by ${formatPercent(Math.abs(rewardsDelta))}.`
          : null,
        typeof latencyDelta === "number"
          ? latencyDelta <= 0
            ? `Average latency improved by ${formatPercent(Math.abs(latencyDelta))}.`
            : `Average latency rose by ${formatSignedPercent(latencyDelta)}.`
          : null,
        alertCount > 0
          ? `${alertCount} alert${alertCount === 1 ? "" : "s"} required attention${
              incidentName ? `, including ${incidentName}` : ""
            }.`
          : "No critical alerts were raised this period.",
      ],
      [
        "Validator rewards stayed within expected range for the week.",
        "RPC demand was steady with no severe spikes.",
        "Overall health signals were stable compared with the prior period.",
      ],
    );
  }, [
    overview?.overallUptimePct,
    overview?.requestsDeltaPct,
    overview?.rewardsDeltaPct,
    overview?.latencyDeltaPct,
    overview?.alertCount,
    report?.incidents,
  ]);

  const exportSections = useMemo(() => {
    const overviewRows = [
      ["Total nodes", overview?.totalNodes ?? "NA"],
      ["RPC nodes", overview?.totalRpcNodes ?? "NA"],
      ["Validator nodes", overview?.totalValidatorNodes ?? "NA"],
      ["Overall uptime", formatPercent(overview?.overallUptimePct)],
      ["Overall uptime change (WoW)", formatSignedPercent(overview?.uptimeDeltaPct)],
      ["Total requests", formatNumberCompact(overview?.totalRequests)],
      ["Requests change (WoW)", formatSignedPercent(overview?.requestsDeltaPct)],
      ["Total rewards", formatCurrencyCompact(overview?.totalRewards)],
      ["Rewards change (WoW)", formatSignedPercent(overview?.rewardsDeltaPct)],
      ["Total stake", formatCurrencyCompact(report?.validatorSummary?.totalStake)],
      ["Stake change (WoW)", formatSignedPercent(overview?.stakeDeltaPct)],
      ["Average latency", formatLatency(overview?.avgLatencyMs)],
      ["Latency change (WoW)", formatSignedPercent(overview?.latencyDeltaPct)],
      ["Active alerts", overview?.alertCount ?? "NA"],
      ["Alerts change (WoW)", formatSignedPercent(overview?.alertsDeltaPct)],
    ];

    const rpcRows = [
      ["Total nodes", report?.rpcSummary?.totalNodes ?? "NA"],
      ["Healthy nodes", report?.rpcSummary?.healthyNodes ?? "NA"],
      ["Warning nodes", report?.rpcSummary?.warningNodes ?? "NA"],
      ["Critical nodes", report?.rpcSummary?.criticalNodes ?? "NA"],
      ["Avg uptime", formatPercent(report?.rpcSummary?.avgUptimePct)],
      ["Avg uptime change (WoW)", formatSignedPercent(report?.rpcSummary?.uptimeDeltaPct)],
      ["Avg latency", formatLatency(report?.rpcSummary?.avgLatencyMs)],
      ["Avg latency change (WoW)", formatSignedPercent(report?.rpcSummary?.latencyDeltaPct)],
      ["Total requests", formatNumberCompact(report?.rpcSummary?.totalRequests)],
      ["Requests change (WoW)", formatSignedPercent(report?.rpcSummary?.requestsDeltaPct)],
      ["Error rate", formatPercent(report?.rpcSummary?.errorRatePct)],
      ["Error rate change (WoW)", formatSignedPercent(report?.rpcSummary?.errorRateDeltaPct)],
    ];

    const validatorRows = [
      ["Total validators", report?.validatorSummary?.totalValidators ?? "NA"],
      ["Active validators", report?.validatorSummary?.activeValidators ?? "NA"],
      ["Jailed validators", report?.validatorSummary?.jailedCount ?? "NA"],
      ["Total stake", formatCurrencyCompact(report?.validatorSummary?.totalStake)],
      ["Total rewards", formatCurrencyCompact(report?.validatorSummary?.totalRewards)],
    ];

    const incidentRows = (report?.incidents ?? []).map((incident) => [
      incident.title,
      incident.nodeName ?? "NA",
      incident.severity,
      incident.status ?? "open",
    ]);

    const insightRows = (report?.insights ?? []).map((insight) => [
      insight.title,
      insight.severity ?? "NA",
      insight.description ?? "",
    ]);

    return [
      { title: "Executive overview", headers: ["Metric", "Value"], rows: overviewRows },
      { title: "RPC summary", headers: ["Metric", "Value"], rows: rpcRows },
      { title: "Validator summary", headers: ["Metric", "Value"], rows: validatorRows },
      {
        title: "Incidents",
        headers: ["Alert", "Node", "Severity", "Status"],
        rows: incidentRows.length ? incidentRows : [["No incidents", "-", "-", "-"]],
      },
      {
        title: "Insights",
        headers: ["Insight", "Severity", "Description"],
        rows: insightRows.length ? insightRows : [["No insights", "-", "-"]],
      },
    ];
  }, [overview, report]);

  const handleDownloadCsv = () => {
    downloadCsvReport(`infrastructure-health-report-${range}.csv`, exportSections);
  };

  const handleDownloadHtml = () => {
    downloadHtmlReport(`infrastructure-health-report-${range}.html`, "Infrastructure Health Report", exportSections);
  };

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      await downloadPdfReport(
        `infrastructure-health-report-${range}.pdf`,
        "Infrastructure Health Report",
        exportSections,
      );
    } finally {
      setIsPdfLoading(false);
    }
  };

  const incidents = report?.incidents ?? [];
  const shouldShowNoNodesBanner = Boolean(report) && !isLoading && !hasRpcNodes && !hasValidators;
  const downloadMenu = [
    { id: "csv", label: "Download as CSV", onClick: () => handleDownloadCsv() },
    { id: "html", label: "Download as HTML", onClick: () => handleDownloadHtml() },
    {
      id: "pdf",
      label: isPdfLoading ? "Generating PDF..." : "Download as PDF",
      onClick: () => handleDownloadPdf(),
      disabled: isPdfLoading,
    },
  ];

  const renderIncidentRow = (incident: (typeof incidents)[number]) => (
    <>
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900">{incident.title}</div>
        <div className="text-xs text-slate-500">{incident.description}</div>
      </td>
      <td className="px-6 py-4 text-slate-700">{incident.nodeName ?? "N/A"}</td>
      <td className="px-6 py-4 capitalize text-slate-700">{getHealthLabel(incident.severity)}</td>
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Heading as="h1" className="text-3xl font-semibold text-[#0B1220]">
            {reportTitle}
          </Heading>
          <Z4Navigation
            breadcrumb={{
              items: [
                { label: "Dashboard", href: ROUTES.PLATFORM.PAGE.DASHBOARD, as: Link },
                { label: "Reports", href: ROUTES.PLATFORM.PAGE.REPORTS_INFRA_HEALTH, isActive: true, as: Link },
              ],
            }}
          />
          {periodLabel ? <p className="text-xs text-slate-500">Report Period: {periodLabel}</p> : null}
        </div>
        <ReportActions
          range={range}
          onRangeChange={setRange}
          downloadActions={downloadMenu}
          disabled={shouldShowNoNodesBanner}
        />
      </div>

      {isLoading ? (
        <FancyReportLoader
          initialMessage={loaderMessage}
          messages={[
            "Taking too long? Let's brew some insights! ☕",
            "Gathering RPC and validator data...",
            "Building your weekly summary... hang tight! 📈",
          ]}
          className="py-16"
        />
      ) : !report ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12">
          <h3 className="text-lg font-semibold text-red-900">Unable to Load Report</h3>
          <p className="mt-2 text-sm text-red-700">We couldn&apos;t fetch the report data. Please try again later.</p>
        </div>
      ) : shouldShowNoNodesBanner ? (
        <NoNodesBanner
          message="You don’t have any RPC or Validator Nodes yet. Provision a Subscription to unlock Infrastructure Health Reports."
          href={ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS}
          ctaLabel="Provision A Node"
        />
      ) : (
        <>
          <MetricsOverview
            overview={overview}
            rpcSummary={report?.rpcSummary}
            validatorSummary={report?.validatorSummary}
            hasRpcNodes={hasRpcNodes}
            hasValidators={hasValidators}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_3fr]">
            {hasRpcNodes && (
              <ReportCard
                title="RPC Health"
                description="Distribution of RPC Node Health Status."
                action={
                  <Tooltip text="Health status is based on uptime: Healthy (≥95%), Warning (60-95%), Critical (≤60%).">
                    <span className="cursor-help text-xs font-semibold text-slate-500">What do these mean?</span>
                  </Tooltip>
                }
              >
                <DonutHealthChart
                  data={rpcHealthData}
                  total={report?.rpcSummary?.totalNodes ?? 0}
                  emptyTitle="No RPC health data"
                  emptyDescription="Health data will appear once available."
                  totalLabel="Total RPC Nodes"
                  legend={true}
                />
              </ReportCard>
            )}
            {hasRpcNodes && (
              <ReportCard
                title="RPC weekly trends"
                description="RPC request volume across the period."
                action={
                  <Tooltip text="Shows the workload volume handled by your RPC fleet.">
                    <span className="cursor-help text-xs font-semibold text-slate-500">How to read</span>
                  </Tooltip>
                }
              >
                <TrendsAreaChart
                  data={rpcTrendsData}
                  dataKey="requests"
                  color="#6366F1"
                  gradientId="rpcRequests"
                  emptyTitle="No RPC trend data"
                  emptyDescription="Trend data will appear once available."
                  height="15rem"
                  legend={true}
                  xAxisKey="date"
                />
              </ReportCard>
            )}
          </div>

          {hasValidators && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_3fr]">
              <ReportCard
                title="Validator Health"
                description="Distribution of Validator Health Status."
                action={
                  <Tooltip text="Health status is based on uptime: Healthy (≥95%), Warning (60-95%), Critical (≤60%).">
                    <span className="cursor-help text-xs font-semibold text-slate-500">What do these mean?</span>
                  </Tooltip>
                }
              >
                <DonutHealthChart
                  data={validatorHealthData}
                  total={report?.validatorSummary?.totalValidators ?? 0}
                  emptyTitle="No validator health data"
                  emptyDescription="Health data will appear once available."
                  totalLabel="Total Validators"
                  legend={true}
                />
              </ReportCard>
              <ReportCard
                title="Validator weekly trends"
                description="Validator rewards across the period."
                action={
                  <Tooltip text="Shows the weekly earnings from your validators.">
                    <span className="cursor-help text-xs font-semibold text-slate-500">How to read</span>
                  </Tooltip>
                }
              >
                <TrendsAreaChart
                  data={validatorTrendsData}
                  dataKey="rewards"
                  color="#EC4899"
                  gradientId="validatorRewards"
                  valueFormatter={(value) => formatCurrencyCompact(value)}
                  emptyTitle="No validator trend data"
                  emptyDescription="Trend data will appear once available."
                  height="15rem"
                  legend={true}
                  xAxisKey="date"
                />
              </ReportCard>
            </div>
          )}

          <div className={highlightsGridClass}>
            {hasRpcNodes && (
              <ReportCard title="RPC highlights" description="Best Performing RPC Nodes this period.">
                <HighlightsList
                  items={topRpcNodes.map((node) => ({
                    title: node.nodeName,
                    subtitle: node.region ?? "Region N/A",
                    value: formatPercent(node.uptimePct),
                    valueLabel: "Uptime",
                    secondaryValue: node.requestCount,
                    secondaryLabel: "Requests",
                  }))}
                  emptyTitle="No RPC highlights"
                  emptyDescription="Top nodes will appear when data is ready."
                  colorFrom="from-white"
                  colorTo="to-slate-50"
                />
              </ReportCard>
            )}

            {hasValidators && (
              <ReportCard title="Validator highlights" description="Top Reward earners this period.">
                <HighlightsList
                  items={topValidators.map((node) => ({
                    title: (node.validatorName || node.nodeName) ?? "",
                    subtitle: node.network ?? "Network N/A",
                    value: formatCurrencyCompact(node.rewards),
                    valueLabel: "Rewards",
                    secondaryValue: formatCurrencyCompact(node?.stake),
                    secondaryLabel: "Stake",
                  }))}
                  emptyTitle="No validator highlights"
                  emptyDescription="Highlights will appear once data is ready."
                  colorFrom="from-white"
                  colorTo="to-pink-50"
                />
              </ReportCard>
            )}
          </div>

          {/* Premium Top Performers Section */}
          {/* <TopPerformers
            overview={overview}
            rpcHighlights={report?.rpcHighlights}
            validatorHighlights={report?.validatorHighlights}
          /> */}

          <ReportCard title="Incidents & alerts" description="Latest alerts requiring attention.">
            <PaginatedComparisonTable
              data={incidents}
              columns={[
                { key: "alert", label: "Alert" },
                { key: "node", label: "Node" },
                { key: "severity", label: "Severity" },
              ]}
              renderRow={renderIncidentRow}
              emptyTitle="No open incidents"
              emptyDescription="All systems are stable this period."
              pageSize={5}
            />
          </ReportCard>

          <ReportCard
            title="Key insights & recommendations"
            description="Summary of important metrics with insights to help you monitor node's health and performance."
          >
            {(periodHighlights && periodHighlights.length > 0) || (report?.insights && report.insights.length > 0) ? (
              <KeyInsights insights={report?.insights} periodHighlights={periodHighlights} />
            ) : (
              <EmptyState title="No insights yet" description="Insights will appear once data is generated." />
            )}
          </ReportCard>
        </>
      )}
    </div>
  );
};

export default InfrastructureHealthReportPageClient;
