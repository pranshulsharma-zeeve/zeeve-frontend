import { ArchivePlanType, RpcPlanType, ValidatorPlanType } from "./protocol";

interface PlanPricing<T extends string> {
  monthly: Partial<Record<T, number>>;
  quarterly: Partial<Record<T, number>>;
  yearly: Partial<Record<T, number>>;
}

interface NetworkOption {
  name: string;
  type: string;
  enabled: boolean;
}

export interface PlanOfferings {
  uptimeSLA: string;
  locations: string;
  bandwidth: string;
  support: string;
  monthlyLimit: string;
  ipWhitelist: boolean;
  domainCustomization: boolean;
  softwareUpgrades?: string;
  access?: string;
}

export interface ValidatorPlanOfferings {
  uptimeSLA: string;
  locations: string;
  bandwidth: string;
  support: string;
  standbyHardware: boolean;
}

export interface ProtocolPricingItem {
  protocolName: string;
  protocolDesc: string;
  protocolId: string;
  protocolIcon?: string | null;
  offerings: {
    full: Partial<Record<RpcPlanType, PlanOfferings>>;
  };
  networkType: {
    full: NetworkOption[];
  };
  serverLocations: {
    full: Partial<Record<RpcPlanType, string[]>>;
  };
  pricing: {
    nodePrice: {
      full: PlanPricing<RpcPlanType>;
    };
  };
}

export interface ArchiveProtocolPricingItem {
  protocolName: string;
  protocolDesc: string;
  protocolId: string;
  protocolIcon?: string | null;
  offerings: {
    archive: Partial<Record<ArchivePlanType, PlanOfferings>>;
  };
  networkType: {
    archive: NetworkOption[];
  };
  serverLocations: {
    archive: Partial<Record<ArchivePlanType, string[]>>;
  };
  pricing: {
    nodePrice: {
      archive: PlanPricing<ArchivePlanType>;
    };
  };
}

export interface ValidatorProtocolPricingItem {
  protocolName: string;
  protocolDesc: string;
  protocolId: string;
  protocolIcon?: string | null;
  offerings: {
    validator: Partial<Record<ValidatorPlanType, ValidatorPlanOfferings>>;
  };
  networkType: {
    validator: NetworkOption[];
  };
  serverLocations: {
    validator: Partial<Record<ValidatorPlanType, string[]>>;
  };
  pricing: {
    nodePrice: {
      validator: PlanPricing<ValidatorPlanType>;
    };
  };
}

export type { NetworkOption, PlanPricing };
