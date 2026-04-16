"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heading, Tooltip, Z4Navigation } from "@zeeve-platform/ui";
import { EmptyState, HealthBadge, ReportCard, FancyReportLoader } from "@/modules/reports/components";
import { downloadCsvReport, downloadHtmlReport, downloadPdfReport } from "@/modules/reports/export";
import { finalizeHighlights, formatCurrencyCompact, formatPercent } from "@/modules/reports/utils";
import type { ReportRange, ValidatorNodeSummary } from "@/types/reporting";
import usePlatformService from "@/services/platform/use-platform-service";
import ROUTES from "@/routes";
import { formatDateWithoutTime } from "@/utils/date";
import { toCapitalize } from "@/utils/helpers";
import MetricsOverview from "@/components/reports/MetricsOverview";
import TrendsAreaChart from "@/components/reports/TrendsAreaChart";
import HighlightsList from "@/components/reports/HighlightsList";
import DonutHealthChart from "@/components/reports/DonutHealthChart";
import KeyInsights from "@/components/reports/KeyInsights";
import PaginatedComparisonTable from "@/components/reports/PaginatedComparisonTable";
import { NoNodesBanner } from "@/components/reports/NoNodesBanner";
import { ReportActions } from "@/components/reports/ReportActions";

const ValidatorFleetReportPageClient = () => {
  const [range, setRange] = useState<ReportRange>("weekly");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const {
    request: { data, isLoading },
  } = usePlatformService().reports.validatorFleet(range);

  const report = data?.data || null;
  const hasValidatorNodes = (report?.summary?.totalValidators ?? 0) > 0;
  const shouldShowNoNodesBanner = Boolean(report) && !isLoading && !hasValidatorNodes;
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

  const usageTrends = useMemo(() => {
    if (!report?.trends || report.trends.length === 0) {
      return [];
    }
    return report.trends.map((trend, index) => {
      if (typeof trend === "number") {
        return {
          date: `Point ${index + 1}`,
          rewards: trend,
        };
      }

      return {
        date: trend.date ?? `Point ${index + 1}`,
        rewards: trend.rewards ?? 0,
      };
    });
  }, [report?.trends]);

  const periodLabel = useMemo(() => {
    if (!report?.meta?.periodStart || !report?.meta?.periodEnd) {
      return "";
    }
    return `${formatDateWithoutTime(report.meta.periodStart)} - ${formatDateWithoutTime(report.meta.periodEnd)}`;
  }, [report?.meta?.periodStart, report?.meta?.periodEnd]);

  const buildRow = (node: ValidatorNodeSummary) => (
    <>
      <td className="px-6 py-4">
        <Link
          href={`${ROUTES.PLATFORM.PAGE.REPORTS_VALIDATOR_NODE}/${node.validatorId}`}
          className="font-semibold text-slate-900 transition-colors hover:text-brand-primary"
        >
          {node.validatorName}
        </Link>
      </td>
      <td className="px-6 py-4 font-medium text-slate-700">{formatPercent(node.uptimePct)}</td>
      <td className="px-6 py-4 font-medium text-slate-700">{formatCurrencyCompact(node.stake)}</td>
      <td className="px-6 py-4 font-medium text-slate-700">{formatCurrencyCompact(node.rewards)}</td>
      <td className="px-6 py-4">
        <HealthBadge status={node.status} />
      </td>
    </>
  );

  const metricsItems = useMemo(() => {
    return [
      {
        label: "Total Validators",
        value: report?.summary?.totalValidators ?? "NA",
        context: "Total validators in your fleet.",
        icon: "📊",
      },
      {
        label: "Active Validators",
        value: report?.summary?.activeValidators ?? "NA",
        context: "Validators Currently Earning Rewards.",
        icon: "✅",
      },
      {
        label: "Total Stake",
        value: formatCurrencyCompact(report?.summary?.totalStake ?? 0),
        context: "Delegator Trust Reflected in Staked Assets.",
        icon: "🔐",
      },
      {
        label: "Total Rewards",
        value: formatCurrencyCompact(report?.summary?.totalRewards ?? 0),
        context: "Total Validator Earnings This Period.",
        icon: "💰",
      },
    ];
  }, [
    report?.summary?.totalValidators,
    report?.summary?.activeValidators,
    report?.summary?.totalStake,
    report?.summary?.totalRewards,
  ]);

  const healthData = useMemo(() => {
    return [
      { name: "Good", value: report?.healthMix?.good ?? 0, color: "#16A34A" },
      { name: "Warning", value: report?.healthMix?.warning ?? 0, color: "#CA8A04" },
      { name: "Critical", value: report?.healthMix?.critical ?? 0, color: "#DC2626" },
    ];
  }, [report?.healthMix]);

  const periodHighlights = useMemo(() => {
    return finalizeHighlights(
      [
        report?.summary?.totalRewards
          ? `Total rewards reached ${formatCurrencyCompact(report.summary.totalRewards)} this period.`
          : null,
        report?.summary?.totalStake ? `Total stake is ${formatCurrencyCompact(report.summary.totalStake)}.` : null,
        report?.summary?.activeValidators ? `${report.summary.activeValidators} validators are active.` : null,
        report?.summary?.jailedValidators && report.summary.jailedValidators > 0
          ? `${report.summary.jailedValidators} validator${report.summary.jailedValidators === 1 ? "" : "s"} jailed.`
          : "No validators jailed.",
      ],
      [
        "Validator participation remained stable across the fleet.",
        "Delegator activity tracked within expected range.",
        "Performance stayed within normal operating thresholds.",
      ],
    );
  }, [
    report?.summary?.totalRewards,
    report?.summary?.totalStake,
    report?.summary?.activeValidators,
    report?.summary?.jailedValidators,
  ]);

  const exportSections = useMemo(() => {
    const summaryRows: Array<Array<string | number>> = [
      ["Total validators", report?.summary?.totalValidators ?? "NA"],
      ["Active validators", report?.summary?.activeValidators ?? "NA"],
      ["Jailed validators", report?.summary?.jailedValidators ?? "NA"],
      ["Total stake", formatCurrencyCompact(report?.summary?.totalStake) ?? "NA"],
      ["Total rewards", formatCurrencyCompact(report?.summary?.totalRewards) ?? "NA"],
      ["Status", report?.summary?.status ?? "NA"],
    ];

    const validatorRows: Array<Array<string | number>> = (report?.validators ?? []).map((validator) => [
      validator.validatorName ?? "NA",
      formatPercent(validator.uptimePct) ?? "NA",
      formatCurrencyCompact(validator.stake) ?? "NA",
      formatCurrencyCompact(validator.rewards) ?? "NA",
      validator.status ?? "NA",
    ]);

    const incidentRows: Array<Array<string | number>> = (report?.incidents ?? []).map((incident) => [
      incident.title,
      incident.severity ?? "NA",
      incident.description ?? "",
    ]);

    const insightRows: Array<Array<string | number>> = (report?.insights ?? []).map((insight) => [
      insight.title,
      insight.severity ?? "NA",
      insight.description ?? "",
    ]);

    return [
      { title: "Fleet summary", headers: ["Metric", "Value"], rows: summaryRows },
      {
        title: "Validators",
        headers: ["Validator", "Uptime", "Stake", "Rewards", "Status"],
        rows: validatorRows.length ? validatorRows : [["No validators", "-", "-", "-", "-"]],
      },
      {
        title: "Incidents",
        headers: ["Incident", "Severity", "Description"],
        rows: incidentRows.length ? incidentRows : [["No incidents", "-", "-"]],
      },
      {
        title: "Insights",
        headers: ["Insight", "Description"],
        rows: insightRows.length ? insightRows : [["No insights", "-"]],
      },
    ];
  }, [report]);

  const handleDownloadCsv = () => {
    downloadCsvReport(`validator-fleet-report-${range}.csv`, exportSections);
  };

  const handleDownloadHtml = () => {
    downloadHtmlReport(`validator-fleet-report-${range}.html`, "Validator Fleet Report", exportSections);
  };

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      await downloadPdfReport(`validator-fleet-report-${range}.pdf`, "Validator Fleet Report", exportSections);
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Heading as="h1" className="text-3xl font-semibold text-[#0B1220]">
            Validator Fleet Report
          </Heading>
          <Z4Navigation
            breadcrumb={{
              items: [
                { label: "Dashboard", href: ROUTES.PLATFORM.PAGE.DASHBOARD, as: Link },
                {
                  label: "Validator Fleet Report",
                  href: ROUTES.PLATFORM.PAGE.REPORTS_VALIDATOR_FLEET,
                  isActive: true,
                  as: Link,
                },
              ],
            }}
          />
          <p className="text-sm font-medium text-[#4B5365]">
            Stake, Rewards, and Validator Performance Across Your Fleet.
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
          initialMessage="Loading validator fleet report..."
          messages={[
            "Taking too long? Grab a cup of tea! ☕",
            "Analyzing validator performance...",
            "Crunching the numbers... almost there! 📊",
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
          message="You don’t have any Validator Nodes yet. Launch a Validator to view Fleet Performance."
          href={ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS}
          ctaLabel="Launch Validator"
        />
      ) : (
        <>
          <MetricsOverview
            items={metricsItems}
            title="Key metrics with context"
            description="Why each fleet metric matters and how it performed."
          />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ReportCard
              title="Validator Performance Trends"
              description="Fleet Performance Trend Over the Period."
              action={
                <Tooltip text="Track how your fleet metrics change over time.">
                  <span className="cursor-help text-xs font-semibold text-slate-500">Why it matters</span>
                </Tooltip>
              }
            >
              <TrendsAreaChart
                data={usageTrends}
                dataKey="rewards"
                color="#EC4899"
                gradientId="fleetTrend"
                valueFormatter={(value) => formatCurrencyCompact(value)}
                height="h-52"
                xAxisKey="date"
                emptyTitle="No Trends Data"
                emptyDescription="Trends will appear once available."
              />
            </ReportCard>
            <ReportCard title="Incidents" description="Fleet Incidents and Alerts Detected.">
              {report?.incidents && report.incidents.length > 0 ? (
                <div className="space-y-4">
                  {report.incidents.map((incident) => (
                    <div key={incident.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">{incident.title}</div>
                        <HealthBadge status={incident.severity} />
                      </div>
                      {incident.description ? (
                        <p className="mt-2 text-sm text-slate-600">{incident.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No Incidents" description="No Incidents Detected on your Validators." />
              )}
            </ReportCard>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_3fr]">
            <ReportCard
              title="Health Distribution"
              description="Validators Health Status across the Fleet."
              action={
                <Tooltip text="Health status is based on uptime: Healthy (≥95%), Warning (60-95%), Critical (≤60%).">
                  <span className="cursor-help text-xs font-semibold text-slate-500">How to read</span>
                </Tooltip>
              }
            >
              <DonutHealthChart
                data={healthData}
                total={report?.summary?.totalValidators ?? 0}
                totalLabel="Total Validators"
                height="15rem"
                legend={true}
                emptyTitle="No Health Data"
                emptyDescription="Health Metrics will appear once available."
              />
            </ReportCard>

            <ReportCard
              title="Risk Indicators"
              description="Fleet Risk Assessment."
              action={
                <Tooltip text="Monitor these indicators to prevent validator issues.">
                  <span className="cursor-help text-xs font-semibold text-slate-500">Why it matters</span>
                </Tooltip>
              }
            >
              <HighlightsList
                items={[
                  {
                    title: "Slashing Risk",
                    subtitle: "Risk of validator penalties",
                    value: toCapitalize(report?.riskIndicators?.slashingRisk ?? "NA"),
                    valueLabel: "Risk Level",
                  },
                  {
                    title: "Jailing Risk",
                    subtitle: "Risk of validator jailing",
                    value: toCapitalize(report?.riskIndicators?.jailingRisk ?? "NA"),
                    valueLabel: "Risk Level",
                  },
                  {
                    title: "Stake Concentration",
                    subtitle: "Distribution of delegated stake",
                    value: toCapitalize(report?.riskIndicators?.stakeConcentration ?? "NA"),
                    valueLabel: "Concentration Level",
                  },
                ]}
                emptyTitle="No Risk Data"
                emptyDescription="Risk Indicators will appear once available."
              />
            </ReportCard>
          </div>

          <ReportCard title="Validator Comparison" description="Compare Uptime, Stake, and Rewards.">
            <PaginatedComparisonTable
              data={report?.validators ?? []}
              columns={[
                { key: "validator", label: "Validator" },
                { key: "uptime", label: "Uptime" },
                { key: "stake", label: "Stake" },
                { key: "rewards", label: "Rewards" },
                { key: "status", label: "Status" },
              ]}
              renderRow={buildRow}
              emptyTitle="No Validator Data"
              emptyDescription="Validator Metrics will appear once available."
              pageSize={10}
            />
          </ReportCard>
          <ReportCard
            title="Insights & Recommendations"
            description="Summary of important metrics with insights to help you monitor node's health and performance."
          >
            {(periodHighlights && periodHighlights.length > 0) || (report?.insights && report.insights.length > 0) ? (
              <KeyInsights insights={report?.insights} periodHighlights={periodHighlights} />
            ) : (
              <EmptyState title="No Insights" description="Insights will appear once data is available." />
            )}
          </ReportCard>
        </>
      )}
    </div>
  );
};

export default ValidatorFleetReportPageClient;
