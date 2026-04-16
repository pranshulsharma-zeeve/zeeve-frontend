"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heading, Tooltip, Z4Navigation } from "@zeeve-platform/ui";
import { ReportCard, FancyReportLoader } from "@/modules/reports/components";
import TrendsAreaChart from "@/components/reports/TrendsAreaChart";
import HighlightsList from "@/components/reports/HighlightsList";
import DonutHealthChart from "@/components/reports/DonutHealthChart";
import { downloadCsvReport, downloadHtmlReport, downloadPdfReport } from "@/modules/reports/export";
import { formatLatency, formatNumberCompact, formatPercent, formatSignedPercent } from "@/modules/reports/utils";
import type { ReportRange } from "@/types/reporting";
import usePlatformService from "@/services/platform/use-platform-service";
import ROUTES from "@/routes";
import { formatDateWithoutTime } from "@/utils/date";
import MetricsOverview from "@/components/reports/MetricsOverview";
import { ReportActions } from "@/components/reports/ReportActions";

const CHART_COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EC4899",
  "#0EA5E9",
  "#8B5CF6",
  "#EF4444", // Red
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#84CC16", // Lime
  "#06B6D4", // Cyan
  "#A855F7", // Purple
  "#E11D48", // Rose
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#D946EF", // Fuchsia
];

