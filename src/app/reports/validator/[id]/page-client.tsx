"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heading, Tooltip, Z4Navigation } from "@zeeve-platform/ui";
import { ReportCard, FancyReportLoader } from "@/modules/reports/components";
import { downloadCsvReport, downloadHtmlReport, downloadPdfReport } from "@/modules/reports/export";
import { finalizeHighlights, formatCurrencyCompact, formatPercent, formatSignedPercent } from "@/modules/reports/utils";
import type { ReportRange } from "@/types/reporting";
import usePlatformService from "@/services/platform/use-platform-service";
import ROUTES from "@/routes";
import { formatDateWithoutTime } from "@/utils/date";
import MetricsOverview from "@/components/reports/MetricsOverview";
import HighlightsList from "@/components/reports/HighlightsList";
import KeyInsights from "@/components/reports/KeyInsights";
import PaginatedComparisonTable from "@/components/reports/PaginatedComparisonTable";
import { ReportActions } from "@/components/reports/ReportActions";
import TrendsAreaChart from "@/components/reports/TrendsAreaChart";

const ValidatorNodeReportPageClient = () => {
  const params = useParams();
  const nodeId = params.id as string;
  const [range, setRange] = useState<ReportRange>("weekly");
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const {
    request: { data, isLoading },
  } = usePlatformService().reports.validatorNode(nodeId, range);

  const report = data?.data || null;

  const periodLabel = useMemo(() => {
    if (!report?.meta?.periodStart || !report?.meta?.periodEnd) {
      return "";
    }
    return `${formatDateWithoutTime(report.meta.periodStart)} - ${formatDateWithoutTime(report.meta.periodEnd)}`;
  }, [report?.meta?.periodStart, report?.meta?.periodEnd]);

  const usageTrends = useMemo(() => {
    if (!report?.trends || report.trends.length === 0) {
      return [];
    }
    return report.trends.map((trend, index) => {
      if (typeof trend === "number") {
        return {
          date: `Point ${index + 1}`,
          uptime: trend,
        };
      }

      return {
        date: trend.date ?? `Point ${index + 1}`,
        uptime: trend.uptimePct ?? 0,
      };
    });
  }, [report?.trends]);

  const validatorMetricsItems = useMemo(() => {
    return [
      {
        title: "Stake",
        subtitle: `Change: ${report?.metrics?.stakeChangePercent ?? 0}%`,
        value: formatCurrencyCompact(report?.metrics?.stake),
        valueLabel: "Total Stake",
      },
      {
        title: "Rewards",
        subtitle: `Change: ${report?.metrics?.rewardsChangePercent ?? 0}%`,
        value: formatCurrencyCompact(report?.metrics?.rewards),
        valueLabel: "Period Rewards",
      },
    ];
  }, [report?.metrics]);

  const buildRow = (delegator: {
    delegatorAddress: string;
    delegatedStake: number;
    delegatePercentOfValidator: number;
  }) => (
    <>
      <td className="px-6 py-4">
        <div className="truncate font-medium text-slate-900">{delegator.delegatorAddress}</div>
      </td>
      <td className="px-6 py-4 font-medium text-slate-700">{formatCurrencyCompact(delegator.delegatedStake)}</td>
      <td className="px-6 py-4 font-medium text-slate-700">{delegator.delegatePercentOfValidator}%</td>
    </>
  );

  const periodHighlights = useMemo(() => {
    const rewardsDelta = report?.metrics?.rewardsChangePercent;
    const stakeDelta = report?.metrics?.stakeChangePercent;
    const incidentCount = report?.incidents?.length ?? 0;

    return finalizeHighlights(
      [
        typeof rewardsDelta === "number"
          ? rewardsDelta >= 0
            ? `Rewards increased by ${formatSignedPercent(rewardsDelta)}.`
            : `Rewards dipped by ${formatPercent(Math.abs(rewardsDelta))}.`
          : null,
        typeof stakeDelta === "number"
          ? stakeDelta >= 0
            ? `Stake grew by ${formatSignedPercent(stakeDelta)}.`
            : `Stake declined by ${formatPercent(Math.abs(stakeDelta))}.`
          : null,
        report?.metrics?.slashingEvents && report.metrics.slashingEvents > 0
          ? `${report.metrics.slashingEvents} slashing event${report.metrics.slashingEvents === 1 ? "" : "s"} detected.`
          : "No slashing events detected.",
        incidentCount > 0
          ? `${incidentCount} incident${incidentCount === 1 ? "" : "s"} detected.`
          : "No incidents detected.",
      ],
      [
        "Validator activity remained within expected thresholds.",
        "Rewards distribution was steady for the period.",
        "Delegator participation stayed consistent.",
      ],
    );
  }, [
    report?.metrics?.rewardsChangePercent,
    report?.metrics?.stakeChangePercent,
    report?.metrics?.slashingEvents,
    report?.incidents?.length,
  ]);

  const exportSections = useMemo(() => {
    const overviewRows = [
      ["Validator name", report?.meta?.validatorName ?? nodeId],
      ["Status", report?.overview?.status ?? "NA"],
      ["Stake", formatCurrencyCompact(report?.metrics?.stake)],
      ["Stake change", formatSignedPercent(report?.metrics?.stakeChangePercent)],
      ["Rewards", formatCurrencyCompact(report?.metrics?.rewards)],
      ["Rewards change", formatSignedPercent(report?.metrics?.rewardsChangePercent)],
      ["Uptime", formatPercent(report?.metrics?.uptimePct)],
      ["Jailed", report?.metrics?.jailed ? "Yes" : "No"],
      ["Slashing events", report?.metrics?.slashingEvents ?? "0"],
    ];

    const delegatorRows = (report?.delegators?.topDelegators ?? []).map((entry) => [
      entry.delegatorAddress,
      formatCurrencyCompact(entry.delegatedStake),
      `${entry.delegatePercentOfValidator}%`,
    ]);

    const comparisonRows = [
      ["Uptime vs Network", `${report?.networkComparison?.uptimeVsNetwork ?? "NA"}`],
      ["Rewards vs Network", `${report?.networkComparison?.rewardsVsNetwork ?? "NA"}`],
      ["Reliability vs Network", `${report?.networkComparison?.reliabilityVsNetwork ?? "NA"}`],
    ];

    const incidentRows = (report?.incidents ?? []).map((incident) => [
      incident.title,
      incident.severity ?? "NA",
      incident.status ?? "open",
    ]);

    const insightRows = (report?.insights ?? []).map((insight) => [insight.title, insight.description ?? ""]);

    return [
      { title: "Validator overview", headers: ["Metric", "Value"], rows: overviewRows },
      {
        title: "Top delegators",
        headers: ["Address", "Stake", "Share"],
        rows: delegatorRows.length ? delegatorRows : [["No data", "-", "-"]],
      },
      {
        title: "Network comparison",
        headers: ["Metric", "Value"],
        rows: comparisonRows,
      },
      {
        title: "Incidents",
        headers: ["Incident", "Severity", "Status"],
        rows: incidentRows.length ? incidentRows : [["No incidents", "-", "-"]],
      },
      {
        title: "Insights",
        headers: ["Insight", "Description"],
        rows: insightRows.length ? insightRows : [["No insights", "-"]],
      },
    ];
  }, [report, nodeId]);

  const metricsItems = useMemo(() => {
    return [
      {
        label: "Status",
        value: formatPercent(report?.metrics?.uptimePct),
        context: "Overall health based on uptime and network signals.",
        icon: "📊",
      },
      {
        label: "Uptime",
        value: formatPercent(report?.metrics?.uptimePct),
        delta: report?.metrics?.uptimeChangePercent,
        context: "Keeps validator eligible for rewards.",
        icon: "📈",
      },
      {
        label: "Rewards",
        value: formatCurrencyCompact(report?.metrics?.rewards),
        delta: report?.metrics?.rewardsChangePercent,
        context: "Weekly earnings for this validator.",
        icon: "💰",
      },
      {
        label: "Total Stake",
        value: formatCurrencyCompact(report?.metrics?.stake),
        delta: report?.metrics?.stakeChangePercent,
        context: "Delegator confidence in this validator.",
        icon: "🔐",
      },
      {
        label: "Delegators",
        value: report?.delegators?.totalCount ?? 0,
        context: "Number of active delegators supporting this validator.",
        icon: "👥",
      },
    ];
  }, [
    report?.metrics?.uptimePct,
    report?.metrics?.uptimeChangePercent,
    report?.metrics?.rewards,
    report?.metrics?.rewardsChangePercent,
    report?.metrics?.stake,
    report?.metrics?.stakeChangePercent,
    report?.delegators?.totalCount,
  ]);

  const handleDownloadCsv = () => {
    downloadCsvReport(
      `validator-node-report-${nodeId}-${range}-${report?.meta?.validatorName ?? nodeId}.csv`,
      exportSections,
    );
  };

  const handleDownloadHtml = () => {
    downloadHtmlReport(
      `validator-node-report-${nodeId}-${range}-${report?.meta?.validatorName ?? nodeId}.html`,
      "Validator Report",
      exportSections,
    );
  };

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      await downloadPdfReport(
        `validator-node-report-${range}-${report?.meta?.validatorName ?? nodeId}.pdf`,
        "Validator Node Report",
        exportSections,
      );
    } finally {
      setIsPdfLoading(false);
    }
  };

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Heading as="h1" className="text-3xl font-semibold text-[#0B1220]">
            Validator Report
          </Heading>
          <Z4Navigation
            breadcrumb={{
              items: [
                { label: "Dashboard", href: ROUTES.PLATFORM.PAGE.DASHBOARD, as: Link },
                { label: "Validator Fleet Report", href: ROUTES.PLATFORM.PAGE.REPORTS_VALIDATOR_FLEET, as: Link },
                {
                  label: report?.meta?.validatorName ?? nodeId,
                  href: `${ROUTES.PLATFORM.PAGE.REPORTS_VALIDATOR_NODE}/${nodeId}`,
                  isActive: true,
                  as: Link,
                },
              ],
            }}
          />
          <p className="text-sm font-medium text-[#4B5365]">
            Validator status, rewards, delegator trends, and network comparison.
          </p>
          {periodLabel ? <p className="text-xs text-slate-500">Report period: {periodLabel}</p> : null}
        </div>
        <ReportActions range={range} onRangeChange={setRange} downloadActions={downloadMenu} />
      </div>

      {isLoading ? (
        <FancyReportLoader
          initialMessage="Loading validator report..."
          messages={[
            "Taking too long? Patience is key! ☕",
            "Analyzing validator metrics...",
            "Generating detailed insights... almost there! 📋",
          ]}
          className="py-16"
        />
      ) : !report ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12">
          <h3 className="text-lg font-semibold text-red-900">Unable to Load Report</h3>
          <p className="mt-2 text-sm text-red-700">We couldn&apos;t fetch the report data. Please try again later.</p>
        </div>
      ) : (
        <>
          {/* <ExecutiveOverviewCard
            score={executiveScore}
            grade={executiveGrade}
            statusLabel={executiveStatus.label}
            statusTone={executiveStatus.tone}
            trendValue={report?.overview?.scoreChange}
            trendLabel="score change"
            verdict={executiveVerdict}
          /> */}

          <MetricsOverview
            items={metricsItems}
            title="Key metrics with context"
            description="Why each validator metric matters and how it moved."
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ReportCard
              title="Trends"
              description="Validator performance trends over time."
              action={
                <Tooltip text="Track performance changes to catch issues early.">
                  <span className="cursor-help text-xs font-semibold text-slate-500">Why it matters</span>
                </Tooltip>
              }
            >
              <TrendsAreaChart
                data={usageTrends}
                dataKey="uptime"
                color="#22C55E"
                gradientId="validatorMetric"
                height="15rem"
                legend={false}
                xAxisKey="date"
                emptyTitle="No trend data"
                emptyDescription="Trends will appear once data is available."
              />
            </ReportCard>

            <ReportCard title="Validator metrics" description="Key metrics for this validator.">
              <HighlightsList
                items={validatorMetricsItems}
                emptyTitle="No metrics data"
                emptyDescription="Validator metrics will appear once data is available."
                colorFrom="from-white"
                colorTo="to-green-50"
              />
            </ReportCard>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <ReportCard
              title="Delegator distribution"
              description="Top delegators for this validator."
              action={
                <Tooltip text="Monitor your top delegators for significant changes.">
                  <span className="cursor-help text-xs font-semibold text-slate-500">Why it matters</span>
                </Tooltip>
              }
            >
              <div className="space-y-4">
                <div className="text-sm font-medium text-slate-600">
                  Total delegators:{" "}
                  <span className="font-semibold text-slate-900">{report?.delegators?.totalCount ?? 0}</span>
                </div>
                <PaginatedComparisonTable
                  data={report?.delegators?.topDelegators ?? []}
                  columns={[
                    { key: "address", label: "Delegator Address" },
                    { key: "stake", label: "Delegated Stake" },
                    { key: "percentage", label: "Share %" },
                  ]}
                  renderRow={buildRow}
                  emptyTitle="No delegator data"
                  emptyDescription="Delegator data will appear once available."
                  pageSize={5}
                />
              </div>
            </ReportCard>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ReportCard title="Incidents" description="Alerts or penalties affecting this validator.">
              <HighlightsList
                items={(report?.incidents ?? []).map((incident) => ({
                  title: incident.title,
                  subtitle: incident.description || "No additional details",
                  value: incident.severity === "critical" ? "⚠" : incident.severity === "warning" ? "⚠" : "ℹ",
                  valueLabel: incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1),
                  color:
                    incident.severity === "critical"
                      ? "text-red-600"
                      : incident.severity === "warning"
                        ? "text-amber-600"
                        : "text-blue-600",
                }))}
                emptyTitle="No incidents detected"
                emptyDescription="This validator is operating within thresholds."
                colorFrom="from-white"
                colorTo="to-red-50"
              />
            </ReportCard>

            <ReportCard
              title="Insights & Recommendations"
              description="Summary of important metrics with insights to help you monitor node's health and performance."
            >
              <KeyInsights insights={report?.insights} periodHighlights={periodHighlights} />
            </ReportCard>
          </div>
        </>
      )}
    </div>
  );
};

export default ValidatorNodeReportPageClient;
