"use client";
import React, { useMemo } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import type { AxiosError } from "axios";
import Image from "next/image";
import { Button, Heading, tx } from "@zeeve-platform/ui";
import { IconDownload } from "@zeeve-platform/icons/product/outline";
import type { SettingsInvoiceRecord } from "../hooks/useSettings";
import ZeeveLoader from "@/components/shared/ZeeveLoader";

interface BillingTabProps {
  invoices: {
    items: SettingsInvoiceRecord[];
    isLoading: boolean;
    error?: Error | AxiosError | null;
    refresh: () => Promise<void> | void;
  };
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const formatDate = (value: string) => {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMMM D, YYYY") : value;
};

const formatStatus = (state: string) => {
  const normalized = state?.toLowerCase();
  if (["paid", "posted", "success", "done"].some((key) => normalized?.includes(key))) {
    return { label: "Paid", className: "bg-[#DCFCE7] text-[#166534]" };
  }
  if (["pending", "draft", "progress"].some((key) => normalized?.includes(key))) {
    return { label: "Pending", className: "bg-[#FEF9C3] text-[#854D0E]" };
  }
  if (["cancel", "fail", "error"].some((key) => normalized?.includes(key))) {
    return { label: "Failed", className: "bg-[#FEE2E2] text-[#991B1B]" };
  }
  return { label: state || "Unknown", className: "bg-[#E5E7EB] text-[#374151]" };
};

const BillingTab = ({ invoices }: BillingTabProps) => {
  const rows = useMemo(() => invoices.items ?? [], [invoices.items]);
  const hasRows = rows.length > 0;

  return (
    <section className="space-y-6">
      <div className="rounded-[18px] border border-[#E6E9FC] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] md:p-7 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <Heading as="h3" className="text-base font-semibold text-[#0F172A]">
            Invoices
          </Heading>
          <Button
            type="button"
            variant="ghost"
            className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-full border border-[#D7DAF5] text-brand-primary hover:border-brand-primary/60 hover:bg-[#F3F4FF] sm:size-[52px]"
            onClick={() => invoices.refresh?.()}
            isDisabled={invoices.isLoading}
            isLoading={invoices.isLoading}
            aria-label="Refresh invoice list"
            title="Refresh invoice list"
          >
            {!invoices.isLoading ? (
              <Image
                src="/assets/images/zeeve/refresh.png"
                alt="Refresh invoices"
                width={26}
                height={26}
                className="min-h-[22px] min-w-[22px] sm:min-h-[26px] sm:min-w-[26px]"
              />
            ) : null}
          </Button>
        </div>

        <div className="mt-6 overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
          {invoices.isLoading ? (
            <div className="flex items-center justify-center p-12">
              <ZeeveLoader label="Loading invoices..." />
            </div>
          ) : invoices.error ? (
            <div className="space-y-3 p-8 text-center text-sm text-[#991B1B]">
              <p>We couldn&apos;t load your invoices right now. Please try again.</p>
              <Button type="button" onClick={() => invoices.refresh?.()} className="mx-auto w-max">
                Retry
              </Button>
            </div>
          ) : hasRows ? (
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full min-w-[760px] table-auto divide-y divide-[#EEF2FF] text-sm text-[#111827]">
                <thead className="sticky top-0 z-10 bg-[#F8F9FF] text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  <tr>
                    <th className="px-5 py-4 text-left">Invoice Number</th>
                    <th className="px-5 py-4 text-left">Product</th>
                    <th className="px-5 py-4 text-left">Date</th>
                    <th className="px-5 py-4 text-left">Amount</th>
                    <th className="px-5 py-4 text-left">Status</th>
                    <th className="px-5 py-4 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF2FF]">
                  {rows.map((invoice) => {
                    const status = formatStatus(invoice.state);
                    return (
                      <tr key={invoice.invoice_id} className="transition hover:bg-[#F8F9FF]">
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#0F172A]">{invoice.invoice_number}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#4B5563]">
                          <span
                            className="block min-w-[140px] max-w-[220px] truncate"
                            title={invoice.product ?? "Unknown"}
                          >
                            {invoice.product ?? "Unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#4B5563]">{formatDate(invoice.date)}</td>
                        <td className="px-5 py-4 font-semibold text-[#0F172A]">{formatAmount(invoice.amount_total)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={tx(
                              "inline-flex rounded-[5px] px-3 py-1 text-xs font-semibold",
                              status.className,
                            )}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {invoice.download_url ? (
                            <Link
                              href={invoice.download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Download invoice ${invoice.invoice_number}`}
                              className="inline-flex size-9 items-center justify-center rounded-full border border-[#D7DAF5] text-brand-primary transition hover:border-[#B9BEEF] hover:bg-[#F3F4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7CCF6] focus-visible:ring-offset-2"
                            >
                              <IconDownload className="size-4" />
                            </Link>
                          ) : (
                            <span
                              className="inline-flex size-9 items-center justify-center rounded-full border border-[#D7DAF5] text-[#9CA3AF]"
                              aria-label="Download unavailable"
                            >
                              <IconDownload className="size-4" />
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#6B7280]">
              No invoices available yet. Once billing documents are generated, they&apos;ll appear here with download
              links.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BillingTab;
