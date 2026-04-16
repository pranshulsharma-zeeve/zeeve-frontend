import { ProtocolDetailsApiItem, ProtocolPlanApi, ProtocolSummaryApi } from "@/types/api/protocols";
import { withBasePath } from "@/utils/helpers";

interface ProtocolSummaryEntry {
  key: string;
  summary: ProtocolSummaryApi;
}

interface ProtocolPlanEntry {
  name: string;
  plan: ProtocolPlanApi;
}
const getAddOnPlanPricing = (availablePlans: Array<{ name: string; plan: any }>, addonPlanType: string) => {
  const addonPlan = availablePlans.find((plan) => plan.name === addonPlanType);
  if (addonPlan) {
    return {
      amount_month: addonPlan.plan.amount_month,
      amount_quarter: addonPlan.plan.amount_quarter,
      amount_year: addonPlan.plan.amount_year,
    };
  }
  return {
    amount_quarter: 0,
    amount_year: 0,
  };
};

const isProtocolSummary = (value: unknown): value is ProtocolSummaryApi => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const summary = value as Partial<ProtocolSummaryApi>;
  return "name" in summary || "protocol_id" in summary || "id" in summary;
};

const getProtocolSummaryEntry = (item: ProtocolDetailsApiItem): ProtocolSummaryEntry | undefined => {
  return Object.entries(item)
    .filter(([key]) => key !== "plans")
    .map(([key, value]) => (isProtocolSummary(value) ? { key, summary: value } : undefined))
    .find((entry): entry is ProtocolSummaryEntry => Boolean(entry));
};

const listProtocolPlans = (item: ProtocolDetailsApiItem): ProtocolPlanEntry[] => {
  if (!item.plans) return [];
  return Object.entries(item.plans)
    .map(([name, planItems]) => {
      if (!Array.isArray(planItems) || planItems.length === 0) return undefined;
      const plan = planItems[0];
      return { name, plan };
    })
    .filter((entry): entry is ProtocolPlanEntry => Boolean(entry));
};

const findProtocolRecord = (
  items: ProtocolDetailsApiItem[] | undefined,
  protocolId?: string,
  protocolName?: string,
): ProtocolDetailsApiItem | undefined => {
  if (!items || items.length === 0) return undefined;
  const normalizedId = protocolId?.toLowerCase();
  const normalizedName = protocolName?.toLowerCase();

  return items.find((item) => {
    const summaryEntry = getProtocolSummaryEntry(item);
    if (!summaryEntry) return false;
    const { summary } = summaryEntry;
    if (normalizedId) {
      if (summary.protocol_id && summary.protocol_id.toLowerCase() === normalizedId) return true;
      if (String(summary.id).toLowerCase() === normalizedId) return true;
    }
    if (normalizedName) {
      if (summary.name && summary.name.toLowerCase() === normalizedName) return true;
    }
    return false;
  });
};

const getPlanByName = (
  item: ProtocolDetailsApiItem | undefined,
  planName: string | null | undefined,
): ProtocolPlanApi | undefined => {
  if (!item || !planName) return undefined;
  const plans = item.plans?.[planName];
  if (!Array.isArray(plans) || plans.length === 0) return undefined;
  return plans[0];
};

const resolveProtocolIcon = (icon?: ProtocolSummaryApi["icon"]): string | undefined => {
  if (!icon) return undefined;
  if (
    typeof icon === "string" &&
    (icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("data:"))
  ) {
    return icon;
  }

  const normalized = typeof icon === "string" ? icon : "";
  if (!normalized) return undefined;

  const path = normalized.startsWith("/") ? normalized : `/assets/images/protocols/${normalized}`;
  return withBasePath(path);
};

export type { ProtocolSummaryEntry, ProtocolPlanEntry };
export {
  getProtocolSummaryEntry,
  listProtocolPlans,
  findProtocolRecord,
  getPlanByName,
  resolveProtocolIcon,
  getAddOnPlanPricing,
};