const RPCNodeReportPageClient = () => {
  const params = useParams();
  const nodeId = params.id as string;
  const [range, setRange] = useState<ReportRange>("weekly");
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const {
    request: { data, isLoading },
  } = usePlatformService().reports.rpcNode(nodeId, range);

  const report = data?.data || null;

  const healthTimeline = useMemo(() => {
    if (!report?.trends || report.trends.length === 0) {
      return [];
    }
    return report.trends.map((trend) => ({
      date: trend.date,
      uptime: trend.uptimePct ?? 0,
    }));
  }, [report?.trends]);

  const periodLabel = useMemo(() => {
    if (!report?.meta?.periodStart || !report?.meta?.periodEnd) {
      return "";
    }
    return `${formatDateWithoutTime(report.meta.periodStart)} - ${formatDateWithoutTime(report.meta.periodEnd)}`;
  }, [report?.meta?.periodStart, report?.meta?.periodEnd]);

  const securityStatus = useMemo(() => {
    if (!report?.security) {
      return [];
    }
    return [
      {
        label: "DDoS protection",
        value: report.security.ddosProtection ? "enabled" : "disabled",
        status: report.security.ddosProtection ? "good" : "warning",
      },
      {
        label: "Firewall",
        value: report.security.firewallEnabled ? "enabled" : "disabled",
        status: report.security.firewallEnabled ? "good" : "warning",
      },
      {
        label: "Last Security Check",
        value: report.security.lastSecurityCheck ? formatDateWithoutTime(report.security.lastSecurityCheck) : "unknown",
        status: report.security.lastSecurityCheck ? "good" : "warning",
      },
    ];
  }, [report?.security]);

  const methodChartData = useMemo(() => {
    if (!report?.methodBreakdown || report.methodBreakdown.length === 0) {
      return [];
    }
    return report.methodBreakdown.map((method, index) => ({
      name: method.method.replace("MethodCount", ""),
      value: method.callCount || 0,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [report?.methodBreakdown]);

  const totalMethodCalls = useMemo(() => {
    return methodChartData.reduce((sum, method) => sum + method.value, 0);
  }, [methodChartData]);

  const metricsItems = useMemo(() => {
    return [
      {
        label: "Status",
        value: formatPercent(report?.metrics?.uptimePct),
        context: "Health signal based on uptime and errors.",
        icon: "📊",
      },
      {
        label: "Uptime",
        value: formatPercent(report?.metrics?.uptimePct),
        // delta: report?.metrics?.uptimeChangePercent,
        context: "Availability for requests to this node.",
        icon: "📈",
      },
      {
        label: "Requests",
        value: formatNumberCompact(report?.metrics?.requestCount),
        // delta: report?.metrics?.requestChangePercent,
        context: "Total workload served by this node.",
        icon: "⚡",
      },
    ];
  }, [report?.metrics?.uptimePct, report?.metrics?.requestCount]);

  const exportSections = useMemo(() => {
    const overviewRows: Array<Array<string | number>> = [
      ["Node name", report?.meta?.nodeName ?? nodeId],
      ["Status", report?.overview?.status ?? "NA"],
      ["Uptime", formatPercent(report?.metrics?.uptimePct) ?? "NA"],
      ["Uptime change", formatSignedPercent(report?.metrics?.uptimeChangePercent)],
      ["Avg latency", formatLatency(report?.metrics?.latencyMs) ?? "NA"],
      ["Latency change", formatSignedPercent(report?.metrics?.latencyChangePercent)],
      ["Requests", formatNumberCompact(report?.metrics?.requestCount) ?? "NA"],
      ["Requests change", formatSignedPercent(report?.metrics?.requestChangePercent)],
      ["Error rate", formatPercent(report?.metrics?.errorRatePct) ?? "NA"],
      ["Error rate change", formatSignedPercent(report?.metrics?.errorChangePercent)],
    ];

    const benchmarkRows: Array<Array<string | number>> = [
      ["Uptime vs Network", `${report?.benchmarks?.uptimeVsNetwork ?? "NA"}`],
      ["Latency vs Network", `${report?.benchmarks?.latencyVsNetwork ?? "NA"}`],
      ["Reliability vs Network", `${report?.benchmarks?.reliabilityVsNetwork ?? "NA"}`],
      ["Error rate", formatPercent(report?.benchmarks?.errorRatePct) ?? "NA"],
      ["Peak RPS", formatNumberCompact(report?.benchmarks?.peakRps) ?? "NA"],
    ];

    const methodRows: Array<Array<string | number>> = (report?.methodBreakdown ?? []).map((method) => [
      method?.method ?? "NA",
      method?.callCount ?? 0,
    ]);

    const securityRows: Array<Array<string | number>> = [
      ["DDoS protection", report?.security?.ddosProtection ? "enabled" : "disabled"],
      ["Firewall", report?.security?.firewallEnabled ? "enabled" : "disabled"],
      // ["TLS status", report?.security?.tlsStatus ?? "NA"],
      ["Last security check", report?.security?.lastSecurityCheck ?? "NA"],
    ];

    const incidentRows: Array<Array<string | number>> = (report?.incidents ?? []).map((incident) => [
      incident.title,
      incident.severity,
    ]);

    return [
      { title: "Node overview", headers: ["Metric", "Value"], rows: overviewRows },
      { title: "Performance benchmarks", headers: ["Metric", "Value"], rows: benchmarkRows },
      {
        title: "Method usage",
        headers: ["Method", "Count"],
        rows: methodRows.length ? methodRows : [["No data", "0"]],
      },
      { title: "Security status", headers: ["Check", "Status"], rows: securityRows },
      {
        title: "Incidents",
        headers: ["Incident", "Severity", "Status"],
        rows: incidentRows.length ? incidentRows : [["No incidents", "-", "-"]],
      },
    ];
  }, [report, nodeId]);

  const handleDownloadCsv = () => {
    downloadCsvReport(
      `rpc-node-report-${nodeId}-${range}-${range}-${report?.meta?.nodeName ?? nodeId}.csv`,
      exportSections,
    );
  };

  const handleDownloadHtml = () => {
    downloadHtmlReport(
      `rpc-node-report-${nodeId}-${range}-${range}-${report?.meta?.nodeName ?? nodeId}.html`,
      "RPC Node Report",
      exportSections,
    );
  };

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      await downloadPdfReport(
        `rpc-node-report-${range}-${report?.meta?.nodeName ?? nodeId}.pdf`,
        "RPC Node Report",
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
            RPC Node Report
          </Heading>
          <Z4Navigation
            breadcrumb={{
              items: [
                { label: "Dashboard", href: ROUTES.PLATFORM.PAGE.DASHBOARD, as: Link },
                { label: "RPC Fleet Report", href: ROUTES.PLATFORM.PAGE.REPORTS_RPC_FLEET, as: Link },
                {
                  label: report?.meta?.nodeName ?? nodeId,
                  href: `${ROUTES.PLATFORM.PAGE.REPORTS_RPC_NODE}/${nodeId}`,
                  isActive: true,
                  as: Link,
                },
              ],
            }}
          />
          <p className="text-sm font-medium text-[#4B5365]">
            Detailed Health and Performance Insights for this RPC Node.
          </p>
          {periodLabel ? <p className="text-xs text-slate-500">Report period: {periodLabel}</p> : null}
        </div>
        <ReportActions range={range} onRangeChange={setRange} downloadActions={downloadMenu} />
      </div>

      {isLoading ? (
        <FancyReportLoader
          initialMessage="Loading node report..."
          messages={[
            "Taking too long? Grab a coffee! ☕",
            "Fetching RPC node data...",
            "Compiling performance metrics... stay with us! 💡",
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
            trendValue={report?.node?.uptimeDeltaPct}
            trendLabel="Uptime vs Last Period"
            verdict={executiveVerdict}
          /> */}

          <MetricsOverview
            items={metricsItems}
            title="Key metrics with context"
            description="Why each node metric matters and how it moved."
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ReportCard
              title="Health Timeline"
              description="Uptime trends across the selected period."
              action={
                <Tooltip text="Consistent lines indicate stable performance.">
                  <span className="cursor-help text-xs font-semibold text-slate-500">How to read</span>
                </Tooltip>
              }
            >
              <TrendsAreaChart
                data={healthTimeline}
                dataKey="uptime"
                color="#22C55E"
                gradientId="uptimeGradient"
                height="13rem"
                legend={false}
                xAxisKey="date"
                emptyTitle="No uptime data"
                emptyDescription="Uptime trends will appear once data is available."
              />
            </ReportCard>

            <ReportCard
              title="Method Usage Breakdown"
              description="Top JSON-RPC methods driving traffic."
              action={
                <Tooltip text="Use this to optimize caching for high-volume methods.">
                  <span className="cursor-help text-xs font-semibold text-slate-500">Why it matters</span>
                </Tooltip>
              }
            >
              <DonutHealthChart
                data={methodChartData}
                total={totalMethodCalls}
                totalLabel="Total Calls"
                height="15rem"
                // legend={true}
                emptyTitle="No method data"
                emptyDescription="Method breakdown will appear once data is available."
              />
            </ReportCard>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ReportCard title="Security & Reliability" description="Security checks and protection status.">
              <HighlightsList
                items={securityStatus.map((item) => ({
                  title: item.label,
                  subtitle: item.value,
                  value: item.status === "good" ? "✓" : item.status === "warning" ? "⚠" : "✗",
                  valueLabel: item.status === "good" ? "Active" : item.status === "warning" ? "Warning" : "Critical",
                  color:
                    item.status === "good"
                      ? "text-green-600"
                      : item.status === "warning"
                        ? "text-amber-600"
                        : "text-red-600",
                }))}
                emptyTitle="No security data"
                emptyDescription="Security details will appear once available."
                colorFrom="from-white"
                colorTo="to-blue-50"
              />
            </ReportCard>

            <ReportCard title="Incidents" description="Recent events affecting this node.">
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
                emptyTitle="No incidents"
                emptyDescription="This node has no active incidents."
                colorFrom="from-white"
                colorTo="to-red-50"
              />
            </ReportCard>
          </div>
        </>
      )}
    </div>
  );
};

export default RPCNodeReportPageClient;
