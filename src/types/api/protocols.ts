import { ApiNodeType, SubscriptionNodeType } from "../protocol";

type ProtocolPlanAmount = number | null | undefined;

interface ProtocolPlanApi {
  id: number;
  subscription_type: SubscriptionNodeType;
  bandwidth: string | null;
  domainCustomization: boolean;
  ipWhitelist: boolean;
  monthlyLimit: string | null;
  softwareUpgrades: string | null;
  support: string | null;
  uptimeSLA: string | null;
  amount_month: ProtocolPlanAmount;
  amount_quarter: ProtocolPlanAmount;
  amount_year: ProtocolPlanAmount;
  stripe_product_id: string | null;
  stripe_price_month_id: string | null;
  stripe_price_quarter_id: string | null;
  stripe_price_year_id: string | null;
  regions: string[];
  standbyHardware?: boolean;
}

interface ProtocolSummaryApi {
  id: number;
  protocol_id: string;
  name: string;
  notes: string | null;
  icon: string | false;
  network_types: string[];
}

type ProtocolPlanCollection = Record<string, ProtocolPlanApi[]>;

type ProtocolDetailsApiItem = {
  plans?: ProtocolPlanCollection;
} & {
  [protocolName: string]: ProtocolSummaryApi | ProtocolPlanCollection | undefined;
};

interface ProtocolDetailsApiResponse {
  success: boolean;
  data: ProtocolDetailsApiItem[];
  message: string;
}

type ProtocolDetailsApiData = ProtocolDetailsApiItem[];

export type {
  ApiNodeType,
  SubscriptionNodeType,
  ProtocolPlanApi,
  ProtocolSummaryApi,
  ProtocolPlanCollection,
  ProtocolDetailsApiItem,
  ProtocolDetailsApiResponse,
  ProtocolDetailsApiData,
};
