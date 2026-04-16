"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Z4Navigation } from "@zeeve-platform/ui";
import { useConfigStore } from "@/store/config";
import ZeeveLoader from "@/components/shared/ZeeveLoader";
import { getStoredAccessToken } from "@/utils/auth-token";
import ROUTES from "@/routes";

interface TicketCenterResponse {
  iframeUrl?: string;
  message?: string;
}

const SupportTicketsPageClient = () => {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const config = useConfigStore((state) => state.config);
  const supportEmail = config?.other?.supportEmail ?? "support@zeeve.io";

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError("Your session has expired. Please log in again to view support tickets.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadTickets = async () => {
      try {
        const response = await fetch("/api/support/crisp-ticket-center", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        const body = (await response.json().catch(() => null)) as TicketCenterResponse | null;

        if (!response.ok) {
          setError(body?.message ?? "Unable to load support tickets.");
          return;
        }

        if (!body?.iframeUrl) {
          setError("Ticket Center is temporarily unavailable.");
          return;
        }

        setIframeUrl(body.iframeUrl);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError("Unable to load support tickets.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadTickets();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="flex min-h-screen flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Support Center</h1>
          <Z4Navigation
            breadcrumb={{
              items: [
                { href: ROUTES.PLATFORM.PAGE.DASHBOARD, label: "Dashboard", as: Link },
                { href: ROUTES.PLATFORM.PAGE.SUPPORT_TICKETS, label: "Support Center", isActive: true, as: Link },
              ],
            }}
          />
          <p className="text-sm text-slate-600">
            Use tickets for ongoing support and keep secondary help channels in one place.
          </p>
        </div>
        <a
          href={`mailto:${supportEmail}`}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
        >
          Email Support
        </a>
      </header>
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 sm:px-6">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <span className="inline-flex size-2 rounded-full bg-emerald-500"></span>
            Ticket Workspace
          </div>
          <span className="text-xs uppercase tracking-[0.18em] text-slate-400">In-app support</span>
        </div>
        <div className="flex min-h-[68vh] flex-1 flex-col sm:min-h-[70vh] lg:min-h-[72vh]">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <ZeeveLoader label="Loading tickets..." />
            </div>
          ) : error ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
              <h2 className="text-base font-semibold text-slate-900">Unable to load Ticket Workspace</h2>
              <p className="text-sm text-slate-600">{error}</p>
            </div>
          ) : (
            <iframe
              title="Support Ticket Workspace"
              src={iframeUrl ?? undefined}
              referrerPolicy="origin"
              sandbox="allow-forms allow-popups allow-modals allow-downloads allow-scripts allow-same-origin"
              className="size-full flex-1"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SupportTicketsPageClient;
