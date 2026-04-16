"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heading, Tooltip, Z4Navigation } from "@zeeve-platform/ui";
import { HealthBadge, ReportCard, FancyReportLoader } from "@/modules/reports/components";
import { downloadCsvReport, downloadHtmlReport, downloadPdfReport } from "@/modules/reports/export";
import {
  finalizeHighlights,
  formatLatency,
  formatNumberCompact,
  formatPercent,
  formatSignedPercent,
  sortRpcNodesByUptime,
} from "@/modules/reports/utils";
import type { ReportRange, RpcNodeSummary } from "@/types/reporting";
import usePlatformService from "@/services/platform/use-platform-service";
import ROUTES from "@/routes";
import { formatDateWithoutTime } from "@/utils/date";
import MetricsOverview from "@/components/reports/MetricsOverview";
import TrendsAreaChart from "@/components/reports/TrendsAreaChart";
import HighlightsList from "@/components/reports/HighlightsList";
import KeyInsights from "@/components/reports/KeyInsights";
import PaginatedComparisonTable from "@/components/reports/PaginatedComparisonTable";
import { NoNodesBanner } from "@/components/reports/NoNodesBanner";
import { ReportActions } from "@/components/reports/ReportActions";

const RPCFleetReportPageClient = () => {
  const [range, setRange] = useState<ReportRange>("weekly");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const {
    request: { data, isLoading },
  } = usePlatformService().reports.rpcFleet(range);

  const report = data?.data || null;
  const hasRpcNodes = (report?.summary?.totalNodes ?? 0) > 0;
  const shouldShowNoNodesBanner = Boolean(report) && !isLoading && !hasRpcNodes;
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

  const periodLabel = useMemo(() => {
    if (!report?.meta?.periodStart || !report?.meta?.periodEnd) {
      return "";
    }
    return `${formatDateWithoutTime(report.meta.periodStart)} - ${formatDateWithoutTime(report.meta.periodEnd)}`;
  }, [report?.meta?.periodStart, report?.meta?.periodEnd]);

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
  const highlights = useMemo(() => {
    const nodes = report?.nodes ?? [];
    const sorted = sortRpcNodesByUptime(nodes);
    const best = report?.bestPerformers?.length ? report.bestPerformers : sorted.slice(0, 2);
    const worst = report?.worstPerformers?.length ? report.worstPerformers : sorted.slice(-2).reverse();
    return { best, worst };
  }, [report?.nodes, report?.bestPerformers, report?.worstPerformers]);

  const buildRow = (node: RpcNodeSummary) => (
    <>
      <td className="px-6 py-4">
        <Link
          href={`${ROUTES.PLATFORM.PAGE.REPORTS_RPC_NODE}/${node.nodeId}`}
          className="font-semibold text-slate-900 transition-colors hover:text-brand-primary"
        >
          {node.nodeName}
        </Link>
      </td>
      <td className="px-6 py-4 font-medium text-slate-700">{formatPercent(node.uptimePct)}</td>
      <td className="px-6 py-4 font-medium text-slate-700">{formatNumberCompact(node.requestCount)}</td>
      <td className="px-6 py-4">
        <HealthBadge status={node.status} />
      </td>
    </>
  );

  const periodHighlights = useMemo(() => {
    const requestDelta = report?.summary?.requestsDeltaPct;
    const latencyDelta = report?.summary?.latencyDeltaPct;
    const errorDelta = report?.summary?.errorRateDeltaPct;
    const incidents = report?.summary?.incidents ?? 0;

    return finalizeHighlights(
      [
        report?.summary?.avgUptimePct
          ? `Fleet uptime averaged ${formatPercent(report.summary.avgUptimePct)} this period.`
          : null,
        typeof requestDelta === "number"
          ? requestDelta >= 0
            ? `Request volume raise by ${formatSignedPercent(requestDelta)}.`
            : `Request volume dipped by ${formatPercent(Math.abs(requestDelta))}.`
          : null,
        typeof latencyDelta === "number"
          ? latencyDelta <= 0
            ? `Average latency improved by ${formatPercent(Math.abs(latencyDelta))}.`
            : `Average latency increased by ${formatSignedPercent(latencyDelta)}.`
          : null,
        typeof errorDelta === "number"
          ? errorDelta <= 0
            ? `Error rate improved by ${formatPercent(Math.abs(errorDelta))}.`
            : `Error rate rose by ${formatSignedPercent(errorDelta)}.`
          : null,
        incidents > 0
          ? `${incidents} incident${incidents === 1 ? "" : "s"} required review across the fleet.`
          : "No incidents were reported this period.",
      ],
      [
        "Traffic patterns stayed within normal ranges for the fleet.",
        "Most nodes delivered stable response times.",
        "Service availability remained consistent week over week.",
      ],
    );
  }, [
    report?.summary?.avgUptimePct,
    report?.summary?.requestsDeltaPct,
    report?.summary?.latencyDeltaPct,
    report?.summary?.errorRateDeltaPct,
    report?.summary?.incidents,
  ]);

  const exportSections = useMemo(() => {
    const summaryRows = [
      ["Total nodes", report?.summary?.totalNodes ?? "NA"],
      ["Healthy nodes", report?.summary?.healthyNodes ?? "NA"],
      ["Warning nodes", report?.summary?.warningNodes ?? "NA"],
      ["Critical nodes", report?.summary?.criticalNodes ?? "NA"],
      ["Average uptime", formatPercent(report?.summary?.avgUptimePct)],
      ["Average uptime change (WoW)", formatSignedPercent(report?.summary?.uptimeDeltaPct)],
      ["Total requests", formatNumberCompact(report?.summary?.totalRequests)],
      ["Requests change (WoW)", formatSignedPercent(report?.summary?.requestsDeltaPct)],
      ["Incidents", report?.summary?.incidents ?? "NA"],
    ];

    const nodeRows = (report?.nodes ?? []).map((node) => [
      node.nodeName,
      node.region ?? "NA",
      formatPercent(node.uptimePct),
      formatLatency(node.latencyMs),
      formatNumberCompact(node.requestCount),
      formatPercent(node.errorRatePct),
      node.status,
    ]);

    const alertRows: Array<Array<string | number>> = (report?.incidents ?? []).map((incident) => [
      incident.title,
      incident.nodeName ?? "NA",
      incident.severity,
    ]);

    return [
      { title: "Fleet summary", headers: ["Metric", "Value"], rows: summaryRows },
      {
        title: "Node comparison",
        headers: ["Node", "Region", "Uptime", "Latency", "Requests", "Error rate", "Status"],
        rows: nodeRows.length ? nodeRows : [["No nodes", "-", "-", "-", "-", "-", "-"]],
      },
      {
        title: "Alerts",
        headers: ["Alert", "Node", "Severity", "Status"],
        rows: alertRows.length ? alertRows : [["No alerts", "-", "-", "-"]],
      },
    ];
  }, [report]);
  const metricsItems = useMemo(() => {
    return [
      {
        label: "Average Uptime",
        value: formatPercent(report?.summary?.avgUptimePct),
        delta: report?.summary?.uptimeDeltaPct,
        context: "Higher uptime reduces disruption for your users.",
        icon: "📊",
      },
      {
        label: "Total Requests",
        value: formatNumberCompact(report?.summary?.totalRequests),
        delta: report?.summary?.requestsDeltaPct,
        context: "Shows total demand handled by the fleet.",
        icon: "⚡",
      },
      {
        label: "Incidents",
        value: report?.summary?.incidents ?? "NA",
        delta: undefined,
        context: "Open incidents require operational follow-up.",
        icon: "🚨",
      },
      {
        label: "Healthy Nodes",
        value: report?.summary?.healthyNodes ?? "NA",
        delta: undefined,
        context: "Count of nodes operating without issues.",
        icon: "✅",
      },
    ];
  }, [
    report?.summary?.avgUptimePct,
    report?.summary?.uptimeDeltaPct,
    report?.summary?.totalRequests,
    report?.summary?.requestsDeltaPct,
    report?.summary?.incidents,
    report?.summary?.healthyNodes,
  ]);
  const handleDownloadCsv = () => {
    downloadCsvReport(`rpc-fleet-report-${range}.csv`, exportSections);
  };

  const handleDownloadHtml = () => {
    downloadHtmlReport(`rpc-fleet-report-${range}.html`, "RPC Fleet Report", exportSections);
  };

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      await downloadPdfReport(`rpc-fleet-report-${range}.pdf`, "RPC Fleet Report", exportSections);
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Heading as="h1" className="text-3xl font-semibold text-[#0B1220]">
            RPC Fleet Report
          </Heading>
          <Z4Navigation
            breadcrumb={{
              items: [
                { label: "Dashboard", href: ROUTES.PLATFORM.PAGE.DASHBOARD, as: Link },
                { label: "RPC Fleet Report", href: ROUTES.PLATFORM.PAGE.REPORTS_RPC_FLEET, isActive: true, as: Link },
              ],
            }}
          />
          <p className="text-sm font-medium text-[#4B5365]">
            Aggregated Health, Usage Trends, and Node Performance for your RPC Fleet.
          </p>
          {periodLabel ? <p className="text-xs text-slate-500">Report period: {periodLabel}</p> : null}
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
          initialMessage="Loading RPC fleet report..."
          messages={[
            "Taking too long? Brew some coffee! ☕",
            "Processing RPC metrics...",
            "Calculating fleet performance... almost ready! 🚀",
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
          message="You don’t have any RPC nodes yet. Purchase a subscription to start generating fleet insights."
          href={ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS}
          ctaLabel="Browse RPC Services"
        />
      ) : (
        <>
          <MetricsOverview
            items={metricsItems}
            title="Key metrics with context"
            description="Why each fleet metric matters and how it moved."
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <ReportCard
              title="Usage Trends"
              description="How request volume changed across the selected period."
              action={
                <Tooltip text="Track demand spikes to plan scaling and caching.">
                  <span className="cursor-help text-xs font-semibold text-slate-500">Why it matters</span>
                </Tooltip>
              }
            >
              <TrendsAreaChart
                data={rpcTrendsData || []}
                dataKey="requests"
                color="#22c55e"
                gradientId="rpcUsage"
                height="15rem"
                xAxisKey="date"
                emptyTitle="No usage data"
                emptyDescription="Usage trends will appear once data is available."
              />
            </ReportCard>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ReportCard title="Top Performers" description="Nodes with the highest uptime this period.">
              <HighlightsList
                items={highlights.best.map((node) => ({
                  title: node.nodeName,
                  subtitle: node.region ?? "Region N/A",
                  value: formatPercent(node.uptimePct),
                  valueLabel: "Uptime",
                }))}
                emptyTitle="No highlights"
                emptyDescription="Top performers will appear once data is available."
              />
            </ReportCard>

            <ReportCard title="Low Performers" description="Nodes with the lowest uptime this period.">
              <HighlightsList
                items={highlights.worst.map((node) => ({
                  title: node.nodeName,
                  subtitle: node.region ?? "Region N/A",
                  value: formatPercent(node.uptimePct),
                  valueLabel: "Uptime",
                  color: "#D97706",
                }))}
                emptyTitle="No low performers"
                emptyDescription="Low performers will appear once data is available."
              />
            </ReportCard>
          </div>

          <ReportCard title="RPC Node Metrics" description="Compare uptime, latency, and errors node by node.">
            <PaginatedComparisonTable
              data={report?.nodes ?? []}
              columns={[
                { key: "node", label: "Node" },
                { key: "uptime", label: "Uptime" },
                { key: "requests", label: "Requests" },
                { key: "status", label: "Status" },
              ]}
              renderRow={buildRow}
              emptyTitle="No node data"
              emptyDescription="Node metrics will appear once data is available."
              pageSize={5}
            />
          </ReportCard>
          <ReportCard title="What happened during this period" description="Summary of the fleet.">
            <KeyInsights periodHighlights={periodHighlights} />
          </ReportCard>
        </>
      )}
    </div>
  );
};

export default RPCFleetReportPageClient;
