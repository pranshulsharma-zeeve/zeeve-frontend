import React from "react";
import Link from "next/link";
import { Button, IconButton, tx } from "@zeeve-platform/ui";
import { IconCard1 } from "@zeeve-platform/icons/money/outline";
import { IconBell, IconPlus } from "@zeeve-platform/icons/essential/outline";

interface AccountOverviewProps {
  monthlyAmount: string;
  activeSubscriptions: number;
  ctaHref: string;
  onCtaClick?: () => void;
  onNotificationsClick?: () => void;
  className?: string;
}

const AccountOverview = ({
  monthlyAmount,
  activeSubscriptions,
  ctaHref,
  onCtaClick,
  onNotificationsClick,
  className,
}: AccountOverviewProps) => {
  return (
    <section
      className={tx(
        "flex flex-col gap-6 rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 text-white shadow-[0_14px_32px_rgba(14,165,233,0.35)]">
            <IconCard1 className="text-xl" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Monthly Subscription</p>
            <p className="text-2xl font-semibold text-slate-900">{monthlyAmount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-inner">
            Active subscriptions: <span className="font-semibold text-slate-900">{activeSubscriptions}</span>
          </div>

          <IconButton
            aria-label="View notifications"
            variant="ghost"
            className="relative size-11 rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.12)] transition hover:border-slate-300 hover:text-slate-900"
            onClick={onNotificationsClick}
          >
            <IconBell className="text-lg" />
            <span className="absolute right-2 top-2 inline-flex size-2.5 rounded-full bg-rose-500" />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link href={ctaHref} className="inline-flex">
          <Button
            iconLeft={<IconPlus className="text-lg" />}
            className="rounded-xl bg-gradient-to-r from-[#4C1D95] via-[#6C37FF] to-[#7B61FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(123,97,255,0.35)] transition hover:shadow-[0_22px_50px_rgba(123,97,255,0.45)]"
            onClick={onCtaClick}
          >
            Create
          </Button>
        </Link>

        <p className="text-sm text-slate-500">
          Keep track of billing and renewals so your services never hit downtime.
        </p>
      </div>
    </section>
  );
};

export default AccountOverview;
