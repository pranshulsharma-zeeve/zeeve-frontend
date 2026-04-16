import { NetworkType, States } from "./common";

/** type declaration of polygon network general information */
type NetworkGeneralInfo = {
  name: string;
  id: string;
  type: NetworkType;
  description?: null | string;
  createdAt: Date;
  status: States;
};

/** type declaration of polygon network cloud infra */
type NetworkCloudInfo = {
  cloudId: string;
  cloudName: string;
  managed: boolean;
  region: {
    id: string;
    region: string;
    region_name: string;
  };
  status: States;
};

/** type declaration of polygon network overview details */
type NetworkOverviewDetails = {
  generalInfo: NetworkGeneralInfo;
  cloudInfo: NetworkCloudInfo;
  nodes: Array<Node>;
};

type ValidatorNodeType = {
  node_id: number | string;
  node_name: string;
  network_id: number | string;
  cloud_id: string | number;
  region_id: string | number;
  endpoint: string;
  owned_by: string;
  owned_by_id: string;
  updated_at: string;
  created_at: string;
  redirection_url: string;
  status: string;
  analyticsUrl: string;
  inputs: {
    network: string;
    nodeType: string;
    networkType: string;
    nodeMonikerId: string;
    accountValidatorMonikerId: string;
    validatorName: string;
    delegationAmount: number;
    minDelegationAmount: number;
    website: string;
    description: string;
    commissionRate: number;
    commissionMaxRate: number;
    commissionMaxChangeRate: number;
    validatorIdentity: string;
    http: boolean;
    ws: boolean;
    email: string;
    cloudId: string;
    regionId: string;
    regionName: string;
    continentType: string;
  };
};

type TxnMethods =
  | "validator-identity"
  | "update-email"
  | "unbound-token"
  | "change-commission"
  | "update-validator-name"
  | "update-description"
  | "edit-website"
  | "withdraw-reward"
  | "withdraw-reward-to-address"
  | "stake-validator"
  | "unjail";

export type { NetworkGeneralInfo, NetworkCloudInfo, NetworkOverviewDetails, ValidatorNodeType, TxnMethods };
