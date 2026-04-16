import React from "react";
import dayjs from "dayjs";
import { Button } from "@zeeve-platform/ui";
import { IconArrow1Right } from "@zeeve-platform/icons/arrow/outline";
import type { SettingsNodeSubscription, SettingsRollupSubscription } from "../hooks/useSettings";
import { toCapitalize } from "@/utils/helpers";

const DATE_FORMAT = "MMMM D, YYYY";
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatDate = (value?: string | null) => {
  if (!value) {
    return "NA";
  }
  const parsed = dayjs(value);
  if (!parsed.isValid()) {
    return value;
  }
  return parsed.format(DATE_FORMAT);
};

const formatCurrency = (value?: number | null) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return currencyFormatter.format(value);
  }
  return "NA";
};

const formatText = (value?: string | number | null) => {
  if (value === null || value === undefined) {
    return "NA";
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    const formatted = trimmed.replace(/_/g, " "); // Replace underscores with spaces
    return formatted.length > 0 ? formatted : "NA";
  }
  return String(value);
};

const getDisplayStatus = (status?: string | null, nodeStatus?: string | null, paymentLink?: string | null) => {
  const normalizedNodeStatus = `${nodeStatus ?? ""}`.toLowerCase();
  const isDraft = normalizedNodeStatus === "draft";
  const normalizedStatus = `${status ?? ""}`.toLowerCase();
  const isSuspendedWithPaymentLink = Boolean(paymentLink) && normalizedStatus.includes("suspend");
  if (
    normalizedNodeStatus.includes("cancellation_requested") ||
    normalizedNodeStatus.includes("cancellation requested")
  ) {
    return "Cancellation Requested";
  }
  if (
    isDraft ||
    isSuspendedWithPaymentLink ||
    normalizedStatus.includes("pending_payment") ||
    normalizedStatus.includes("pending payment")
  ) {
    return "Payment Pending";
  }
  if (normalizedStatus.includes("cancellation_requested") || normalizedStatus.includes("cancellation requested")) {
    return "Cancellation Requested";
  }
  return toCapitalize(formatText(status));
};

const getBadgeStatus = (status?: string | null, nodeStatus?: string | null, paymentLink?: string | null) => {
  const normalizedNodeStatus = `${nodeStatus ?? ""}`.toLowerCase();
  const normalizedStatus = `${status ?? ""}`.toLowerCase();
  if (
    normalizedNodeStatus.includes("cancellation_requested") ||
    normalizedNodeStatus.includes("cancellation requested")
  ) {
    return "cancellation_requested";
  }
  if (normalizedNodeStatus === "draft" || (paymentLink && normalizedStatus.includes("suspend"))) {
    return "pending_payment";
  }
  return status;
};

const getStatusBadgeClass = (value?: string | null) => {
  if (!value) {
    return "bg-gray-300 text-gray-900";
  }
  const normalized = value.toLowerCase();
  if (normalized.includes("cancellation_requested") || normalized.includes("cancellation requested")) {
    return "bg-[#F87171] text-white";
  }
  if (normalized.includes("active") || normalized.includes("paid") || normalized.includes("success")) {
    return "bg-[#16A34A] text-white";
  }
  if (
    normalized.includes("suspend") ||
    normalized.includes("pending") ||
    normalized.includes("progress") ||
    normalized.includes("processing") ||
    normalized.includes("inactive") ||
    normalized.includes("hold") ||
    normalized.includes("pause")
  ) {
    return "bg-[#FACC15] text-[#3F3F00]";
  }
  if (normalized.includes("failed") || normalized.includes("cancel") || normalized.includes("expired")) {
    return "bg-[#F87171] text-white";
  }
  return "bg-gray-500 text-white";
};

interface SubscriptionField {
  label: string;
  value: React.ReactNode;
}

interface BaseSubscriptionCardProps {
  category: string;
  subtitle?: string | null;
  fields: SubscriptionField[];
  onCancel?: () => void;
  isCanceling?: boolean;
  onCompletePayment?: () => void;
  isCompletingPayment?: boolean;
}

const SubscriptionCard = ({
  category,
  subtitle,
  fields,
  onCancel,
  isCanceling,
  onCompletePayment,
  isCompletingPayment,
}: BaseSubscriptionCardProps) => {
  const actionButton = onCompletePayment ? (
    <Button
      type="button"
      className="h-8 px-4 text-xs font-semibold"
      onClick={onCompletePayment}
      isDisabled={isCompletingPayment}
      isLoading={isCompletingPayment}
    >
      Complete Payment
      <IconArrow1Right className="mt-0.5 size-3" />
    </Button>
  ) : onCancel ? (
    <Button
      type="button"
      variant="ghost"
      className="h-8 px-3 text-xs font-semibold text-[#EB5757] hover:text-[#EB5757]"
      onClick={onCancel}
      isDisabled={isCanceling}
      isLoading={isCanceling}
    >
      Cancel Subscription
      <IconArrow1Right className="mt-0.5 size-3" />
    </Button>
  ) : null;

  return (
    <article className="relative flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:pr-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{category}</span>
          {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
        </div>

        {actionButton ? (
          <div className="flex w-full sm:w-auto sm:justify-end">
            {onCompletePayment ? (
              <Button
                type="button"
                className="h-10 w-full px-4 text-sm font-semibold sm:h-8 sm:w-auto sm:px-4 sm:text-xs"
                onClick={onCompletePayment}
                isDisabled={isCompletingPayment}
                isLoading={isCompletingPayment}
              >
                Complete Payment
                <IconArrow1Right className="mt-0.5 size-3" />
              </Button>
            ) : onCancel ? (
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-full justify-center rounded-md border border-[#FECACA] px-3 text-sm font-semibold text-[#EB5757] hover:text-[#EB5757] sm:h-8 sm:w-auto sm:border-0 sm:px-3 sm:text-xs"
                onClick={onCancel}
                isDisabled={isCanceling}
                isLoading={isCanceling}
              >
                Cancel Subscription
                <IconArrow1Right className="mt-0.5 size-3" />
              </Button>
            ) : null}
          </div>
        ) : null}
      </header>

      <section className="flex flex-col gap-3 rounded-md bg-[#f6f8ff] p-3">
        <dl className="grid grid-cols-1 gap-x-5 gap-y-2 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-2 text-sm leading-5">
              <dt className="min-w-[96px] text-[11px] font-medium uppercase tracking-wide text-gray-500 sm:min-w-[130px]">
                {field.label}
              </dt>
              <dd className="min-w-0 flex-1 text-gray-800">{field.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
};

interface NodeSubscriptionCardProps {
  subscription: SettingsNodeSubscription;
  onCancel?: (subscription: SettingsNodeSubscription) => void;
  isCanceling?: boolean;
  onCompletePayment?: (subscription: SettingsNodeSubscription) => void;
  isCompletingPayment?: boolean;
}

const NodeSubscriptionCard = ({
  subscription,
  onCancel,
  isCanceling,
  onCompletePayment,
  isCompletingPayment,
}: NodeSubscriptionCardProps) => {
  const displayStatus = getDisplayStatus(
    subscription.subscription_status,
    subscription.node_status,
    subscription.payment_link,
  );
  const badgeStatus = getBadgeStatus(
    subscription.subscription_status,
    subscription.node_status,
    subscription.payment_link,
  );
  const amountValue = formatCurrency(subscription.amount);
  const billingDateValue = formatDate(subscription.next_billing_date);
  const frequencyValue = toCapitalize(formatText(subscription.payment_frequency));
  const nodeNameValue = formatText(subscription.node_name);
  const planNameValue = formatText(subscription.plan_name);

  const fields: SubscriptionField[] = [
    {
      label: "Subscription Status",
      value: (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(badgeStatus)}`}
        >
          {displayStatus}
        </span>
      ),
    },
    {
      label: "Node Name",
      value: (
        <span className="block truncate text-sm font-medium text-gray-800" title={nodeNameValue}>
          {nodeNameValue}
        </span>
      ),
    },
    {
      label: "Next Billing Date",
      value: (
        <span className="block truncate text-sm font-medium text-gray-800" title={billingDateValue}>
          {billingDateValue}
        </span>
      ),
    },
    {
      label: "Payment Frequency",
      value: (
        <span className="block truncate text-sm font-medium text-gray-800" title={frequencyValue}>
          {frequencyValue}
        </span>
      ),
    },
    {
      label: "Plan Name",
      value: (
        <span className="block truncate text-sm font-medium text-gray-800" title={planNameValue}>
          {planNameValue}
        </span>
      ),
    },
    {
      label: "Amount",
      value: (
        <span className="block truncate text-sm font-semibold text-gray-900" title={amountValue}>
          {amountValue}
        </span>
      ),
    },
  ];

  return (
    <SubscriptionCard
      category="Smart Nodes"
      fields={fields}
      onCancel={onCancel ? () => onCancel(subscription) : undefined}
      isCanceling={isCanceling}
      onCompletePayment={onCompletePayment ? () => onCompletePayment(subscription) : undefined}
      isCompletingPayment={isCompletingPayment}
    />
  );
};

interface RollupSubscriptionCardProps {
  subscription: SettingsRollupSubscription;
  onCancel?: (subscription: SettingsRollupSubscription) => void;
  isCanceling?: boolean;
  onCompletePayment?: (subscription: SettingsRollupSubscription) => void;
  isCompletingPayment?: boolean;
}

const RollupSubscriptionCard = ({
  subscription,
  onCancel,
  isCanceling,
  onCompletePayment,
  isCompletingPayment,
}: RollupSubscriptionCardProps) => {
  const displayStatus = getDisplayStatus(
    subscription.subscription_status,
    subscription.node_status,
    subscription.payment_link,
  );
  const badgeStatus = getBadgeStatus(
    subscription.subscription_status,
    subscription.node_status,
    subscription.payment_link,
  );
  const amountValue = formatCurrency(subscription.amount);
  const billingDateValue = formatDate(subscription.next_billing_date);
  const frequencyValue = toCapitalize(formatText(subscription.payment_frequency));
  const nodeNameValue = formatText(subscription.node_name);
  const planNameValue = formatText(subscription.plan_name ?? subscription.service_name);

  const fields: SubscriptionField[] = [
    {
      label: "Subscription Status",
      value: (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(badgeStatus)}`}
        >
          {displayStatus}
        </span>
      ),
    },
    {
      label: "Rollup Name",
      value: (
        <span className="block truncate text-sm font-medium text-gray-800" title={nodeNameValue}>
          {nodeNameValue}
        </span>
      ),
    },
    {
      label: "Next Billing Date",
      value: (
        <span className="block truncate text-sm font-medium text-gray-800" title={billingDateValue}>
          {billingDateValue}
        </span>
      ),
    },
    {
      label: "Payment Frequency",
      value: (
        <span className="block truncate text-sm font-medium text-gray-800" title={frequencyValue}>
          {frequencyValue}
        </span>
      ),
    },
    {
      label: "Plan Name",
      value: (
        <span className="block truncate text-sm font-medium text-gray-800" title={planNameValue}>
          {planNameValue}
        </span>
      ),
    },
    {
      label: "Amount",
      value: (
        <span className="block truncate text-sm font-semibold text-gray-900" title={amountValue}>
          {amountValue}
        </span>
      ),
    },
  ];

  return (
    <SubscriptionCard
      category="Rollups"
      fields={fields}
      onCancel={onCancel ? () => onCancel(subscription) : undefined}
      isCanceling={isCanceling}
      onCompletePayment={onCompletePayment ? () => onCompletePayment(subscription) : undefined}
      isCompletingPayment={isCompletingPayment}
    />
  );
};

export { NodeSubscriptionCard, RollupSubscriptionCard };
